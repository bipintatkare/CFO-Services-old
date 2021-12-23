from __future__ import absolute_import
from celery import shared_task
from minutes_of_meeting.models import Meeting, Perticular, MeetingRecurringMeeting, RecurringMeeting, MeetingPerticular
from django.core.mail import EmailMessage
from django.template.loader import get_template, render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from minutes_of_meeting.serializers import MeetingSerializer, PerticularSerializer
from django.utils import timezone
from django.db.models import Q


@shared_task(name="task_meeting_thread")
def task_meeting_thread(*args, **kwargs):
    '''
    Trigger on Meeting scheduled weekly, It shows incomplete tasks/particulars 
    '''
    meeting_id = kwargs['meeting_id']
    meeting_obj = Meeting.objects.get(id=meeting_id)
    meeting = MeetingSerializer(meeting_obj).data

    meeting["base_url"]: settings.CFOSERVER_BASE_URL
    meeting["linkedin_icon_url"]: f"{settings.CFOSERVER_BASE_URL}/static/img/linkedin2x.png"
    meeting["cfo_logo_url"]:  f"{settings.CFOSERVER_BASE_URL}/static/img/cfo-logo.png"

    html_content = get_template('schedule_meeting.html')
    html = html_content.render(meeting)

    organizers = []
    for organizer in meeting_obj.organizer.all():
        organizers.append(organizer.email)

    particulars = []
    for particular in meeting_obj.perticular.all():
        particular.append(particular.organizer.email)

    sub = f"Weekly Meeting Update : {meeting.title}"
    email = EmailMessage(
        sub,
        html,
        to=[particulars],
        cc=[organizers]
    )
    email.content_subtype = 'html'
    email.send()


@shared_task(name="notify_meeting_create")
def notify_meeting_create(*arg, **meeting):
    '''
    Trigger on Meeting create, It shows meeting date-time, organizers/attendees 
    '''

    day = {
        "MON": 'Monday',
        "TUE": 'Tuesday',
        "WED": 'Wednesday',
        "THU": 'Thursday',
        "FRI": 'Friday',
        "SAT": 'Saturday',
        "SUN": 'Sunday',
        "Daily": "Daily"
    }

    # (minute, hour, day_of_week, day_of_month, month_of_year) = meeting['cron'].split(" ")

    attendees = []
    organizers = []
    for att in meeting['attendee']:
        if att['is_organizer']:
            organizers.append(att['attendee']['email'])
        else:
            attendees.append(att['attendee']['email'])

    sub = f"Meeting Invitation : {meeting['title']}"

    if not isinstance(attendees, list):
        attendees = [attendees]

    if not isinstance(organizers, list):
        organizers = [organizers]

    day = meeting['m_date'] # meeting date
    hour = 11
    minute = 00   
    print(meeting)
    context = {
        "thread_name": meeting["thread_name"],
        "agenda": meeting["summary"],
        "organizers": meeting['attendee'],
        "day": day,
        "time": f"{hour}:{minute}",
        "linkedin_icon_url": f"{settings.CFOSERVER_BASE_URL}/static/img/linkedin2x.png",
        "cfo_logo_url":  f"{settings.CFOSERVER_BASE_URL}/static/img/cfo-logo.png"
    }

    html_content = get_template('notify_meeting_creations.html')
    html = html_content.render(context)

    email = EmailMessage(
        sub,
        html,
        to=attendees,
        cc=organizers
    )
    email.content_subtype = 'html'
    email.send()
    print("notification sent!")


@shared_task(name="notify_meeting_close")
def notify_meeting_close(*args, **meeting):
    '''
    Trigger on Meeting close, It shows meeting assigned tasks and its complation time 
    '''
    print("Notify meeting close")
    attendees = []
    organizers = []
    for att in meeting['attendee']:
        if att['is_organizer']:
            organizers.append(att['attendee']['email'])
        else:
            attendees.append(att['attendee']['email'])

    sub = f"Meeting Close : {meeting['title']}"
    if not isinstance(attendees, list):
        attendees = [attendees]

    if not isinstance(organizers, list):
        organizers = [organizers]

    meeting["base_url"] = f"{settings.CFOSERVER_BASE_URL}"
    meeting["linkedin_icon_url"] = f"{settings.CFOSERVER_BASE_URL}/static/img/linkedin2x.png"
    meeting["cfo_logo_url"] = f"{settings.CFOSERVER_BASE_URL}/static/img/cfo-logo.png"

    html_content = get_template('notify_meeting_close.html')
    html = html_content.render(meeting)
    email = EmailMessage(
        sub,
        html,
        to=attendees,
        cc=organizers
    )
    email.content_subtype = 'html'
    email.send()
    print("notification sent!")


