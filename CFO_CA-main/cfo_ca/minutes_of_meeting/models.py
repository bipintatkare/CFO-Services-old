import json
from django.db import models
from django.utils import timezone
from django_celery_beat.models import CrontabSchedule, IntervalSchedule, PeriodicTask
from user.models import SiteUser
from datetime import datetime, timedelta
from django.utils.timezone import make_aware
from import_app.models import Company
from reporting.models import CeleryScheduleTask


class MeetingThread(models.Model):
    """
    MeetingThread object create recurring meeting in specified time interval 
    """
    title = models.CharField(max_length=70, blank=False)
    organizer = models.ForeignKey(
        SiteUser, related_name='organizer_for_meeting_thread', on_delete=models.CASCADE)
    company = models.ForeignKey(
        Company, related_name='company_for_thread', null=True, blank=True, on_delete=models.CASCADE)
    summary = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'MeetingThread'
        verbose_name_plural = 'MeetingThreads'
        ordering = ['created_at']

class Perticular(models.Model):
    title = models.CharField(max_length=60, null=True, blank=True)
    organizer = models.ForeignKey(
        SiteUser, related_name='organizer_for_perticular', on_delete=models.CASCADE)
    completion_date = models.DateTimeField()
    is_completed = models.BooleanField(default=False)
    remark = models.CharField(max_length=200, null=True, blank=True)

    cron = models.CharField(max_length=250, null=True, blank=True)
    reminder = models.OneToOneField( # Reminders setup based on completion-date(ex. before 2 days)
        CeleryScheduleTask,
        related_name="reminder_for_task",
        blank=True,
        null=True,
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Perticular'
        verbose_name_plural = 'Perticular'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class MeetingUser(models.Model):
    is_present = models.BooleanField(default=False)
    is_organizer = models.BooleanField(default=False)    
    attendee = models.ForeignKey(
        SiteUser, related_name='attendee_for_attendence', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)

class Meeting(models.Model):
    """
    Meeting object create recurring meeting in specified time interval 
    """
    title = models.CharField(max_length=70, blank=False)
    summary = models.CharField(max_length=500, blank=True)
    meeting_thread = models.ForeignKey(
        MeetingThread, related_name='meeting_thread_for_meeting', on_delete=models.CASCADE,
        blank=True, null=True)

    status = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)
    is_recurring = models.BooleanField(default=False)
    attendee = models.ManyToManyField(MeetingUser, related_name="attendee_for_meeting", blank=True)
    perticular = models.ManyToManyField(Perticular, through='MeetingPerticular')
    m_date = models.DateTimeField()
    reminder = models.OneToOneField(
        CeleryScheduleTask,
        related_name="reminder_for_meeting",
        blank=True,
        null=True,
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Meeting'
        verbose_name_plural = 'Meeting'
        ordering = ['created_at']

    def __str__(self):
        return self.title

class RecurringMeeting(models.Model):
    title = models.CharField(max_length=70, blank=False)
    cron = models.CharField(max_length=250, null=True, blank=True)
    meetings = models.ManyToManyField(Meeting, through='MeetingRecurringMeeting')
    start_time = models.DateTimeField(default=datetime.now, blank=True)
    end_time = models.DateTimeField(default=datetime.now, blank=True)

    class Meta:
        verbose_name = 'RecurringMeeting'
        verbose_name_plural = 'RecurringMeeting'

    def __str__(self):
        return self.title


class MeetingRecurringMeeting(models.Model):
    meeting = models.ForeignKey(
        Meeting, related_name='meetings_for_recurring_meetings', on_delete=models.CASCADE)
    recurring_meeting = models.ForeignKey(
        RecurringMeeting, related_name='recurring_meeting', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)

class MeetingPerticular(models.Model):
    meeting = models.ForeignKey(
        Meeting, related_name='meetings', on_delete=models.CASCADE)
    perticular = models.ForeignKey(
        Perticular, related_name='perticulars', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)