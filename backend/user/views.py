from django.http import Http404
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, ContactSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Contact
from django.contrib.auth.models import User


class CreateUserView(APIView):
    """Registration page."""

    permission_classes = [
        AllowAny
    ]  # anyone can register, no permissions required for this view

    def post(self, request):
        """Creates a new user."""
        serializer = UserSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    """User profile page."""

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """Returns user data."""
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        """Updates user data."""
        user = self.request.user
        serializer = UserSerializer(
            user, data=request.data, context={"request": request}, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactListView(APIView):
    """User contact list page."""

    permission_classes = [IsAuthenticated]  # only authenticated users can view contacts

    def get(self, request):
        """Returns the user's contact list."""
        contacts = Contact.objects.filter(owner=request.user)
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Creates a new contact for the user."""
        serializer = ContactSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactDetailView(APIView):
    """Contact detail page."""

    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        """Gets the contact object."""
        try:
            return Contact.objects.get(pk=pk, owner=user)
        except Contact.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        """Returns the contact's details."""
        contact = self.get_object(pk, request.user)
        serializer = ContactSerializer(contact)
        return Response(serializer.data)

    def put(self, request, pk):
        """Updates the contact's details."""
        contact = self.get_object(pk, request.user)
        serializer = ContactSerializer(
            contact, data=request.data, context={"request": request}, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Deletes the contact."""
        contact = self.get_object(pk, request.user)
        contact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
