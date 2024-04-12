from collections import defaultdict
from itertools import combinations
from rest_framework import generics, status
from .models import Calendar, Invitee, Availability, Contact
from .serializers import CalendarSerializer, InviteeSerializer, AvailabilitySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from django.contrib.auth.models import User
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.generics import GenericAPIView
from django.http import Http404


class CalendarView(generics.ListCreateAPIView):
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return Calendar.objects.filter(owner=self.request.user)
    
class CalendarDetailView(generics.RetrieveAPIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Calendar.objects.get(pk=pk, owner=user)
        except Calendar.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        calendar = self.get_object(pk, request.user)
        serializer = CalendarSerializer(calendar)
        return Response(serializer.data)

    def delete(self, request, pk):
        calendar = self.get_object(pk, request.user)
        calendar.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class InviteCalendar(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, calendar_id):
        try:
            calendar = Calendar.objects.get(id=calendar_id, owner=request.user)
        except Calendar.DoesNotExist:
            return Response({'error': 'Calendar not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)

        serializer = InviteeSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save(calendar=calendar)
            self.send_invitations(serializer.validated_data, calendar)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_invitations(self, invitees, calendar):
        for invitee in invitees:
            contact = invitee['contact']
            if hasattr(contact, 'linked_user'):  # Check if contact is linked to a user account
                self.send_invitation_email(calendar, contact)

    def send_invitation_email(self, calendar, contact):
        subject = f"Invitation to Schedule Meeting: {calendar.name}"
        message = f"Hi {contact.username},\n\nYou have been invited to schedule a meeting in the calendar '{calendar.name}'. Please visit the following link to specify your availability:\n\n{self.get_invitation_link(calendar, contact)}"
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [contact.email]

        send_mail(subject, message, from_email, recipient_list)

    def get_invitation_link(self, calendar, contact):
        return f"https://yourfrontenddomain.com/respond-to-invitation/?calendar_id={calendar.id}&contact_id={contact.id}"


class InvitationStatusView(ListAPIView):
    serializer_class = InviteeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        calendar_id = self.kwargs['calendar_id']
        return Invitee.objects.filter(calendar_id=calendar_id, calendar__owner=self.request.user)
    
class AvailabilityView(GenericAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return the queryset for the logged-in user's availability slots
        return Availability.objects.filter(user=self.request.user)

    def get(self, request):
        "Return the availability slots for the logged-in user"
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request) -> Response:
        "Add availability for the logged-in user"
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AvailabilityUpdateView(GenericAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs) -> Response:
        "Update availability for the logged-in user"
        pk = self.kwargs.get('pk')
        try:
            instance = Availability.objects.get(pk=pk, user=request.user)
        except Availability.DoesNotExist:
            return Response({'error': 'Availability not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class ContactAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve contact IDs from the request
        contacts = Contact.objects.filter(owner=request.user)
        contact_ids = [contact.linked_user.email for contact in contacts]

        # Convert email addresses to corresponding user IDs
        user_ids = []
        for identifier in contact_ids:
            if '@' in identifier:
                try:
                    contact_user = User.objects.get(email=identifier)
                    user_ids.append(contact_user.id)
                except User.DoesNotExist:
                    pass
            else:
                user_ids.append(int(identifier))

        # Get availabilities of linked contacts
        availabilities = Availability.objects.filter(user__id__in=user_ids)

        # Serialize the availabilities and return in the response
        serializer = AvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)

class SuggestedSchedulesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, calendar_id):
        try:
            calendar = Calendar.objects.get(id=calendar_id, owner=request.user)
        except Calendar.DoesNotExist:
            return Response({'error': 'Calendar not found'}, status=404)

        invitees = Invitee.objects.filter(calendar=calendar)
        user_list = [invitee.contact.linked_user for invitee in invitees if invitee.contact.linked_user] + [calendar.owner]
        invitee_availabilities = Availability.objects.filter(user__in=user_list)

        suggested_times = self.find_common_times(invitee_availabilities)

        if not suggested_times:
            return Response({'error': 'No common times found among invitees'}, status=404)

        return Response({'calendar_id': calendar_id, 'suggested_times': suggested_times})

    def find_common_times(self, availabilities) -> list:
        "Find common available times among the given availabilities"
        if not availabilities:
            return []

  
        availabilities_by_user = defaultdict(list)
        for availability in availabilities:
            availabilities_by_user[availability.user.id].append((availability.start_time, availability.end_time, availability.preference_level))

        # Find common times across users
        common_times = self.find_overlaps_among_users(availabilities_by_user)

        if not common_times:
            return []

        # Convert common times to string representation
        common_times_str = [f"{start.strftime('%Y-%m-%d %H:%M')} to {end.strftime('%Y-%m-%d %H:%M')}" for start, end in common_times]

        return common_times_str

    def find_overlaps_among_users(self, availabilities_by_user) -> list:
        """ Find overlapping time slots among the availabilities of different users """
        common_times = []

        # For each pair of users, find overlapping time slots
        for user1, user2 in combinations(availabilities_by_user.keys(), 2):
            user1_slots = availabilities_by_user[user1]
            user2_slots = availabilities_by_user[user2]

            # For each combination of slots, check for overlap
            for slot1 in user1_slots:
                for slot2 in user2_slots:
                    overlap = self.find_overlap(slot1, slot2)
                    if overlap:
                        common_times.append(overlap)

        # Remove duplicates
        common_times = list(set(common_times))
        return common_times

    def find_overlap(self, slot1, slot2):
        """ Find the overlap between two time slots """
       
        latest_start = max(slot1[0], slot2[0])
        earliest_end = min(slot1[1], slot2[1])
        if latest_start < earliest_end:  
            
            return (latest_start, earliest_end)
        else:
            return None
