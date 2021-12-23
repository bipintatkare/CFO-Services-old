from django.db.models.signals import post_save
from django.dispatch import receiver
from reporting.models import MISReportScheduleEmail, CeleryScheduleTask, ScheduleConstant
import datetime
from reporting.tasks import schedule as schedule_task

@receiver(post_save, sender=MISReportScheduleEmail)
def create_or_update_mis_schedule_task(sender, instance, created, **kwargs):
    """
    On MISReportScheduleEmail create/update
    """
    print("In post_save => MISReportScheduleEmail signal")
    if created:
        print(f"Setting up schedule for: {instance.__class__.__name__}")
        context = {
            'task_name' : ScheduleConstant.CRUCIAL_NUMBER_MAIL, 
            'cron': instance.cron, 
            "on_datetime": None,
            'start': datetime.datetime.strftime(instance.created_at, "%Y-%m-%dT%H:%M:%S.%f"),
            'end': datetime.datetime.strftime(instance.created_at + datetime.timedelta(days=90), "%Y-%m-%dT%H:%M:%S.%f"),
            'instance_id': instance.id,                     # To Access data from object
            'class_name': instance.__class__.__name__,      # Update schedule to <instance>
        }
        schedule_task.apply_async(args=[], kwargs=context)
 

## COMMAN SCHEDULER FOR ALL CELERY TASKS
@receiver(post_save, sender=CeleryScheduleTask)
def create_or_update_celery_task(sender, instance, created, **kwargs):
    """
    On CeleryScheduleTask create/update
    """
    print("In post_save => CeleryScheduleTask signal")
    if created:
        instance.setup_task()
    else:
        if instance.task is not None:
            instance.task.enabled = True
            instance.task.save()
