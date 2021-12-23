import json
from django.db import models
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from import_app.models import Company, GSTR1_gst, GSTSalesValues
import datetime
from tally.models import CustomGroup, Ledger
from user.models import SiteUser

MIS_CHOICES = (
    ("financial_dashboard","Financial Dashboard"),
    ("liquidity_barometer","Liquidity Barometer"),
    ("profit_loss", "Profit & Loss Account"),
    ("fund_flow", "Fund Flow Statement"),
    ("provisional_cash_flow", "Provisional Cashflow"),
    ("debtors_ageing", "Debtors Ageing Report"),
    ("creditors_ageing", "Creditors Ageing Report"),
    ("crucial_numbers","Crucial Numbers"),

)

class ScheduleConstant:
    MIS_SCHEDULE = "mis_schedule_mail_task"
    WEEKLY_MEETING = "task_meeting_thread"
    MEETING_CREATE = "notify_meeting_create"
    MEETING_CLOSE = "notify_meeting_close"
    MEETING_REMINDER = "meeting_reminder"
    TASK_REMINDER = "task_reminder"
    CRUCIAL_NUMBER_MAIL = "crucial_numbers_mail"
    QUERIES_MAIL = "ledgers_data_html_email"

SCHEDULE_TASK_CHOICES = (
    (ScheduleConstant.MIS_SCHEDULE, "mis_schedule_mail_task"),
    (ScheduleConstant.WEEKLY_MEETING, "task_meeting_thread"),
    (ScheduleConstant.MEETING_CREATE, "notify_meeting_create"),
    (ScheduleConstant.MEETING_CLOSE, "notify_meeting_close"),
    (ScheduleConstant.MEETING_REMINDER,  "meeting_reminder"),
    (ScheduleConstant.TASK_REMINDER, "task_reminder"),
    (ScheduleConstant.CRUCIAL_NUMBER_MAIL, "crucial_numbers_mail"),
    (ScheduleConstant.QUERIES_MAIL, "ledgers_data_html_email")
)
class CeleryScheduleTask(models.Model):
    task_name = models.CharField(max_length=40, choices=SCHEDULE_TASK_CHOICES, null=True,blank=True)
    cron = models.CharField(max_length=70, blank=True) # "<minutes (0-59)> <hour(0-23)> <day_of_week(0-7, 0,7, Sunday)> <day_of_month(1-31)> <month_of_year(1-12)>"
    on_datetime = models.DateTimeField(null=True,blank=True)
    task = models.OneToOneField(
        PeriodicTask,
        on_delete=models.CASCADE,
        related_name='celery_schedular',
        null=True,
        blank=True
    )
    instance_id = models.CharField(max_length=70, blank=True)
    class_name = models.CharField(max_length= 70, blank=True)
    start = models.DateTimeField()
    end = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def setup_task(self):
        print("=> Creating a CeleryScheduleTask")
        task = PeriodicTask(
            name=f'{self.created_at}',
            task=self.task_name,
            crontab=self.get_cron,
            kwargs=json.dumps({
                'instance_id': self.instance_id
            }),
            start_time=self.start,
            expires=self.end
        )
        task.save()
        self.task = task
        self.save()
        print("Task scheduled!")

    @property
    def get_cron(self):
        cron_parse = self.parse_cron_string()
        if cron_parse:
            if cron_parse[2] == "Daily" or 'Daily' in cron_parse[2].split(','):
                cron_parse[2] = "*"

            cron_schedule, _ = CrontabSchedule.objects.get_or_create(
                minute = cron_parse[0],
                hour = cron_parse[1],
                day_of_week = cron_parse[2],
                day_of_month = cron_parse[3],
                month_of_year = cron_parse[4],
            )
            return cron_schedule
        else:
            return None

    def parse_cron_string(self):
        if self.cron:   
            return self.cron.split(" ")
 
        elif self.on_datetime:
            d = datetime.datetime.strptime(self.on_datetime, '%Y-%m-%dT%H:%M:%S.%fZ')
            cron_parse =  (d.minute, d.hour, '*', d.day, d.month)
            return cron_parse
        else:
            print("Not parsed")
            return None


    def delete(self, *args, **kwargs):
        if self.task is not None:
            self.task.delete()
        return super(self.__class__, self).delete(*args, **kwargs)

class MISReportScheduleEmail(models.Model):
    cron = models.CharField(max_length=70, blank=True, default="0 17 * * *")
    schedule = models.OneToOneField(
        CeleryScheduleTask,
        on_delete=models.CASCADE,
        related_name='schedule_for_mis_report',
        null=True,
        blank=True
    )
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    mis_name = models.CharField(max_length=40, choices=MIS_CHOICES, null=True, blank=True)
    days = models.CharField(max_length=50,null=True, blank=True)
    is_daily = models.BooleanField(default=False)
    from_email = models.CharField(max_length=90,)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('company_id', 'mis_name','days',)
        verbose_name = 'MISReportScheduleEmail'
        verbose_name_plural = 'MISReportScheduleEmail'
        ordering = ['created_at']

    def __str__(self):
        return str(self.id)



class TallyPortalDifference(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    gst_r1 = models.ForeignKey(GSTR1_gst, on_delete=models.CASCADE)
    gst_sales = models.ForeignKey(GSTSalesValues, on_delete=models.CASCADE)
    txval = models.FloatField(null=True, blank=True)    
    sgst = models.FloatField(null=True, blank=True)
    igst = models.FloatField(null=True, blank=True)
    cgst = models.FloatField(null=True, blank=True)
    rate = models.FloatField(null=True, blank=True)

    def __str__(self):
        return str(self.id)

class Note(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, null=True, blank=True)
    custom_groups = models.ManyToManyField(CustomGroup, through='NoteCustomGroup')
    def __str__(self):
        return self.name


class NoteCustomGroup(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    custom_group = models.ForeignKey(CustomGroup, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)

class Report(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, null=True, blank=True)
    notes = models.ManyToManyField(Note, through="ReportNote")
    
    def __str__(self):
        return self.name

class ReportNote(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    note = models.ForeignKey(Note, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)

class ScriptMaster(models.Model):
    script_id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(SiteUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, null=True, blank=True)
    execution_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'ScriptMaster'
        verbose_name_plural = 'ScriptMaster'
        ordering = ['script_id']

    def __str__(self):
        return self.name