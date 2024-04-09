from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Contact
from django.core.exceptions import ValidationError
from django.core.validators import validate_email


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "confirm_password"]
        extra_kwargs = {
            "username": {"required": True},
            "email": {"required": True},
            "password": {
                "write_only": True,
                "required": True,
                "style": {"input_type": "password"},
            },
            "confirm_password": {
                "write_only": True,
                "required": True,
                "style": {"input_type": "password"},
            },
        }

    def create(self, validated_data):
        validated_data.pop(
            "confirm_password", None
        )  # remove confirm_password since it's not a model field
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.get("password")
        confirm_password = validated_data.pop("confirm_password", None)

        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)

        if password:
            if password != confirm_password:
                raise serializers.ValidationError(
                    {"password": "Password fields did not match."}
                )
            instance.set_password(password)

        instance.save()
        return instance

    def validate(self, data):
        # check if method is POST
        if self.context["request"].method == "POST":
            # check if username already exists
            if User.objects.filter(username=data.get("username")).exists():
                raise serializers.ValidationError(
                    {"username": "A user with that username already exists."}
                )
            # check if email is valid
            try:
                validate_email(data.get("email"))
            except ValidationError:
                raise serializers.ValidationError({"email": "Invalid email address."})
            # check if email already exists
            if User.objects.filter(email=data.get("email")).exists():
                raise serializers.ValidationError(
                    {"email": "A user with that email already exists."}
                )
            # check if password and confirm_password match
            if data.get("password") != data.get("confirm_password"):
                raise serializers.ValidationError(
                    {"password": "Password fields did not match."}
                )
        elif self.context["request"].method == "PUT":
            # check if username already exists (excluding the current user's username)
            if (
                User.objects.filter(username=data.get("username"))
                .exclude(id=self.instance.id)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"username": "A user with that username already exists."}
                )
            # check if email is valid
            if "email" in data:
                try:
                    validate_email(data.get("email"))
                except ValidationError:
                    raise serializers.ValidationError(
                        {"email": "Invalid email address."}
                    )
            # check if email already exists (excluding the current user's email)
            if (
                "email" in data
                and User.objects.filter(email=data.get("email"))
                .exclude(id=self.instance.id)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"email": "A user with that email already exists."}
                )
            # check if password and confirm_password match
            if "password" in data and data.get("password") != data.get(
                "confirm_password"
            ):
                raise serializers.ValidationError(
                    {"password": "Password fields did not match."}
                )
        return data


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ["id", "username", "email"]
        extra_kwargs = {"username": {"required": True}, "email": {"required": True}}

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)

        instance.save()
        return instance

    def validate(self, data):
        user = self.context["request"].user
        # check if username already exists as a contact for this user
        if Contact.objects.filter(owner=user, username=data.get("username")).exists():
            raise serializers.ValidationError(
                {"username": "A contact with that username already exists."}
            )
        # check if email already exists as a contact for this user
        if Contact.objects.filter(owner=user, email=data.get("email")).exists():
            raise serializers.ValidationError(
                {"email": "A contact with that email already exists."}
            )
        return data
