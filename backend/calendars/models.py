from django.db import models
from django.contrib.auth.models import User
from user.models import Contact 

class Calendar(models.Model):
    owner = models.ForeignKey(User, related_name='calendars', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True, max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name
    
class Invitee(models.Model):
    calendar = models.ForeignKey(Calendar, related_name='invitees', on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, related_name='invitations', on_delete=models.CASCADE)
    has_responded = models.BooleanField(default=False)
    response = models.BooleanField(null=True, blank=True)  # True for accepted, False for declined, Null for no response

    def __str__(self):
        return f"{self.contact.name} invited to {self.calendar.name}"
    
class Availability(models.Model):
    user = models.ForeignKey(User, related_name='availabilities', on_delete=models.CASCADE)
    calendar = models.ForeignKey(Calendar, related_name='availabilities', on_delete=models.CASCADE, null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    preference_level = models.IntegerField(default=0)  # Lower means less preferred, higher means more preferred

    def __str__(self):
        return f"Availability for {self.user.username} from {self.start_time} to {self.end_time}"
