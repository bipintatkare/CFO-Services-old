import os
import sys
import traceback

import django
from django.db.models import Q, Sum
import threading
from django.core.mail import EmailMessage, send_mail, EmailMultiAlternatives, get_connection
from django.conf import settings
from django.template.loader import get_template
from .models import VoucherItem, DateWiseLedger, CrucialNumbers, CrucialNumbersBank, Ledgers,BalanceSheet,BSItem
from placc.models import AgeingReport, CreditorsAgeingReport


# settings.configure()
# django.setup()
# sys.path.append("..")
# print(os.path.dirname(os.path.realpath(__file__)))


class EmailThread(threading.Thread):
    def __init__(self, subject, html_content,sender, recipient_list):
        self.subject = subject
        self.recipient_list = recipient_list
        self.html_content = html_content
        self.sender = sender
        threading.Thread.__init__(self)

    def run(self):
        connection = get_connection(
            host='smtp.gmail.com',
            port=587,
            username='vikas.pandey9323@gmail.com',
            password='#Vikas@@9323',
            use_tls=True
        )
        msg = EmailMessage(self.subject, self.html_content, self.sender, self.recipient_list,connection=connection)
        msg.content_subtype = 'html'
        msg.send()


def send_html_mail(subject, html_content,sender, recipient_list ):
    EmailThread(subject, html_content,sender, recipient_list).start()

company_id_list = [39,38,47,49]
# company_id_list = [39,]
def email_schedular_task2():
    print("schedular2")
    import datetime
    from .models import ScheduleMail
    todays_date = datetime.datetime.today()
    all_schedules = ScheduleMail.objects.all().values('company_id__company_email','mis_name','days')
    # company_id_list = [39,38,47]
    for item in all_schedules:
        print("item['days']")
        print(item)

        for company_id in company_id_list:
            if item['mis_name'] == 'financial_dashboard':
                todays_weekday = datetime.datetime.today().strftime('%A')
                if todays_weekday.lower() in item['days'] or 'daily' in item['days']:
                    cont = {"test": "test", }
                    template = get_template('React_tables/FinancialDashboard.html')
                    html = template.render(cont)
                    send_html_mail("CFO Services - MIS", html, settings.EMAIL_HOST_USER, [item['company_id__company_email'], ])

            elif item['mis_name'] == 'cruicial_numbers' or 'daily' in item['days']:
                todays_weekday = datetime.datetime.today().strftime('%A')
                if todays_weekday.lower() in item['days'] or 'daily' in item['days']:
                    response_list = []
                    print("company_id")
                    print(company_id)
                    ledger_list = []
                    if company_id == 'undefined':
                        company_id = 28
                    todays_date = (datetime.datetime.today() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
                    # todays_date = "2020-12-29"
                    todays_date = datetime.datetime.strptime(todays_date, "%Y-%m-%d").date()
                    obj_list = VoucherItem.objects.filter(
                        Q(voucher_id__company_id=company_id) & Q(voucher_id__type_name__icontains='receipt') &Q(voucher_id__voucher_date=todays_date) & Q(
                            type='CR'))[0:10].values('id', 'ledger_name_temp', 'amt', 'voucher_id__v_date')

                    obj_ledgers = Ledgers.objects.filter(
                        Q(parent_str='Bank Accounts') & Q(company_id__id=company_id)).exclude(closing_balance=0)[
                                  0:10].values('id', 'name', 'closing_balance', )

                    for item32 in obj_list:
                        print(item32['ledger_name_temp'])
                        ledger_list.append(item32['ledger_name_temp'])
                        current_date = str(item32['voucher_id__v_date'])
                        item32.update(
                            {'voucher_id_date': current_date[6:8] + "/" + current_date[4:6] + "/" + current_date[0:4]})

                    from django.db.models.functions import TruncMonth
                    from django.db.models import Count
                    import calendar
                    sales_graph = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')).annotate(
                        month=TruncMonth('ledger_date')).values('month').annotate(ledger_amt=Sum('closing_balance')).values(
                        'month', 'ledger_amt')
                    receipt_graph = DateWiseLedger.objects.filter(Q(ledger_id__name=ledger_list)).annotate(
                        month=TruncMonth('ledger_date')).values('month').annotate(ledger_amt=Sum('closing_balance')).values(
                        'month', 'ledger_amt')
                    sales_month_list = []
                    sales_amount_list = []
                    receipt_amount_list = []
                    items_list = {}
                    for item2 in receipt_graph:
                        items_list.update({calendar.month_abbr[item2['month'].month]: item2['ledger_amt']})
                    for item2 in sales_graph:
                        sales_month_list.append(calendar.month_abbr[item2['month'].month])
                        sales_amount_list.append(item2['ledger_amt'])
                        if calendar.month_abbr[item2['month'].month] in items_list:
                            receipt_amount_list.append(items_list[calendar.month_abbr[item2['month'].month]])
                        else:
                            receipt_amount_list.append(0.0)
                    for item2 in obj_ledgers:
                        item2.update({'closing_balance': format(float(format(-1 * item2['closing_balance'], '.2f')), ',')})
                    for obj in obj_list:
                        obj.update({'amt': format(float(format(obj['amt'], '.2f')), ',')})

                    sales_todays = CrucialNumbers.objects.filter(company_id=company_id).order_by('-id')[0:1].values('id',
                                                                                                                    'todays_sale','monthly_cumulative','yearly_cumulative' )

                    banks_details = CrucialNumbersBank.objects.filter(company_id=company_id).values('id','bank_name','cr_amt','dr_amt' )
                    for single_obj in banks_details:
                        single_obj.update({
                            "dr_amt":str(single_obj['dr_amt']).replace("-","")
                        })
                    for_company = company_id
                    print("sales_todays ss")
                    print(sales_todays[0]['todays_sale'])
                    print(sales_todays[0]['monthly_cumulative'])
                    print(sales_todays[0]['yearly_cumulative'])
                    context = {
                        'obj_list': list(obj_list),
                        'obj_list_cond': True if len(obj_list)>0 else False,
                        'obj_ledgers': list(obj_ledgers),
                        'sales_actual_till_date': sales_todays[0]['todays_sale'],
                        'sales_actual_monthly': sales_todays[0]['monthly_cumulative'],
                        'sales_actual_yearly': sales_todays[0]['yearly_cumulative'],
                        'sales_month_list': sales_month_list,
                        'sales_amount_list': sales_amount_list,
                        'receipt_amount_list': receipt_amount_list,
                        'banks_details': list(banks_details),
                        'for_company': for_company,
                        'for_date': str(todays_date),
                        'last_sync': str(todays_date)+' 08:00 PM',
                    }
                    response_list.append(context)
                    template = get_template('React_tables/CFOMail_WOGraph.html')
                    html = template.render(context)
                    print("for Company"+for_company)

                    # print(sales_actual_yearly['closing_balance__sum'])
                    # send_html_mail(for_company+" - CRUCIAL NUMBERS MIS", html, 'vikas.pandey9323@gmail.com <CFO Services>',['vikas.pandey9323@gmail.com',])

                    send_html_mail(for_company+" - CRUCIAL NUMBERS MIS", html, 'vikas.pandey9323@gmail.com <CFO Services>',['accounts@atmsco.in',])

                    if (',' in item['company_id__company_email']):
                        send_html_mail(for_company+" - CRUCIAL NUMBERS MIS", html, 'vikas.pandey9323@gmail.com <CFO Services>',item['company_id__company_email'].split(','))
                    else:
                        send_html_mail(for_company+" - CRUCIAL NUMBERS MIS", html, 'vikas.pandey9323@gmail.com <CFO Services>',[item['company_id__company_email'],'accounts@atmsco.in', ])


