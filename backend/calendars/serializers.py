# calendar/serializers.py
from rest_framework import serializers, generics
from .models import Calendar
from .models import Invitee
from .models import Availability
from rest_framework.permissions import IsAuthenticated

# TODO: Add extra_kwargs

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ['id', 'owner', 'name', 'description', 'start_date', 'end_date']
        read_only_fields = ['owner']

class InviteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitee
        fields = ['id', 'calendar', 'contact', 'has_responded', 'response']
        read_only_fields = ['has_responded', 'response']

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'user', 'start_time', 'end_time', 'preference_level']
        read_only_fields = ['user']  