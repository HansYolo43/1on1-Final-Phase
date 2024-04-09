from django.contrib import admin

# Register your models here.
from .models import Calendar
from .models import Invitee
from .models import Availability

admin.site.register(Calendar)
admin.site.register(Invitee)
admin.site.register(Availability)
