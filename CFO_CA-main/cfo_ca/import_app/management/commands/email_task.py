from django.core.management.base import BaseCommand, CommandError

# from import_app.email_schedular_task import email_schedular_task,email_schedular_task23,email_schedular_task2, email_schedular_debt_age_report, email_schedular_cred_age_report
# from import_app.tasks import ledgers_data_html_email
from reporting.tasks import crucial_numbers_mail

class Command(BaseCommand):

    def handle(self, *args, **options):
        crucial_numbers_mail()
        # ledgers_data_html_email()
        # email_schedular_task23()
        # email_schedular_task2()
        # email_schedular_debt_age_report()
        # email_schedular_cred_age_report()
