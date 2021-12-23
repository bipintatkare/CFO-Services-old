from celery import shared_task
from .models import Ledgers, VoucherItem, Company
import datetime
from django.db.models import Q, Sum
from django.core.mail import EmailMessage, send_mail, EmailMultiAlternatives, get_connection
from django.template.loader import get_template
from django.utils.timezone import make_aware
from django.db.models import Q
from djqscsv import write_csv
from cfo_ca import settings
from .queries import get_ledgers_queryset, QUERIES, get_vouchers_queryset

@shared_task(name="ledgers_data_email")
def ledgers_data_email(*args, **kwargs):
    print("Sending mail")
    today = datetime.date.today()

    company_list = kwargs['company_list']
    script_master_id = kwargs['script_master_id']
    email = kwargs['email']

    if (script_master_id == 4 or script_master_id == 12):
        queryset = get_vouchers_queryset(**kwargs)
    else:
        queryset = get_ledgers_queryset(**kwargs)

    filename = f'{script_master_id}-{today}.csv'
    file_path = settings.MEDIA_ROOT +"/"+ filename 
    with open(file_path, 'wb') as csv_file:
        write_csv(queryset, csv_file)

    with open(file_path, 'rb') as csv_file:
        email = EmailMessage(
            f"Query : {QUERIES[script_master_id]}",
            'Please find the attached file herewith',
            email,
            to=[email],
        )
        email.attach(filename, csv_file.read(), 'text/csv')
        print(email)
        email.send()

@shared_task(name="ledgers_data_html_email")
def ledgers_data_html_email(*args, **kwargs):
    print("Sending mail")
    today = datetime.date.today()
    todays_date = (datetime.datetime.today() - datetime.timedelta(days=0)).strftime('%Y-%m-%d')
    todays_date = datetime.datetime.strptime(todays_date, "%Y-%m-%d").date()

    for key, value in QUERIES.items():
        # valid_quer_ids = [23,]
        valid_quer_ids = [2,22,41,12,23]

        if key in valid_quer_ids:
            # company_list = Company.objects.values_list('id',flat=True)
            company_list = [5,]
            context = {
                'company_list': company_list,
                "script_master_id": key,
                "from_date": "2021-04-01",
                "to_date": todays_date,
                "email": "vikas.pandey9323@gmail.com,suhas@atmsco.in,info@farintsol.com",
                # "email": "vikas.pandey9323@gmail.com,",
            }

            if (key == 4 or key == 12 or key == 41):
                queryset = get_vouchers_queryset(**context)
            else:
                queryset = get_ledgers_queryset(**context)

            detail_queryset = {
                "script_master_id":key,
                "queryset":queryset,
                "data":str(value)+" For Company "+Company.objects.get(id=5).company_name,
                "last_sync":str(todays_date)+" 8:00 PM",
            }
            if key == 2 or key == 3:
                template = get_template('React_tables/query_2_3.html')
            elif key == 8:
                template = get_template('React_tables/query_2_3.html')
            elif key == 23:
                template = get_template('React_tables/query_2_3.html')
                detail_queryset.update({"total":queryset.aggregate(Sum('closing_balance'))['closing_balance__sum']})
            elif key == 41 or key == 12:
                template = get_template('React_tables/voucher_query.html')


            html = template.render(detail_queryset)
            to = context['email'].split(",")
            email = EmailMessage(
                value,
                html,
                to=to,
            )
            email.content_subtype = 'html'
            email.send()
            print("emailll sent!")




