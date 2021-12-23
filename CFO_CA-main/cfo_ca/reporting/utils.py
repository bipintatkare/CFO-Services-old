from reporting.models import MISReportScheduleEmail
from minutes_of_meeting.models import Meeting, Perticular

def update_schedule_to_instance(class_name, instance_id, task):
    if class_name == "MISReportScheduleEmail":
        obj = MISReportScheduleEmail.objects.get(id=instance_id)
        obj.schedule = task
        obj.save()
    elif class_name == "Meeting":
        obj = Meeting.objects.get(id=instance_id)
        obj.schedule = task
        obj.save()
    elif class_name == "Perticular":
        obj = Perticular.objects.get(id=instance_id)
        obj.schedule = task
        obj.save()
    else:
        print("Not available")