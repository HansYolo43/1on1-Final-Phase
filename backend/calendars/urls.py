from django.urls import path
from .views import  CalendarDetailView, InvitationStatusView
from .views import ContactAvailabilityView, SuggestedSchedulesView , AvailabilityView, CalendarView , InviteCalendar, AvailabilityUpdateView

urlpatterns = [
 
    path('<int:calendar_id>/invitations/', InvitationStatusView.as_view(), name='invitation-status'),
    path('availability/contact/', ContactAvailabilityView.as_view(), name='contact-availability'),
    path('<int:calendar_id>/suggested-schedules/', SuggestedSchedulesView.as_view(), name='suggested-schedules'),

    path('<int:calendar_id>/invite/', InviteCalendar.as_view(), name='invite-list-create'), # 

    path('calendars/', CalendarView.as_view(), name='calendar-list-create'), # For listing and creating
    path('calendars/<int:id>/', CalendarDetailView.as_view(), name='calendar-detail'), # For detail

    path('availability/', AvailabilityView.as_view(), name='availability-list-create'),  # For listing and creating
    path('availability/<int:pk>/', AvailabilityUpdateView.as_view(), name='availability-detail-update'),  # For detail and update
]