@shared_task(name="meeting_reminder")
def meeting_reminder(*args, **kwargs):
    '''
    Trigger on 11:00AM before meeting, Meeting Reminders setup with meeting 
    '''
    meeting_obj = Meeting.objects.get(id=kwargs["instance_id"])
    # Update perticulars
    if meeting_obj.is_recurring:
        recurring_meeting_id = MeetingRecurringMeeting.objects.filter(meeting_id=kwargs["instance_id"]).values_list("recurring_meeting_id", flat=True)
        result = RecurringMeeting.objects.filter(id__in=recurring_meeting_id).values("meetings", "meetings__m_date")
        now = timezone.now().date()
        # All previous meeting from today
        previous_meeting_list = [x for x in result if x["meetings__m_date"].date() < now]
        # Most previous meeting
        if previous_meeting_list:
            previous_meeting = min([i for i in previous_meeting_list], key=lambda x: abs(x["meetings__m_date"].date() - now))
            previous_meeting_obj = Meeting.objects.get(id=previous_meeting["meetings"])

            incomplate_tasks = MeetingPerticular.objects.filter(
                Q(meeting=previous_meeting["meetings"]) & Q(perticular__is_completed=False)).values_list("perticular_id", flat=True) 
            pending_tasks = []
            for per in incomplate_tasks:       
                p_task = MeetingPerticular(meeting_id=kwargs["instance_id"], perticular_id=per)
                pending_tasks.append(p_task)

            MeetingPerticular.objects.bulk_create(pending_tasks)
    
    meeting_obj = Meeting.objects.get(id=kwargs["instance_id"])
    meeting = MeetingSerializer(meeting_obj).data
    day = {
        "MON": 'Monday',
        "TUE": 'Tuesday',
        "WED": 'Wednesday',
        "THU": 'Thursday',
        "FRI": 'Friday',
        "SAT": 'Saturday',
        "SUN": 'Sunday',
        "Daily": 'Daily'
    }

    attendees = []
    organizers = []
    for att in meeting['attendee']:
        if att['is_organizer']:
            organizers.append(att['attendee']['email'])
        else:
            attendees.append(att['attendee']['email'])

    sub = f"Meeting Reminder : {meeting['title']}"

    if not isinstance(attendees, list):
        attendees = [attendees]

    if not isinstance(organizers, list):
        organizers = [organizers]

    meeting["base_url"] = f"{settings.CFOSERVER_BASE_URL}"
    meeting["linkedin_icon_url"] = f"{settings.CFOSERVER_BASE_URL}/static/img/linkedin2x.png"
    meeting["cfo_logo_url"] = f"{settings.CFOSERVER_BASE_URL}/static/img/cfo-logo.png"

    html_content = get_template('reminder_meeting.html')
    html = html_content.render(meeting)
    email = EmailMessage(
        sub,
        html,
        to=attendees,
        cc=organizers
    )
    email.content_subtype = 'html'
    email.send()
    print("notification sent!")


@shared_task(name="task_reminder")
def task_reminder(*args, **kwargs):
    '''
    Trigger on Task Reminders setup on creation of task 
    '''
    perticular_obj = Perticular.objects.get(id=kwargs["instance_id"])
    perticular_ser = PerticularSerializer(perticular_obj)
    perticular = perticular_ser.data
    html_content = get_template('reminder_task.html')
    html = html_content.render(perticular)
    email = EmailMessage(
        "Task Reminder",
        html,
        to=[perticular['organizer_email']],
        cc=[]
    )
    email.content_subtype = 'html'
    email.send()
    print("notification sent!")