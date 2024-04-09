# In your user/signals.py (create this file if it doesn't exist)

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Contact

@receiver(post_save, sender=User)
def link_contact_to_user(sender, instance, created, **kwargs):
    if created:
        try:
            contact = Contact.objects.get(email=instance.email)
            contact.linked_user = instance
            contact.save()
        except Contact.DoesNotExist:
            pass
