from user.models import SiteUser, EmployeeUser
from django.contrib.auth.base_user import BaseUserManager
from user.serializers import SiteUserListSerializer
from user.tasks import send_user_credentials

def get_or_create_user(name, email, mobile):
    try:
        user = SiteUser.objects.get(email=email)

        first_name, last_name = name, ""
        if ' ' in name:
            first_name, last_name = name.split(" ")

        user.first_name = first_name
        user.last_name = last_name
        user.mobile = mobile
        user.save()

        return user
    except SiteUser.DoesNotExist:
        first_name, last_name = name, ""
        if ' ' in name:
            first_name, last_name = name.split(" ")

        password_text = BaseUserManager().make_random_password()

        user = EmployeeUser.objects.create_superuser(
            first_name=first_name, last_name=last_name, email=email, password=password_text)
        user.mobile = mobile
        user.save()
        serializer = SiteUserListSerializer(user)
        userobj = serializer.data
        userobj['raw_password'] = password_text
        return user
