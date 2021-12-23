from django.db.models.signals import post_save
from django.dispatch import receiver
from minutes_of_meeting.models import Meeting, Perticular, MeetingThread
from django.core.mail import EmailMessage
from minutes_of_meeting.serializers import MeetingSerializer
from minutes_of_meeting.tasks import notify_meeting_close, notify_meeting_create
from import_app.models import CompanyPerson
from reporting.models import ScheduleConstant
from reporting.tasks import schedule as schedule_task
import datetime
from django.utils.timezone import make_aware


@receiver(post_save, sender=Perticular)
def create_perticular(sender, instance, created, **kwargs):
    '''
    On Perticular create/update 
    '''
    if created:
        print(f"Setting meeting reminder schedule for: {instance.__class__.__name__}")
        context = {
            'task_name' : ScheduleConstant.TASK_REMINDER, 
            'cron': instance.cron,  # cron or on_datetime to schedule meeting, setup in views.py
            'on_datetime': None, 
            'start': datetime.datetime.now(),
            'end': datetime.datetime.now() + datetime.timedelta(days=30),
            'instance_id': instance.id,                     # To Access data from object
            'class_name': instance.__class__.__name__,      # Update schedule to <instance>
        }
        schedule_task.apply_async(args=[], kwargs=context)


@receiver(post_save, sender=Meeting)
def create_or_update_periodic_task(sender, instance, created, **kwargs):
    """
    On meeting create/update meeting
    """
    print("In post_save => Meeting signal")
    reminder_date = instance.m_date - datetime.timedelta(days=1)
    print("a day before reminder >>", reminder_date)
    if created:
        # Schedule Meeting Reminder
        cron_parse =  f"00 11 * {reminder_date.day} {reminder_date.month}"
        print(cron_parse)

        context = {
            'task_name' : ScheduleConstant.MEETING_REMINDER, 
            'cron': cron_parse,  # cron or on_datetime to schedule meeting
            'on_datetime': None, 
            'start': datetime.datetime.strftime(reminder_date - datetime.timedelta(days=1), "%Y-%m-%dT%H:%M:%S.%f"),
            'end': datetime.datetime.strftime(reminder_date + datetime.timedelta(days=1), "%Y-%m-%dT%H:%M:%S.%f"),
            'instance_id': instance.id,                     # To Access data from object
            'class_name': instance.__class__.__name__,      # Update schedule to <instance>
        }
        schedule_task.apply_async(args=[], kwargs=context)
    else:
        if instance.is_closed:
            serializer = MeetingSerializer(instance)
            print("On meeting close")
            print(serializer.data)
            notify_meeting_close.apply_async(args=[], kwargs=serializer.data)  
            print(f">> MEETING CLOSE MAIL SENT")


@receiver(post_save, sender=MeetingThread)
def create_company_person_on_create_thread(sender, instance, created, **kwargs):
    """
    On Create MeetingThread, Create CompanyPerson object 
    """
    print("In create_company_person_on_create_thread()")
    if created:
        if (instance.organizer is not None) and (instance.company is not None):
            kwargs = {
                "person": instance.organizer,
                "company": instance.company
            }
            company_person, created = CompanyPerson.objects.get_or_create(
                **kwargs)
