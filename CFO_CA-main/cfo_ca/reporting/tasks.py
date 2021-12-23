import traceback
from celery import shared_task
from reporting.models import MISReportScheduleEmail, CeleryScheduleTask
from import_app.models import Company, BSItem, VoucherItem, DateWiseLedger, CrucialNumbers, CrucialNumbersBank, Ledgers, BalanceSheet, ScheduleMail
import datetime
from django.db.models import Q, Sum
from django.core.mail import EmailMessage, send_mail, EmailMultiAlternatives, get_connection
from django.template.loader import get_template
from placc.models import AgeingReport, CreditorsAgeingReport
from reporting.utils import update_schedule_to_instance
from django.utils.timezone import make_aware
# from datetime import datetime, timedelta



@shared_task(name="schedule")
def schedule(*args, **kwargs):
    '''
    Schedule Task with celery
    '''
    task_name = kwargs["task_name"]
    cron = kwargs["cron"]
    if "on_datetime" in kwargs:
        on_datetime = kwargs["on_datetime"]
    else:
        on_datetime = None
    start = kwargs["start"]
    end = kwargs["end"]
    instance_id = kwargs["instance_id"]
    class_name = kwargs["class_name"]

    print(kwargs)
    start = make_aware(datetime.datetime.strptime(start, "%Y-%m-%dT%H:%M:%S.%f"))
    end = make_aware(datetime.datetime.strptime(end, "%Y-%m-%dT%H:%M:%S.%f"))

    print(f">> Task name: {task_name}")
    print(f">> Cron: {cron}")
    print(f">> On datetime: {on_datetime}")
    print(f">> Start: {start}")
    print(f">> End: {end}")
    print(f">> Instance ID: {instance_id}")
    print(f">> class_name : {class_name}")
    task , created = CeleryScheduleTask.objects.get_or_create(
        task_name = task_name,
        cron = cron,
        on_datetime = on_datetime,
        start = start,
        end =  end,
        instance_id = instance_id,
        class_name = class_name
    )
    if created:
        print(f"Updating task to {class_name}")
        update_schedule_to_instance(class_name, instance_id, task)
        print("Scheduled!")
    else:
        print("Somthing went wrong!")


