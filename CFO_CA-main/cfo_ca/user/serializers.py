from django.conf import settings
from django.db import transaction
from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from .models import SiteUser


class SiteUserListSerializer(serializers.ModelSerializer):

    under = serializers.PrimaryKeyRelatedField(
        queryset=SiteUser.objects.all())
    class Meta:
        model = SiteUser
        fields = [
            "id",
            "first_name",
            "last_name",
            "mobile",
            "email",
            "auto_timedate",
            "user_type",
            "under"
        ]
        depth = 2
