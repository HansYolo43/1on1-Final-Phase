from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("new/", views.CreateUserView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="login_refresh"),
    path("user/", views.UserView.as_view(), name="user"),
    path("contacts/", views.ContactListView.as_view(), name="contacts"),
    path(
        "contacts/<int:pk>/", views.ContactDetailView.as_view(), name="contact_detail"
    ),
]