@shared_task(name='crucial_numbers_mail')
def crucial_numbers_mail(*args, **kwargs):
    print(args)
    print(kwargs)
    print("starting...")
    dev_emails = ['vikas.pandey9323@gmail.com',] #Exception Reports will be sent
    cc_emails_error = ['vikas.pandey9323@gmail.com',] #Exception Reports will be sent
    cc_emails_for_testing = ['vikas.pandey9323@gmail.com',]
    # cc_emails_for_testing = ['accounts@atmsco.in',]
    response_list = []
    all_scheduled_mis = Company.objects.all().values()
    # all_scheduled_mis = Company.objects.filter(id__in=[1,3,5,]).values()
    all_scheduled_mis = ScheduleMail.objects.all().values()
    todays_date = (datetime.datetime.today() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    # todays_date = "2020-12-29"
    todays_date = datetime.datetime.strptime(todays_date, "%Y-%m-%d").date() #to check previous day sync status
    print(todays_date)
    print(all_scheduled_mis)
    for company in all_scheduled_mis:
        print(company)
        company_obj = Company.objects.get(id=company["company_id_id"])
        company_id = company_obj.id
        if company["mis_name"] == "debtors_ageing":
            if AgeingReport.objects.filter(company_id__id=company_id,auto_timedate__date=todays_date).count()>0:
                try:
                    ageing = AgeingReport.objects.filter(company_id__id=company_id).order_by('customer_name').values('customer_name')
                    distinct_list = ageing.distinct()
                    distinct_list = distinct_list.annotate(data_sum=Sum('amount'))

                    for obj in distinct_list:
                        ageing_list = AgeingReport.objects.filter(company_id__id=company_id,customer_name=obj['customer_name']).values('days','amount')
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
                    for_company = company_obj.company_name
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

                    email = EmailMessage(
                        for_company + " - Debtors Ageing",
                        html,
                        to=company_obj.company_email if company_obj.company_email != None and "," in company_obj.company_email else [
                            company_obj.company_email, ],
                        cc=['gauravndabhade@outlook.com']
                    )
                    email.content_subtype = 'html'
                    email.send()
                    print("notification sent!")
                except Exception as e:
                    print("Exception in debtors_ageing:" + str(e))
                    print(traceback.print_exc())
                    msg = EmailMultiAlternatives("Exception Occurred - CFO Services", "Hello User,\nCompany ID: " + str(company_obj.pk) + "\nMIS Name: "+str(company["mis_name"])+"\nStatus: Exception Occurred - " + str(
                                       e) + "\nStack Trace: " + str(traceback.format_exc()), to=dev_emails,cc=cc_emails_error+cc_emails_for_testing,)
                    msg.send()
            else:
                msg = EmailMultiAlternatives("Sync Failed - CFO Services", "Hello User,\nCompany ID: " + str(
                    company_obj.pk) + "\nMIS Name: "+str(company["mis_name"])+"\nStatus: Data Not Present For Date:- "+str(todays_date), to=dev_emails,cc=cc_emails_error + cc_emails_for_testing, )
                msg.send()
        elif company["mis_name"] == "creditors_ageing":
            if CreditorsAgeingReport.objects.filter(company_id__id=company_id, auto_timedate__date=todays_date).count() > 0:
                try:
                    ageing = CreditorsAgeingReport.objects.filter(company_id__id=company_id).order_by('customer_name').values('customer_name')
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
                        ageing_list = CreditorsAgeingReport.objects.filter(company_id__id=company_id,customer_name=obj['customer_name']).values('days','amount')
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
                    for_company = company_obj.company_name
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
                    email = EmailMessage(
                        for_company + " - Debtors Ageing",
                        html,
                        to=company_obj.company_email if company_obj.company_email != None and "," in company_obj.company_email else [
                            company_obj.company_email, ],
                        cc=['gauravndabhade@outlook.com']
                    )
                    email.content_subtype = 'html'
                    email.send()
                    print("notification sent!")
                except Exception as e:
                    print("Exception in creditors_ageing:" + str(e))
                    print(traceback.print_exc())
                    msg = EmailMultiAlternatives("Exception Occurred - CFO Services", "Hello User,\nCompany ID: " + str(
                        company_obj.pk) + "\nMIS Name: "+str(company["mis_name"])+"\nStatus: Exception Occurred - " + str(
                        e) + "\nStack Trace: " + str(traceback.format_exc()), to=dev_emails,
                                                 cc=cc_emails_error + cc_emails_for_testing, )
                    msg.send()
            else:
                msg = EmailMultiAlternatives("Sync Failed - CFO Services", "Hello User,\nCompany ID: " + str(
                    company_obj.pk) + "\nMIS Name: "+str(company["mis_name"])+"\nStatus: Data Not Present For Date:- "+str(todays_date), to=dev_emails,cc=cc_emails_error + cc_emails_for_testing, )
                msg.send()
        elif company["mis_name"] == "cruicial_numbers":
            print("Crucial num"+str(company_id))
            print("Crucial num"+str(todays_date))
            print(CrucialNumbersBank.objects.filter(company_id__id=company_id,
                                                    auto_timedate__date=todays_date).count())
            if CrucialNumbers.objects.filter(company_id__id=company_id,
                                                    auto_timedate__date=todays_date).count() > 0:
                try:
                    obj_list = VoucherItem.objects.filter(
                        Q(voucher_id__company_id=company_id) & Q(voucher_id__type_name__icontains='receipt') &Q(voucher_id__voucher_date=todays_date) & Q(
                            type='CR'))[0:10].values('id', 'ledger_name_temp', 'amt', 'voucher_id__v_date')

                    obj_ledgers = Ledgers.objects.filter(
                        Q(parent_str='Bank Accounts') & Q(company_id__id=company_id)).exclude(closing_balance=0)[
                                    0:10].values('id', 'name', 'closing_balance', )

                    for_company = company_obj.company_name

                    ledger_list = []
                    print("sales_actual_yearly")
                    # print(sales_actual_yearly)
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

                    banks_details = CrucialNumbersBank.objects.filter(Q(company_id=company_id) & ~Q(bank_name__icontains='cash')).values('id','bank_name','cr_amt','dr_amt' )
                    for single_obj in banks_details:
                        single_obj.update({
                            "dr_amt":str(single_obj['dr_amt']).replace("-","")
                        })
                    print("sales_todays ss")
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
                    print(company_obj.company_email.split(',') if company_obj.company_email!=None and "," in company_obj.company_email else [company_obj.company_email,])
                    to = ["vikas.pandey9323@gmail.com", ]
                    if company_obj.company_email:
                        to = ["vikas.pandey9323@gmail.com", ]
                        email = EmailMessage(
                            for_company + " - CRUCIAL NUMBERS MIS",
                            html,
                            to=company_obj.company_email.split(
                                ',') if company_obj.company_email != None and "," in company_obj.company_email else [
                                company_obj.company_email, ],
                            # to=to,
                            # cc=['gauravndabhade@outlook.com',]
                        )
                        email.content_subtype = 'html'
                        email.send()

                    elif company_obj.company_email==None or company_obj.company_email=="" or company_obj.company_email=="vikas.pandey9323@gmail.com":
                        to = ["vikas.pandey9323@gmail.com",]
                        msg = EmailMultiAlternatives("Email ID Blank - CFO Services", "Hello User,\nCompany ID: " + str(
                            company_obj.pk) + "\nCompany Name:" + str(company_obj.company_name) + "\nMIS Name: " + str(
                            company["mis_name"]) + "\nStatus: Client Email Id Not Entered In System\nPlease Update Company Email At:"
                                                   " http://65.2.146.150:8000/admin/import_app/company/"+str(company_obj.pk)+"/change/",
                                                     to=to, cc=cc_emails_error + cc_emails_for_testing, )
                        msg.send()

                    print("notification sent!")
                except Exception as e:
                    print("Exception in creditors_ageing:" + str(e))
                    print(traceback.print_exc())
                    msg = EmailMultiAlternatives("Exception Occurred - CFO Services", "Hello User,\nCompany ID: " + str(
                        company_obj.pk) + "\nCompany Name:"+str(company_obj.company_name)+"\nMIS Name: crucial_numbers\nStatus: Exception Occurred - " + str(
                        e) + "\nStack Trace: " + str(traceback.format_exc()), to=dev_emails,
                                                 cc=cc_emails_error + cc_emails_for_testing, )
                    msg.send()
            else:
                msg = EmailMultiAlternatives("Sync Failed - CFO Services", "Hello User,\nCompany ID: " + str(
                    company_obj.pk) + "\nCompany Name:"+str(company_obj.company_name)+"\nMIS Name: "+str(company["mis_name"])+"\nStatus: Data Not Present For Date:- "+str(todays_date), to=dev_emails,cc=cc_emails_error + cc_emails_for_testing, )
                msg.send()
        elif company["mis_name"] == "liquidity_barometer":
            if BalanceSheet.objects.filter(company_id__id=company_id).count() > 0:
                try:
                    current_liablities_val = BalanceSheet.objects.filter(company_id=company_id,
                                                                         head_name='Current Liabilities').values(
                        'total_amt')
                    current_assets_val = BalanceSheet.objects.filter(company_id=company_id, head_name='Current Assets').values(
                        'total_amt')
                    current_liablities = BSItem.objects.filter(bs__company_id=company_id,
                                                               bs__head_name='Current Liabilities').exclude(amt=0).values(
                        'id', 'name', 'amt')
                    current_assets = BSItem.objects.filter(bs__company_id=company_id, bs__head_name='Current Assets').exclude(
                        amt=0).values('id', 'name', 'amt')
                    loans_liabilities = BSItem.objects.filter(bs__company_id=company_id, bs__head_name='Loans (Liability)').exclude(
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
                    for_company = company_obj.company_name

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
                    email = EmailMessage(
                        for_company + " - LBOB MIS",
                        html,
                        to=company_obj.company_email if company_obj.company_email!=None and "," in company_obj.company_email else [company_obj.company_email,],
                        cc=["vikas.pandey9323@gmail.com", 'info@farintsol.com', 'tann.sonavane@gmail.com']
                    )
                    email.content_subtype = 'html'
                    email.send()
                    print("notification sent!")
                except Exception as e:
                    print("Exception in creditors_ageing:" + str(e))
                    print(traceback.print_exc())
                    msg = EmailMultiAlternatives("Exception Occurred - CFO Services", "Hello User,\nCompany ID: " + str(
                        company_obj.pk) + "\nMIS Name: "+str(company["mis_name"])+"\nStatus: Exception Occurred - " + str(
                        e) + "\nStack Trace: " + str(traceback.format_exc()), to=dev_emails,
                                                 cc=cc_emails_error + cc_emails_for_testing, )
                    msg.send()
            else:
                msg = EmailMultiAlternatives("Sync Failed - CFO Services", "Hello User,\nCompany ID: " + str(
                    company_obj.pk) + "\nMIS Name: "+str(company["mis_name"])+"\nStatus: Data Not Present For Date:- "+str(todays_date), to=dev_emails,cc=cc_emails_error + cc_emails_for_testing, )
                msg.send()




