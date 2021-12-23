from django.db import models
import datetime
import random
import os
from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone
from django.utils.safestring import mark_safe
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser,
    User)

phone_regex = RegexValidator(regex=r'^\+?1?\d{9,10}$',
                             message="Phone number must be entered in the format: '+999999999'. Up to 10 digits allowed.")

class UserType:
    EMPLOYEE = 'employee'
    MANAGER = 'manager'
    PARTNER = 'partner'
    ADMIN = 'admmin'

USER_TYPE_CHOICES = [
    ( UserType.EMPLOYEE, 'Employee user'),
    ( UserType.MANAGER, 'Manager user'),
    ( UserType.PARTNER, 'Partner user'),
    ( UserType.ADMIN, 'Admin user'),
]

class SiteUserManager(BaseUserManager):
    """Creates and saves a User with the given email, first_name, last_name  and password."""

    def create_user(self, email, first_name, last_name, password=None, dob=None, is_staff=False, is_active=True,
                    is_admin=False,):
        # if not mobile:
        #     raise ValueError('user must have a phone number')
        if not email:
            raise ValueError('user must have a email')

        if not password:
            raise ValueError('user must have a password')

        user = self.model(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            dob=dob,
        )

        user.set_password(password)
        user.staff = is_staff
        user.admin = is_admin
        user.active = is_active
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, dob=None):
        user = self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            dob=dob,

        )
        user.is_admin = True
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, first_name, last_name, user_type, password=None, dob=None):
        user = self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            user_type=user_type,
            password=password,
            dob=dob,

        )
        user.is_staff = True
        user.save(using=self._db)
        return user

    def get_filename_ext(filepath):
        base_name = os.path.basename(filepath)
        name, ext = os.path.splitext(base_name)
        return name, ext

    def upload_image_path(instance, filename):
        # print(instance)
        # print(filename)
        new_filename = random.randint(1, 39534654564)
        name, ext = instance.get_filename_ext(filename)
        final_filename = '{new_filename}{ext}'.format(
            new_filename=new_filename, ext=ext)
        return "profilepictures/{new_filename}/{final_filename}".format(
            new_filename=new_filename,
            final_filename=final_filename
        )


class SiteUser(AbstractBaseUser):
    mobile = models.CharField(
        validators=[phone_regex], max_length=10)
    email = models.EmailField('Email-id', max_length=255, unique=True)
    first_name = models.CharField('First Name', max_length=30)
    last_name = models.CharField('Last Name', max_length=30)
    password_text = models.CharField(max_length=20)
    under = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)


    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    dob = models.DateField(null=True, blank=True)
    user_type = models.CharField(choices=USER_TYPE_CHOICES, max_length=20, default=UserType.EMPLOYEE)
    using_software = models.BooleanField(default=False)
    auto_timedate = models.DateTimeField(default=timezone.now, blank=True)

    objects = SiteUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

    @is_staff.setter
    def is_staff(self, value):
        self._is_staff = value


class AdminUserManager(SiteUserManager):
    def get_queryset(self):
        return super(AdminUserManager, self).get_queryset().filter(user_type=USER_TYPE_CHOICES[2][0])
class AdminUser(SiteUser):
    objects = AdminUserManager()
    class Meta:
        proxy = True


    def save(self, *args, **kwargs):
        self.user_type = UserType.ADMIN
        super(AdminUser, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class PartnerUserManager(SiteUserManager):
    def get_queryset(self):
        return super(PartnerUserManager, self).get_queryset().filter(user_type=USER_TYPE_CHOICES[1][0])
class PartnerUser(SiteUser):
    objects = PartnerUserManager()
    class Meta:
        proxy = True


    def save(self, *args, **kwargs):
        self.user_type = UserType.PARTNER
        super(PartnerUser, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"



class EmployeeUserManager(SiteUserManager):
    def get_queryset(self):
        return super(EmployeeUserManager, self).get_queryset().filter(user_type=USER_TYPE_CHOICES[0][0])
class EmployeeUser(SiteUser):
    objects = EmployeeUserManager()
    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        self.user_type = UserType.EMPLOYEE
        super(EmployeeUser, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"