def email_schedular_task23():
    print("starting...")
    import datetime
    from .models import ScheduleMail
    todays_date = datetime.datetime.today()
    all_schedules = ScheduleMail.objects.all().values('company_id__company_email', 'mis_name', 'days')

    # company_id_list = [39, 38, 47]
    for item in all_schedules:
        for company_id in company_id_list:
            if 1:
                id = company_id
                current_liablities_val = BalanceSheet.objects.filter(company_id=id,
                                                                     head_name='Current Liabilities').values(
                    'total_amt')
                current_assets_val = BalanceSheet.objects.filter(company_id=id, head_name='Current Assets').values(
                    'total_amt')
                current_liablities = BSItem.objects.filter(bs__company_id=id,
                                                           bs__head_name='Current Liabilities').exclude(amt=0).values(
                    'id', 'name', 'amt')
                current_assets = BSItem.objects.filter(bs__company_id=id, bs__head_name='Current Assets').exclude(
                    amt=0).values('id', 'name', 'amt')
                loans_liabilities = BSItem.objects.filter(bs__company_id=id, bs__head_name='Loans (Liability)').exclude(
                    amt=0).values('id', 'name', 'amt')

                for item2 in current_assets:
                    if (item2['amt'] < 0):
                        item2.update({'amt': format(-1 * item2['amt'], ',')})
                    else:
                        item2.update({'amt': format((item2['amt']), ',')})
                for item3 in current_liablities:
                    if (item3['amt'] < 0):
                        item3.update({'amt': format(item3['amt'], ',')})
                    else:
                        item3.update({'amt': format((item3['amt']), ',')})
                od_ac_value = 0.00
                occ_ac_value = 0.00
                for item4 in loans_liabilities:
                    if ('OD' in item4['name']):
                        od_ac_value = item4['amt']
                    elif ('OCC' in item4['name']):
                        occ_ac_value = format(item4['amt'], '.2f')
                if company_id == 39:
                    for_company = "CFO Services"
                elif company_id == 38:
                    for_company = "ATMS & Co LLP - Indirect"
                elif company_id == 47:
                    for_company = "ATMS & Co LLP - direct"
                elif company_id == 49:
                    for_company = "STARTUP BOX CONSULTANCY SERVICES LLP"
                total_value = 0.00
                total_value = format(
                    -float(current_assets_val[0]['total_amt']) - float(current_liablities_val[0]['total_amt']), '.2f')
                a_b_value_final = 0.0
                a_b_value_final = format(float(total_value) - float(od_ac_value) - float(occ_ac_value), '.2f')
                todays_date = (datetime.datetime.today() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')

                todays_date = datetime.datetime.strptime(todays_date, "%Y-%m-%d").date()

                context = {
                    'current_liablities': current_liablities,
                    'current_assets': current_assets,
                    'current_liablities_val': format(current_liablities_val[0]['total_amt'], ','),
                    'current_assets_val': format(-1 * current_assets_val[0]['total_amt'], ','),
                    'a_b_value': format(float(total_value), ','),
                    'a_b_value_final': format(float(a_b_value_final), ','),
                    'od_ac_value': format(od_ac_value, ','),
                    'occ_ac_value': format(occ_ac_value, ','),
                    'for_company': for_company,
                    'for_date': str(todays_date),
                    'last_sync': str(todays_date) + ' 08:00 PM',
                }
                template = get_template('React_tables/LiquidityBarometerOfBusiness.html')
                html = template.render(context)

                # send_html_mail(for_company+" - LBOB MIS", html, 'vikas.pandey9323@gmail.com <CFO Services>',['vikas.pandey9323@gmail.com',])

                send_html_mail(for_company + " - LBOB MIS", html, 'vikas.pandey9323@gmail.com <CFO Services>', ['accounts@atmsco.in', ])

                if (',' in item['company_id__company_email']):
                    send_html_mail(for_company + " - LBOB MIS", html, 'vikas.pandey9323@gmail.com <CFO Services>',
                                   item['company_id__company_email'].split(','))
                else:
                    send_html_mail(for_company + " - LBOB MIS", html, 'vikas.pandey9323@gmail.com <CFO Services>',
                                   [item['company_id__company_email'], 'accounts@atmsco.in', ])

def email_schedular_debt_age_report():
    print("starting...")
    import datetime
    from .models import ScheduleMail
    todays_date = datetime.datetime.today()
    all_schedules = ScheduleMail.objects.all().values('company_id__company_email', 'mis_name', 'days')

    # company_id_list = [39, 38, 47]
    for item in all_schedules:
        for company_id in company_id_list:
            if 1:
                id = company_id

                try:
                    ageing = AgeingReport.objects.filter(company_id__id=id).order_by('customer_name').values('customer_name')
                    distinct_list = ageing.distinct()
                    distinct_list = distinct_list.annotate(data_sum=Sum('amount'))

                    for obj in distinct_list:
                        ageing_list = AgeingReport.objects.filter(company_id__id=id,customer_name=obj['customer_name']).values('days','amount')
                        l_30_total = 0.0
                        g_30_l_60 = 0.0
                        g_60_l_90 = 0.0
                        g_90_l_120 = 0.0
                        g_120_l_180 = 0.0
                        g_180 = 0.0
                        for item in ageing_list:
                            if item['days'] <=30:
                                l_30_total=l_30_total+ float(item['amount'])
                            if item['days'] >30 and item['days'] <60:
                                g_30_l_60 = g_30_l_60 + float(item['amount'])
                            if item['days'] >60 and item['days'] <90:
                                g_60_l_90 = g_60_l_90 + float(item['amount'])
                            if item['days'] >90 and item['days'] <120:
                                g_90_l_120 = g_90_l_120 + float(item['amount'])
                            if item['days'] >120 and item['days'] <180:
                                g_120_l_180 = g_120_l_180 + float(item['amount'])
                            if item['days'] >=180:
                                g_180 = g_180 + float(item['amount'])
                        obj.update({'l_30_total': format(l_30_total,'.2f')})
                        obj.update({'g_30_l_60': format(g_30_l_60,'.2f')})
                        obj.update({'g_60_l_90': format(g_60_l_90,'.2f')})
                        obj.update({'g_90_l_120': format(g_90_l_120,'.2f')})
                        obj.update({'g_120_l_180': format(g_120_l_180,'.2f')})
                        obj.update({'g_180': format(g_180,'.2f')})

                        print(obj)
                    # ageing = AgeingReport.objects.values('customer_name').annotate(data_sum=Sum('amount'))
                    if company_id == 39:
                        for_company = "CFO Services"
                    elif company_id == 38:
                        for_company = "ATMS & Co LLP - Indirect"
                    elif company_id == 47:
                        for_company = "ATMS & Co LLP - direct"
                    elif company_id == 49:
                        for_company = "STARTUP BOX CONSULTANCY SERVICES LLP"

                    todays_date = (datetime.datetime.today() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
                    todays_date = datetime.datetime.strptime(todays_date, "%Y-%m-%d").date()
                    context = {
                        'ageing': distinct_list,
                        'for_company': for_company,
                        'type': "DEBTORS",
                        'for_date': str(todays_date),
                        'last_sync': str(todays_date) + ' 08:00 PM',
                    }
                    template = get_template('React_tables/DebtorsAndAgingReport.html')
                    html = template.render(context)

                    # send_html_mail(for_company+" - Debtors Ageing", html, 'vikas.pandey9323@gmail.com <CFO Services>',['vikas.pandey9323@gmail.com','suhas@atmsco.in',])

                    send_html_mail(for_company + " - Debtors Ageing", html, 'vikas.pandey9323@gmail.com <CFO Services>',
                                   ['accounts@atmsco.in', ])

                    if (',' in item['company_id__company_email']):
                        send_html_mail(for_company + " - Debtors Ageing", html, 'vikas.pandey9323@gmail.com <CFO Services>',
                                       item['company_id__company_email'].split(','))
                    else:
                        send_html_mail(for_company + " - Debtors Ageing", html, 'vikas.pandey9323@gmail.com <CFO Services>',
                                       [item['company_id__company_email'], 'accounts@atmsco.in', ])
                except Exception as e:
                    print("Exception:" + str(e))
                    print(traceback.print_exc())

def email_schedular_cred_age_report():
    print("starting...")
    import datetime
    from .models import ScheduleMail
    todays_date = datetime.datetime.today()
    all_schedules = ScheduleMail.objects.all().values('company_id__company_email', 'mis_name', 'days')

    # company_id_list = [39, 38, 47]
    for item in all_schedules:
        for company_id in company_id_list:
            if 1:
                id = company_id

                try:
                    ageing = CreditorsAgeingReport.objects.filter(company_id__id=id).order_by('customer_name').values('customer_name')
                    distinct_list = ageing.distinct()
                    distinct_list = distinct_list.annotate(data_sum=Sum('amount'))
                    l_30_total_final = 0.0
                    g_30_l_60_final = 0.0
                    g_60_l_90_final = 0.0
                    g_90_l_120_final = 0.0
                    g_120_l_180_final = 0.0
                    g_180_final = 0.0
                    total_amount_final = 0.0
                    for obj in distinct_list:
                        ageing_list = CreditorsAgeingReport.objects.filter(company_id__id=id,customer_name=obj['customer_name']).values('days','amount')
                        l_30_total = 0.0
                        g_30_l_60 = 0.0
                        g_60_l_90 = 0.0
                        g_90_l_120 = 0.0
                        g_120_l_180 = 0.0
                        g_180 = 0.0
                        for item in ageing_list:
                            if item['days'] <=30:
                                l_30_total=l_30_total+ float(item['amount'])
                            if item['days'] >30 and item['days'] <60:
                                g_30_l_60 = g_30_l_60 + float(item['amount'])
                            if item['days'] >60 and item['days'] <90:
                                g_60_l_90 = g_60_l_90 + float(item['amount'])
                            if item['days'] >90 and item['days'] <120:
                                g_90_l_120 = g_90_l_120 + float(item['amount'])
                            if item['days'] >120 and item['days'] <180:
                                g_120_l_180 = g_120_l_180 + float(item['amount'])
                            if item['days'] >=180:
                                g_180 = g_180 + float(item['amount'])
                        obj.update({'l_30_total': l_30_total})
                        obj.update({'g_30_l_60': g_30_l_60})
                        obj.update({'g_60_l_90': g_60_l_90})
                        obj.update({'g_90_l_120': g_90_l_120})
                        obj.update({'g_120_l_180': g_120_l_180})
                        obj.update({'g_180': g_180})
                        l_30_total_final=l_30_total_final+l_30_total
                        g_30_l_60_final=g_30_l_60_final+g_30_l_60
                        g_60_l_90_final=g_60_l_90_final+g_60_l_90
                        g_90_l_120_final=g_90_l_120_final+g_90_l_120
                        g_120_l_180_final=g_120_l_180_final+g_120_l_180
                        g_180_final=g_180_final+g_180
                        total_amount_final=total_amount_final+float(obj['data_sum'])

                        print(obj)

                    # ageing = AgeingReport.objects.values('customer_name').annotate(data_sum=Sum('amount'))
                    if company_id == 39:
                        for_company = "CFO Services"
                    elif company_id == 38:
                        for_company = "ATMS & Co LLP - Indirect"
                    elif company_id == 47:
                        for_company = "ATMS & Co LLP - direct"
                    elif company_id == 49:
                        for_company = "STARTUP BOX CONSULTANCY SERVICES LLP"

                    todays_date = (datetime.datetime.today() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
                    todays_date = datetime.datetime.strptime(todays_date, "%Y-%m-%d").date()
                    context = {
                        'ageing': distinct_list,
                        'type': "CREDITORS",
                        'for_company': for_company,
                        'for_date': str(todays_date),
                        'last_sync': str(todays_date) + ' 08:00 PM',
                        'l_30_total_final': l_30_total_final,
                        'g_30_l_60_final': g_30_l_60_final,
                        'g_60_l_90_final': g_60_l_90_final,
                        'g_90_l_120_final': g_90_l_120_final,
                        'g_120_l_180_final': g_120_l_180_final,
                        'g_180_final': g_180_final,
                        'data_sum_final': total_amount_final,
                    }
                    template = get_template('React_tables/DebtorsAndAgingReport.html')
                    html = template.render(context)

                    # 'suhas@atmsco.in',

                    # send_html_mail(for_company+" - Creditors Ageing", html, 'vikas.pandey9323@gmail.com <CFO Services>',['vikas.pandey9323@gmail.com',])

                    send_html_mail(for_company + " - Creditors Ageing", html, 'vikas.pandey9323@gmail.com <CFO Services>',
                                   ['accounts@atmsco.in', ])

                    if (',' in item['company_id__company_email']):
                        send_html_mail(for_company + " - Creditors Ageing", html, 'vikas.pandey9323@gmail.com <CFO Services>',
                                       item['company_id__company_email'].split(','))
                    else:
                        send_html_mail(for_company + " - Creditors Ageing", html, 'vikas.pandey9323@gmail.com <CFO Services>',
                                       [item['company_id__company_email'], 'accounts@atmsco.in', ])
                except Exception as e:
                    print("Exception:" + str(e))
                    print(traceback.print_exc())

def email_schedular_task():
    print("crontab")
    html='''
    <!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>CFO Services</title>

  <!-- Custom fonts for this template-->
  <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">


  <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>

</head>

<body id="page-top">



        <style type="text/css">

          * {
            font-family: 'Montserrat';
            background-color: white;

          }

          table {
            border-collapse: collapse;
            width: 100%;
            text-align: center;
            font-size: 13px;
            border: 1px solid #eee;
            border-bottom: 2px solid #00cccc;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.10),
            0px 10px 20px rgba(0,0,0,0.05),
            0px 20px 20px rgba(0,0,0,0.05),
            0px 30px 20px rgba(0,0,0,0.05);


          }

          th {

            padding: 8px;

          }

          td {
            border: 1px solid black;
            padding: 5px;

          }

          .alignL {
            text-align: left; padding-left: 15px;
            color: black;
            font-weight: 600;
            font-size: 13px;
          }

          .alignR {
            text-align: right; padding-right: 10px;
          }

        </style>


<center><h2> Financial Dashboard For Business Owners</h2> </center>
        <br>
        <br>


                 <table style="border-collapse: collapse;
            width: 100%;
            text-align: center;
            font-size: 13px;
            border: 1px solid #eee;
            border-bottom: 2px solid #00cccc;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.10),
            0px 10px 20px rgba(0,0,0,0.05),
            0px 20px 20px rgba(0,0,0,0.05),
            0px 30px 20px rgba(0,0,0,0.05);">
                  <tr style="border: 1px solid black;">
                    <th colspan="8" style="background: #606060; color: white; border-radius: 5px 5px 0px 0px; font-size: 15px; padding: 5px;">Sales </th>
                  </tr>
                  <tr style="border: 1px solid black;">
                    <td  style="border: 1px solid black;" colspan="4"> Current Month</td>
                    <td  style="border: 1px solid black;" colspan="4">Till Date</td>
                  </tr>

                  <tr style="border: 1px solid black;">
                    <td  style="border: 1px solid black;" colspan="2">Budget Figures</td>
                    <td  style="border: 1px solid black;" colspan="2">Actual Figures</td>
                    <td  style="border: 1px solid black;" colspan="2">Budget Figures</td>
                    <td  style="border: 1px solid black;" colspan="2">Actual Figures</td>
                  </tr>

                  <tr style="border: 1px solid black;">
                    <td  style="border: 1px solid black;" colspan="2"> </td>
                    <td  style="border: 1px solid black;" colspan="2">{{Item.sales_current_month}} </td>
                    <td  style="border: 1px solid black;" colspan="2"> {{Item.budget.sales}}</td>
                    <td  style="border: 1px solid black;" colspan="2">{{Item.sales_actual_till_date}}</td>

                  </tr>
                 </table><br/>
        <table style="border-collapse: collapse;
            width: 100%;
            text-align: center;
            font-size: 13px;
            border: 1px solid #eee;
            border-bottom: 2px solid #00cccc;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.10),
            0px 10px 20px rgba(0,0,0,0.05),
            0px 20px 20px rgba(0,0,0,0.05),
            0px 30px 20px rgba(0,0,0,0.05);">

                <tr style="border: 1px solid black;">
                  <th colspan="8" style="background-color: #606060; color: white; border-radius: 5px 5px 0px 0px; font-size: 15px; padding: 5px;">Gross Margin </th>
                </tr>
                <tr style="border: 1px solid black;">
                  <td  style="border: 1px solid black;" colspan="4"> Current Month</td>
                  <td  style="border: 1px solid black;" colspan="4">Till Date</td>
                </tr>

                <tr style="border: 1px solid black;">
                  <td  style="border: 1px solid black;">Budget %</td>
                  <td  style="border: 1px solid black;">Budget Figures</td>
                  <td  style="border: 1px solid black;">Actual %</td>
                  <td  style="border: 1px solid black;">Actual Figures</td>

                  <td  style="border: 1px solid black;">Budget %</td>
                  <td  style="border: 1px solid black;">Budget Figures</td>
                  <td  style="border: 1px solid black;">Actual %</td>
                  <td  style="border: 1px solid black;">Actual Figures</td>
                </tr>

                <tr style="border: 1px solid black;">
                  <td  style="border: 1px solid black;"> <br> </td>
                  <td  style="border: 1px solid black;"> </td>
                  <td  style="border: 1px solid black;">{{Item.gross_per_current_month}}</td>
                  <td  style="border: 1px solid black;">{{Item.gross_margin_current_month}}</td>

                  <td  style="border: 1px solid black;"> {{Item.budget.gross}}</td>
                  <td  style="border: 1px solid black;"> {{Item.budget.gross}}</td>
                  <td  style="border: 1px solid black;"> {{Item.gross_per_till_date}} %</td>
                  <td  style="border: 1px solid black;"> {{Item.gross_margin}} </td>
                </tr>
        </table><br/>
        <table style="border-collapse: collapse;
            width: 100%;
            text-align: center;
            font-size: 13px;
            border: 1px solid #eee;
            border-bottom: 2px solid #00cccc;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.10),
            0px 10px 20px rgba(0,0,0,0.05),
            0px 20px 20px rgba(0,0,0,0.05),
            0px 30px 20px rgba(0,0,0,0.05);">

              <tr style="border: 1px solid black;">
                <th colspan="8" style="background-color: #606060; color: white; border-radius: 5px 5px 0px 0px; font-size: 15px; padding: 5px;">Net Profit </th>
              </tr>
              <tr style="border: 1px solid black;">
                <td  style="border: 1px solid black;" colspan="4"> Current Month</td>
                <td  style="border: 1px solid black;" colspan="4">Till Date</td>
              </tr>

              <tr style="border: 1px solid black;">
                <td  style="border: 1px solid black;" colspan="2">Budget Figures</td>
                <td  style="border: 1px solid black;" colspan="2">Actual Figures</td>
                <td  style="border: 1px solid black;" colspan="2">Budget Figures</td>
                <td  style="border: 1px solid black;" colspan="2">Actual Figures</td>
              </tr>

              <tr style="border: 1px solid black;">
                <td  style="border: 1px solid black;" colspan="2"> </td>
                <td  style="border: 1px solid black;" colspan="2"> {{Item.net_profit_current_month}}</td>
                <td  style="border: 1px solid black;" colspan="2">{{Item.budget.nett}}</td>
                <td  style="border: 1px solid black;" colspan="2">{{Item.net_profit}} </td>
              </tr>
        </table><br/>
        <table style="border-collapse: collapse;
            width: 100%;
            text-align: center;
            font-size: 13px;
            border: 1px solid #eee;
            border-bottom: 2px solid #00cccc;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.10),
            0px 10px 20px rgba(0,0,0,0.05),
            0px 20px 20px rgba(0,0,0,0.05),
            0px 30px 20px rgba(0,0,0,0.05);">

            <tr style="border: 1px solid black;">
              <th colspan="8" style="background-color: #606060; color: white; border-radius: 5px 5px 0px 0px; font-size: 15px; padding: 5px;">Sundry Debtors (Accounts Receivable)</th>
            </tr>

            <tr style="text-align: left;border: 1px solid black;">
              <td  style="border: 1px solid black; padding-left: 15px;" colspan="4">Outstanding</td>
              <td  style="border: 1px solid black;" colspan="4">{{Item.SundryDebtors}}</td>
            </tr>

            <tr style="border: 1px solid black;">
              <td  style="border: 1px solid black;text-align: left; padding-left: 15px;" colspan="4">Number Of Days</td>
              <td  style="border: 1px solid black;" colspan="4">{{Item.no_of_days}}</td>
            </tr>

            <tr style="border: 1px solid black;">
              <td  style="border: 1px solid black;text-align: left; padding-left: 15px;" colspan="4">More Than 3 Months</td>
              <td  style="border: 1px solid black;" colspan="4"> {{Item.more_than_three_month_debtors}}</td>
            </tr>

            <tr style="border: 1px solid black;">
              <td  style="border: 1px solid black; text-align:left; padding-left: 15px;" colspan="4">More Than 6 Months</td>
              <td  style="border: 1px solid black;" colspan="4">{{Item.more_than_six_month_debtors}} </td>
            </tr>
        </table><br/>
        <table style="border-collapse: collapse;
            width: 100%;
            text-align: center;
            font-size: 13px;
            border: 1px solid #eee;
            border-bottom: 2px solid #00cccc;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.10),
            0px 10px 20px rgba(0,0,0,0.05),
            0px 20px 20px rgba(0,0,0,0.05),
            0px 30px 20px rgba(0,0,0,0.05);">

            <tr style="border: 1px solid black;">
              <th colspan="8" style="background-color: #606060; color: white; border-radius: 5px 5px 0px 0px; font-size: 15px; padding: 5px;">Sundry Creditors (Accounts Payable)</th>
            </tr>

            <tr style="text-align: left;border: 1px solid black;">
              <td  style="border: 1px solid black; padding-left: 15px;" colspan="4">Outstanding</td>
              <td  style="border: 1px solid black;" colspan="4">{{Item.SundryCreditors}}</td>
            </tr>

            <tr style="border: 1px solid black;">
              <td  style="border: 1px solid black;text-align: left; padding-left: 15px;" colspan="4">Number Of Days</td>
              <td  style="border: 1px solid black;" colspan="4">{{Item.no_of_days_creditors}}</td>
            </tr>

            <tr style="border: 1px solid black;">
              <td  style="border: 1px solid black;text-align: left; padding-left: 15px;" colspan="4">More Than 3 Months</td>
              <td  style="border: 1px solid black;" colspan="4"> {{Item.more_than_three_month_creditors}}</td>
            </tr>
        </table><br/>
        <table style="border-collapse: collapse;
            width: 100%;
            text-align: center;
            font-size: 13px;
            border: 1px solid #eee;
            border-bottom: 2px solid #00cccc;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.10),
            0px 10px 20px rgba(0,0,0,0.05),
            0px 20px 20px rgba(0,0,0,0.05),
            0px 30px 20px rgba(0,0,0,0.05);">


        <tr style="border: 1px solid black;">
          <th colspan="8" style="background-color: #606060; color: white; border-radius: 5px 5px 0px 0px; font-size: 15px; padding: 5px;">Inventories</th>
        </tr>

        <tr style="text-align: left;border: 1px solid black;">
          <td  style="border: 1px solid black; padding-left: 15px;" colspan="4">Valuation</td>
          <td  style="border: 1px solid black;" colspan="4">{{Item.Inventories}}</td>

          <tr style="border: 1px solid black;">
            <td  style="border: 1px solid black;text-align: left; padding-left: 15px;" colspan="4">Number Of Days</td>
            <td  style="border: 1px solid black;" colspan="4"></td>
          </tr>

          <tr style="border: 1px solid black;">
            <td  style="border: 1px solid black;text-align: left; padding-left: 15px;" colspan="4">In Stock For More Than 90 Days</td>
            <td  style="border: 1px solid black;" colspan="4"> </td>
          </tr>
        </table>
        <br/>
        <table style="border-collapse: collapse;
            width: 100%;
            text-align: center;
            font-size: 13px;
            border: 1px solid #eee;
            border-bottom: 2px solid #00cccc;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.10),
            0px 10px 20px rgba(0,0,0,0.05),
            0px 20px 20px rgba(0,0,0,0.05),
            0px 30px 20px rgba(0,0,0,0.05);">


        <tr style="border: 1px solid black;">
          <th colspan="8" style="background-color: #606060; color: white; border-radius: 5px 5px 0px 0px; font-size: 15px; padding: 5px;">Major Expenses</th>
        </tr>

        <tr style="border: 1px solid black;">
          <td  style="border: 1px solid black;text-align: left; padding-left: 15px;" rowspan="2" colspan="2">Perticulars</td>
          <td  style="border: 1px solid black;" colspan="3">Current Month</td>
          <td  style="border: 1px solid black;" colspan="3">Till Date</td>

        </tr>

        <tr style="border: 1px solid black;">
          <td  style="border: 1px solid black;" colspan="2">Budgeted Figures</td>
          <td  style="border: 1px solid black;" colspan="1">Actual Figures</td>
          <td  style="border: 1px solid black;" colspan="2">Budgeted Figures</td>
          <td  style="border: 1px solid black;" colspan="1">Actual Figures</td>
        </tr>

           {% for obj in Item.major_expenses %}

        <tr  style="border: 1px solid black;">
          <td  style="border: 1px solid blacktext-align: left; padding-left: 15px;"  colspan="2">{{obj.name}}</td>
          <td  style="border: 1px solid black;" colspan="1"><br></td>
          <td  style="border: 1px solid black;" colspan="2">{{obj.budget}}</td>
          <td  style="border: 1px solid black;"  colspan="1">{{obj.closing_balance}}</td>
        </tr>
           {% endfor %}

      </table>






</body>

</html>

    '''

    # send_html_mail("CFO Services - MIS", html, 'CFO Services <vikas.pandey9323@gmail.com>',['vikas.pandey9323@gmail.com','casuhasshinde@gmail.com','suhas@atmsco.in', ])

    html = '''
    <!DOCTYPE html>
<html>

<head>
	<title>s</title>
	<link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
	<style>

          * {
            font-family: 'Montserrat';
            background-color: white;

          }

          table {
            border-collapse: collapse;
            width: 100%;
            text-align: center;
            font-size: 13px;
            border: 1px solid #eee;
            border-bottom: 2px solid #00cccc;
            box-shadow: 0px 0px 20px rgba(0,0,0,0.10),
            0px 10px 20px rgba(0,0,0,0.05),
            0px 20px 20px rgba(0,0,0,0.05),
            0px 30px 20px rgba(0,0,0,0.05);


          }

          th {

            padding: 8px;

          }

          td {
            border: 1px solid black;
            padding: 5px;

          }

          .alignL {
            text-align: left; padding-left: 15px;
            color: black;
            font-weight: 600;
            font-size: 13px;
          }

          .alignR {
            text-align: right; padding-right: 10px;
          }


</style>
</head>
<body>
<center>
<h1 style="font-family: 'Montserrat';"> Liquidity Barometer Of Business</h1>
<table style="width: 80%;">
	<tr>
		<th style="width: 70%; text-align: center; background-color: #606060; color: white;">  Perticulars </th>
		<th style="text-align: center; background-color: #606060; color: white;">Amounts </th>
	</tr>
	<tr>
		<td>&nbsp; </td>
		<td> </td>
	</tr>

	<tr>
		<td class="align">Inventory / Stock</td>
		<td></td>

	</tr>

	<tr>
		<td class="align"> Debtors / Accounts Receivable </td>
		<td></td>
	
	</tr>

	<tr>
		<td class="align">Bank / Cash In Hand</td>
		<td></td>
	</tr>

	<tr>
		<td>&nbsp; </td>
		<td> </td>
	</tr>

	<tr>
		<th class="align">Total Current Assets (A)</th>
				<th></th>

	</tr>


	<tr>
		<td>&nbsp; </td>
		<td> </td>
	</tr>

	<tr>
		<td class="align">Taxes & Expenses Payable </td>
		<td></td>
	</tr>

	<tr>
		<td class="align">Creditors / Accounts Payable </td>
		<td></td>
	</tr>

	<tr>
		<td>&nbsp; </td>
		<td> </td>
	</tr>

	<tr>
		<th class="align">Total Current Liabilities (B)</th>
				<th> </th>

	</tr>

	<tr>
		<td>&nbsp; </td>
		<td> </td>
	</tr>

	<tr>
		<th class="align">Net Liquid Funds (A-B)</th>
		<th></th>
	</tr>

	<tr>
		<td>&nbsp; </td>
		<td> </td>
	</tr>

	<tr>
		<td class="align"> Less: Bank Overdraft Utilized</td>
				<td></td>

	</tr>

	<tr>
		<td>&nbsp; </td>
		<td> </td>
	</tr>

	<tr>
		<th class="align">Net Liquidity In Company</th>
				<th></th>

	</tr>
	<tr>
		<td> </td>
		<td> </td>
	</tr>

</table>




 </center>
</body>
</html>
    '''
    # send_html_mail("CFO Services - MIS", html, 'CFO Services <vikas.pandey9323@gmail.com>',['vikas.pandey9323@gmail.com','casuhasshinde@gmail.com','suhas@atmsco.in', ])

    obj_list = VoucherItem.objects.filter(
        Q(voucher_id__company_id=28) & Q(voucher_id__type_name__icontains='receipt') & Q(type='CR'))[
               0:10].values('id', 'ledger_name_temp', 'amt', 'voucher_id__v_date')
    print(obj_list)

    html_crucial_numbers = '''
    <!doctype html>
<html>
  <head>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">

  </head>
  <body>
    <div class="container" id='container' >
     
<div id="wrapper">
<h4>Dear Owner,<br>here is your CRUCIAL NUMBERS Report by CFO Services</h4>
<center>
  <div class="container" style="background-color: #fff;">
    <br>
    <h1>Crucial Numbers As On Date - 02/12/2020 - R K Automobiles</h1>
    <br>

    <table style="border-collapse: collapse; width: 100%;" class="table table table-bordered">
            <thead class="thead-dark">
              <tr>
                <th scope="col" colspan="4" style="padding-top: 12px; padding-bottom: 12px; background-color: #343a40; color: white; text-align: center;"><center>Sales</center></th>
              </tr>
            </thead>
            <tbody>
              <tr  style="background-color: #f2f2f2; text-align: center;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="2"><center>For The Day</center></th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center>Monthly Cumulative  </center></th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center>Yearly Cumulative </center></th>
              </tr>
              <tr style="background-color: #fff;">
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="2"><center> {{sales_actual_till_date}} </center></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center> {{sales_actual_monthly}} </center> </td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center> {{sales_actual_yearly}} </center> </td>

              </tr>


             </tbody>
      </table>

    <br>

      <table style="border-collapse: collapse; width: 100%;" class="table table table-bordered">
            <thead class="thead-dark">
              <tr>
                <th scope="col" colspan="3" style="padding-top: 12px; padding-bottom: 12px; background-color: #343a40; color: white; text-align: center;"><center>Receipts</center></th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f2f2f2; text-align: center;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center>Date</center></th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center>Customer Name   </center></th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center>Amount  </center></th>
              </tr>
               {% for item in obj_list %}
              <tr style="background-color: #fff;">
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center> {{item.voucher_id_date}}  </center></td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center> {{item.ledger_name_temp}} </center> </td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center> {{item.amt}} </center> </td>

              </tr>
            {% endfor %}




             </tbody>
      </table>


    <br>

      <table  style="border-collapse: collapse; width: 100%;" class="table table table-bordered">
            <thead class="thead-dark">
              <tr>
                <th scope="col" colspan="2" style="padding-top: 12px; padding-bottom: 12px; background-color: #343a40; color: white; text-align: center;"><center>Bank Balance</center></th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f2f2f2; text-align: center;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center>Name of the Bank </center></th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center>Amount  </center></th>
              </tr>
              {% for item in obj_ledgers %}
              <tr style="background-color: #fff; text-align: center;">
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center> {{item.name}}   </center> </td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" scope="row" colspan="1"><center> {{item.closing_balance}} </center> </td>

              </tr>
            {% endfor %}

             </tbody>
      </table>

    <br>
    <br>
<h5>Last Sync- 02/12/2020 01:00 PM</h5>


  
  
  </div>
</center>
    <h4>POWERED BY CFO Services</h4>
</div>





    </div>


  </body>
</html>'''
    send_html_mail("CFO Services - MIS", html_crucial_numbers, 'CFO Services <vikas.pandey9323@gmail.com>',['vikas.pandey9323@gmail.com','info@farintsol.com' ])
