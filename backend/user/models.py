from django.db import models
from django.contrib.auth.models import User


class Contact(models.Model):
    # the "owner" of the contact (references the User model)
    owner = models.ForeignKey(User, related_name="contacts", on_delete=models.CASCADE)
    # name and email of the contact
    username = models.CharField(max_length=100)
    email = models.EmailField()
    linked_user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="linked_contact",
    )

    class Meta:
        app_label = "user"

    def __str__(self):
        return self.username
