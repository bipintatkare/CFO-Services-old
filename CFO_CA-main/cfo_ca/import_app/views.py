import datetime
import threading
import traceback
from django.core.files.base import ContentFile, File
from django.db.models import Q, Sum
from django.shortcuts import render
from django.http import Http404, JsonResponse
from django.views.generic import View
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.generics import ListAPIView
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Company, Vouchers, Ledgers, voucher_type, Group, \
    DateWiseLedger, BalanceSheet, BSItem, TrialBalance, \
    GSTR1, GSTR1_invoice, GSTR1_gst, VoucherItem, GSTSalesValues, SyncHistory, \
    SalesReport, ScheduleMail, CrucialNumbers, TrialBalanceMapping, ParentGroup, GSTR2, \
    GSTR2_invoice, GSTR2_gst, GSTPurchaseValues, CompanyPerson

from reporting.models import TallyPortalDifference
from .serializers import CompanyListSerializer, TrialBalanceMappingSerializer, \
    TrialBalanceSerializer, ParentGroupSerializer, GroupSerializer, BalanceSheetSerializer, \
    BSItemSerializer, serialize_ledger, DateWiseLedgerSerializer, VoucherItemSerializer, \
    serialize_ledger_for_queries
from placc.models import Budget, AgeingReport, CreditorsAgeingReport
from flutter_api.utils import send_html_mail
from cfo_ca import settings
from django.template.loader import get_template
from user.models import SiteUser,UserType
from tally.models import Group as TGroup, CustomGroup
from djqscsv import render_to_csv_response, write_csv
from .tasks import ledgers_data_email
from .queries import get_ledgers_queryset, get_vouchers_queryset
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
import traceback

todays_date = "2019-09-30"
todays_date = "2021-05-30"
todays_month = "2019-30"


class CompanyList(ListAPIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    current_user = {}
    def get_queryset(self):
        current_user = self.request.user
        return Company.objects.all()
        if current_user.user_type == UserType.ADMIN:
            return Company.objects.all()
        elif str(current_user.user_type) != str(UserType.ADMIN):
            return Company.objects.filter(
                id__in=CompanyPerson.objects.filter(person__id=SiteUser.objects.get(id=current_user.id).id).values_list(
                    'company__id', flat=True))



    serializer_class = CompanyListSerializer


class CompanyDetails(APIView):
    def get(self, request,id, *args,**kwargs):
        try:

            response_list =[]
            voucher_count = Vouchers.objects.filter(company_id=id).count()
            # voucher_count = Vouchers.objects.filter(company_id=id).aggregate(v_count=Count('toppings')).values('id','auto_timedate',)
            ledger_count = Ledgers.objects.filter(company_id=id).count()
            group_count = Group.objects.all().count()
            v_type_count = voucher_type.objects.filter(company_id=id).count()
            tb = TrialBalance.objects.filter(company_id=id).count()
            bs = BalanceSheet.objects.filter(company_id=id).count()
            dar = AgeingReport.objects.filter(company_id=id).count()
            car = CreditorsAgeingReport.objects.filter(company_id=id).count()

            con=[{"name":"Group",},{"name":"Voucher Type",},{"name":"Vouchers",},{"name":"Ledger",},{"name":"Trial Balance",},{"name":"Balance Sheet",},{"name":"Debtors Ageing Report",},{"name":"Creditors Ageing Report",}]
            con[0].update({'count':group_count,'time_date':"18-09-2020"})
            con[1].update({'count':v_type_count,'time_date':"18-09-2020"})
            con[2].update({'count':voucher_count,'time_date':"18-09-2020"}) #Vouchers.objects.last().auto_timedate
            con[3].update({'count':ledger_count,'time_date':"18-09-2020"})
            con[4].update({'count':tb,'time_date':"18-09-2020" }) #TrialBalance.objects.last().auto_timedate
            con[5].update({'count':bs,'time_date':"18-09-2020"})
            con[6].update({'count':dar,'time_date':"18-09-2020" }) #AgeingReport.objects.last().auto_timedate
            con[7].update({'count':car,'time_date':"18-09-2020" }) #CreditorsAgeingReport.objects.last().auto_timedate
            # response_list.append({'Group': group_count,'Voucher_Type': v_type_count,'Vouchers': voucher_count, 'Ledger': ledger_count, 'TB': tb,'BS':bs,'dar':dar,'car':car, })
            return Response(con,status=200)
        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Vouchers': 0, 'Ledger': 0, 'Group': 0, 'Voucher Type': 0})

            return Response(response_list,status=500)


class MISFDBO(APIView):


    def get(self, request,id, *args,**kwargs):
        try:

            print("request.data")

            print(request.data.get("from_date"))
            from_date = request.GET.get('from_date', '')
            to_date = request.GET.get('to_date', '')
            response_list = []
            if from_date!='' and to_date!='':
                to_month = to_date[5:]
                from_month = from_date[5:]
                from_year = from_date[:4]
                to_year = to_date[:4]

                print("to_month")
                print(int(to_month)-1)

                # if (from_month=="1"):
                #
                # elif(from_month=="12"):
                #
                # else:
                #     from_month_gt=str(int(from_month)-1)
                #     from_month_lt=str(int(from_month)+1)

                ledger_date_month = str(int(to_month)-1) if (int(to_month)-1)!=0 else "12"
                ledger_date_year = to_year if int(to_month)!=1 else str(int(to_year)-1)
                print("ledger_date_month")
                print(ledger_date_month)
                print(ledger_date_year)
                sales_actual_till_date = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')
                                                                       ,Q(ledger_date__month=ledger_date_month),Q(ledger_date__year=ledger_date_year)).aggregate(
                    Sum('closing_balance'))

                print("sales_actual_till_date")
                print(sales_actual_till_date)


                direct_exp = DateWiseLedger.objects.filter(
                                                           Q(ledger_id__parent_str='Direct Expenses')
                                                           ,Q(ledger_date__month=ledger_date_month),Q(ledger_date__year=ledger_date_year)).aggregate(
                    Sum('closing_balance'))
                indirect_exp = DateWiseLedger.objects.filter(
                                                             Q(ledger_id__parent_str='Indirect Expenses')
                                                             ,Q(ledger_date__month=ledger_date_month),Q(ledger_date__year=ledger_date_year)).aggregate(
                    Sum('closing_balance'))
                purchase = DateWiseLedger.objects.filter(
                                                         Q(ledger_id__parent_str='Purchase Accounts')
                                                         ,Q(ledger_date__month=ledger_date_month),Q(ledger_date__year=ledger_date_year)).aggregate(
                    Sum('closing_balance'))
                direct_income = DateWiseLedger.objects.filter(
                                                              Q(ledger_id__parent_str='Direct Incomes')
                                                              ,Q(ledger_date__month=ledger_date_month),Q(ledger_date__year=ledger_date_year)).aggregate(
                    Sum('closing_balance'))

                indirect_income = DateWiseLedger.objects.filter(
                                                                Q(ledger_id__parent_str='Indirect Incomes')
                                                                ,Q(ledger_date__month=ledger_date_month),Q(ledger_date__year=ledger_date_year)).aggregate(
                    Sum('closing_balance'))

                ledger_date_month = str(int(to_month) - 1) if (int(to_month) - 1) != 0 else "12"
                ledger_date_year = to_year if int(to_month) != 1 else str(int(to_year) - 1)


                direct_exp_current_month = DateWiseLedger.objects.filter(Q(ledger_date__month=str(int(from_month)-1)),Q(ledger_date__year=from_year),
                                                                         Q(ledger_id__parent_str='Direct Expenses')).aggregate(
                    Sum('closing_balance'))
                indirect_exp_current_month = DateWiseLedger.objects.filter(Q(ledger_date__month=str(int(from_month)-1)),Q(ledger_date__year=from_year),
                                                                           Q(ledger_id__parent_str='Indirect Expenses')).aggregate(
                    Sum('closing_balance'))
                purchase_current_month = DateWiseLedger.objects.filter(Q(ledger_date__month=str(int(from_month)-1)),Q(ledger_date__year=from_year),
                                                                       Q(ledger_id__parent_str='Purchase Accounts')).aggregate(
                    Sum('closing_balance'))
                direct_income_current_month = DateWiseLedger.objects.filter(Q(ledger_date__month=str(int(from_month)-1)),Q(ledger_date__year=from_year),
                                                                            Q(ledger_id__parent_str='Direct Incomes')).aggregate(
                    Sum('closing_balance'))

                indirect_income_current_month = DateWiseLedger.objects.filter(Q(ledger_date__month=str(int(from_month)-1)),Q(ledger_date__year=from_year),
                                                                              Q(ledger_id__parent_str='Indirect Incomes')).aggregate(
                    Sum('closing_balance'))



                sales_selected_month = DateWiseLedger.objects.filter(Q(ledger_date__month=str(int(to_month))),Q(ledger_date__year=to_year),
                                                                    Q(ledger_id__parent_str='Sales Accounts')).aggregate(Sum('closing_balance'))['closing_balance__sum']
                                       # - DateWiseLedger.objects.filter(Q(ledger_date__month=ledger_date_month),Q(ledger_date__year=ledger_date_year),
                                       #                              Q(ledger_id__parent_str='Sales Accounts')).aggregate(Sum('closing_balance'))['closing_balance__sum']
                print("sales_selected_month")
                print(sales_selected_month)
                sales_current_month = sales_selected_month

                if direct_income['closing_balance__sum'] != None:
                    gross_margin = sum(filter(None, [sales_actual_till_date['closing_balance__sum'] , direct_income['closing_balance__sum']])) - sum(filter(None, [direct_exp['closing_balance__sum'],0.0]))

                    gross_margin_current_month = sum(filter(None, [sales_current_month , direct_income_current_month['closing_balance__sum']])) - sum(filter(None, [direct_exp_current_month['closing_balance__sum'],0.0]))
                else:
                    gross_margin = sum(filter(None, [sales_actual_till_date['closing_balance__sum'],0.0])) - sum(filter(None, [direct_exp['closing_balance__sum'],0.0]))
                    gross_margin_current_month = sum(filter(None, [sales_current_month,0.0])) - sum(filter(None, [direct_exp_current_month['closing_balance__sum'],0.0]))

                net_profit = gross_margin - sum(
                    filter(None, [indirect_exp['closing_balance__sum'], indirect_income['closing_balance__sum']]))

                net_profit_current_month = sum(filter(None, [gross_margin_current_month,0.0])) - sum(filter(None, [indirect_exp_current_month[
                    'closing_balance__sum'] , indirect_income_current_month['closing_balance__sum']]))

                # total_assets = sum(filter(None, [opening_stock['closing_balance__sum'], bank_acc['closing_balance__sum'],
                #                                  cash_in_hand['closing_balance__sum'], \
                #                                  receivables['closing_balance__sum'], loan_advance['closing_balance__sum'],
                #                                  deposits['closing_balance__sum'], \
                #                                  other_assets['closing_balance__sum']]))

                SundryDebtors = DateWiseLedger.objects.filter(ledger_id__parent_str='Sundry Debtors').aggregate(
                    Sum('closing_balance'))
                sales_no_days = (sum(filter(None, [sales_actual_till_date['closing_balance__sum'],0.0])) / 30) * 365

                if (sales_actual_till_date['closing_balance__sum']==None):
                    no_of_days=0
                else:
                    no_of_days = int(
                    (SundryDebtors['closing_balance__sum'] / sales_actual_till_date['closing_balance__sum']) * 365)

                SundryCreditors = DateWiseLedger.objects.filter(ledger_id__parent_str='Sundry Creditors').aggregate(
                    Sum('closing_balance'))
                if purchase['closing_balance__sum'] != None:
                    no_of_days_creditors = int(
                        (SundryCreditors['closing_balance__sum'] / purchase['closing_balance__sum']) * 365)
                else:
                    no_of_days_creditors = 0

                Inventories = DateWiseLedger.objects.filter(
                                                            Q(ledger_id__parent_str='Opening Stock')).aggregate(
                    Sum('closing_balance'))
                salary = DateWiseLedger.objects.filter(ledger_id__parent_str='SALARY').aggregate(Sum('closing_balance'))
                INTEREST = DateWiseLedger.objects.filter(ledger_id__parent_str='INTEREST ON TDS').aggregate(
                    Sum('closing_balance'))

                major_expenses = Ledgers.objects.filter(
                    Q(parent_str='Indirect Expenses') | Q(
                        parent_str='Direct Expenses') | Q(
                        parent_str='Truck Running Expenses')).order_by(
                    '-closing_balance').reverse()[0:5].values('id', 'parent_str', 'name', 'closing_balance', 'budget')

                for idx,item in enumerate(major_expenses):
                    pin = DateWiseLedger.objects.filter(Q(ledger_id__id=item['id']),Q(ledger_date__month=to_month)).aggregate(Sum('closing_balance'))['closing_balance__sum']
                    item=item.update({'month_closing':pin})


                budget = Budget.objects.filter(id=1).values('id', 'sales', 'gross', 'nett')
                more_than_three_month_debtors = AgeingReport.objects.filter(days__gt=90).aggregate(Sum('amount'))
                more_than_six_month_debtors = AgeingReport.objects.filter(days__gt=180).aggregate(Sum('amount'))
                more_than_three_month_creditors = CreditorsAgeingReport.objects.filter(days__gt=90).aggregate(
                    Sum('amount'))

                print("more_than_six_month_debtors")

                print(more_than_three_month_debtors['amount__sum'])
                print(more_than_six_month_debtors['amount__sum'])
                if (sales_actual_till_date['closing_balance__sum']==None):
                    gross_per_till_date = gross_margin
                else:
                    gross_per_till_date = (gross_margin / sales_actual_till_date['closing_balance__sum'])

                if (sales_current_month==0):
                    gross_per_current_month = gross_margin_current_month
                else:
                    gross_per_current_month = (gross_margin_current_month / sales_current_month)
            else:


                sales_actual_till_date = DateWiseLedger.objects.filter(
                                                              Q(ledger_id__parent_str='Sales Accounts')).aggregate(
                    Sum('closing_balance'))

                direct_exp = DateWiseLedger.objects.filter(
                                                  Q(ledger_id__parent_str='Direct Expenses')).aggregate(Sum('closing_balance'))
                indirect_exp = DateWiseLedger.objects.filter(
                                                    Q(ledger_id__parent_str='Indirect Expenses')).aggregate(Sum('closing_balance'))
                purchase = DateWiseLedger.objects.filter(
                                                Q(ledger_id__parent_str='Purchase Accounts')).aggregate(Sum('closing_balance'))
                direct_income = DateWiseLedger.objects.filter(
                                                     Q(ledger_id__parent_str='Direct Incomes')).aggregate(Sum('closing_balance'))

                indirect_income = DateWiseLedger.objects.filter(
                                                       Q(ledger_id__parent_str='Indirect Incomes')).aggregate(Sum('closing_balance'))

                direct_exp_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                           Q(ledger_id__parent_str='Direct Expenses')).aggregate(
                    Sum('closing_balance'))
                indirect_exp_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                             Q(ledger_id__parent_str='Indirect Expenses')).aggregate(
                    Sum('closing_balance'))
                purchase_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                         Q(ledger_id__parent_str='Purchase Accounts')).aggregate(
                    Sum('closing_balance'))
                direct_income_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                              Q(ledger_id__parent_str='Direct Incomes')).aggregate(
                    Sum('closing_balance'))

                indirect_income_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                Q(ledger_id__parent_str='Indirect Incomes')).aggregate(
                    Sum('closing_balance'))

                sales_current_month = sales_actual_till_date['closing_balance__sum'] - DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                    Q(ledger_id__parent_str='Sales Accounts')).aggregate(Sum('closing_balance'))['closing_balance__sum']

                if direct_income['closing_balance__sum'] != None:
                    gross_margin = sales_actual_till_date['closing_balance__sum'] + direct_income['closing_balance__sum'] - direct_exp['closing_balance__sum']

                    gross_margin_current_month = sales_current_month + direct_income_current_month['closing_balance__sum'] - direct_exp_current_month['closing_balance__sum']
                else:
                    gross_margin = sales_actual_till_date['closing_balance__sum'] - direct_exp['closing_balance__sum']
                    gross_margin_current_month = sales_current_month - direct_exp_current_month['closing_balance__sum']

                net_profit = gross_margin - sum(filter(None,[indirect_exp['closing_balance__sum'] , indirect_income['closing_balance__sum']]))

                net_profit_current_month = gross_margin_current_month - indirect_exp_current_month['closing_balance__sum'] + indirect_income_current_month['closing_balance__sum']

                # total_assets = sum(filter(None, [opening_stock['closing_balance__sum'], bank_acc['closing_balance__sum'],
                #                                  cash_in_hand['closing_balance__sum'], \
                #                                  receivables['closing_balance__sum'], loan_advance['closing_balance__sum'],
                #                                  deposits['closing_balance__sum'], \
                #                                  other_assets['closing_balance__sum']]))

                SundryDebtors = DateWiseLedger.objects.filter(ledger_id__parent_str='Sundry Debtors').aggregate(Sum('closing_balance'))
                sales_no_days = (sales_actual_till_date['closing_balance__sum'] / 30) * 365
                no_of_days = int((SundryDebtors['closing_balance__sum'] / sales_actual_till_date['closing_balance__sum']) * 365)

                SundryCreditors = DateWiseLedger.objects.filter(ledger_id__parent_str='Sundry Creditors').aggregate(Sum('closing_balance'))
                if purchase['closing_balance__sum']!=None:
                    no_of_days_creditors = int((SundryCreditors['closing_balance__sum'] / purchase['closing_balance__sum']) * 365)
                else:
                    no_of_days_creditors=0

                Inventories = DateWiseLedger.objects.filter(  Q(ledger_id__parent_str='Opening Stock')).aggregate(
                    Sum('closing_balance'))
                salary = DateWiseLedger.objects.filter(ledger_id__parent_str='SALARY').aggregate(Sum('closing_balance'))
                INTEREST = DateWiseLedger.objects.filter(ledger_id__parent_str='INTEREST ON TDS').aggregate(Sum('closing_balance'))
                major_expenses = Ledgers.objects.filter(
                                                      Q(parent_str='Indirect Expenses') | Q(
                                                          parent_str='Direct Expenses') | Q(parent_str='Truck Running Expenses')).order_by(
                    '-closing_balance').reverse()[0:4].values('id', 'parent_str','name','closing_balance','budget')
                budget = Budget.objects.filter(id=1).values('id', 'sales','gross','nett')
                more_than_three_month_debtors = AgeingReport.objects.filter(days__gt=90).aggregate(Sum('amount'))
                more_than_six_month_debtors = AgeingReport.objects.filter(days__gt=180).aggregate(Sum('amount'))
                more_than_three_month_creditors = CreditorsAgeingReport.objects.filter(days__gt=90).aggregate(Sum('amount'))

                print("more_than_six_month_debtors")

                print(more_than_three_month_debtors['amount__sum'])
                print(more_than_six_month_debtors['amount__sum'])
                gross_per_till_date = (gross_margin/sales_actual_till_date['closing_balance__sum'])
                gross_per_current_month = (gross_margin_current_month/sales_current_month)

            context = {
                'sales_actual_till_date': sales_actual_till_date['closing_balance__sum'],
                'gross_margin': gross_margin,
                'sales_current_month': sales_current_month,
                'gross_margin_current_month': gross_margin_current_month,
                'net_profit_current_month': net_profit_current_month,
                'net_profit': net_profit,
                'SundryDebtors': SundryDebtors['closing_balance__sum'],
                'no_of_days': no_of_days,
                'SundryCreditors': SundryCreditors['closing_balance__sum'],
                'Inventories': Inventories['closing_balance__sum'],
                'salary': salary['closing_balance__sum'],
                'INTEREST': INTEREST['closing_balance__sum'],
                'major_expenses': list(major_expenses),
                'budget': list(budget),
                'more_than_three_month_debtors': more_than_three_month_debtors['amount__sum'],
                'more_than_six_month_debtors': more_than_six_month_debtors['amount__sum'],
                'more_than_three_month_creditors': more_than_three_month_creditors['amount__sum'],
                'no_of_days_creditors': no_of_days_creditors,
                'gross_per_till_date': int(gross_per_till_date),
                'gross_per_current_month': int(gross_per_current_month),
            }
            response_list.append(context)
            return Response(response_list,status=200)
        except Exception as e:
            print("Exception:"+str(e))
            print(traceback.print_exc())
            response_list = []
            response_list.append({'Error': 'Something Went Wrong'+str(e),})
            return Response(response_list,status=500)


class MISLBOB(APIView):


    def get(self, request,id, *args,**kwargs):
        try:
            response_list =[]
            current_liablities_val = BalanceSheet.objects.filter(company_id=id,head_name='Current Liabilities').values('total_amt')
            current_assets_val = BalanceSheet.objects.filter(company_id=id,head_name='Current Assets').values('total_amt')
            current_liablities = BSItem.objects.filter(bs__company_id=id, bs__head_name='Current Liabilities').exclude(amt=0).values('id', 'name','amt')
            current_assets = BSItem.objects.filter(bs__company_id=id, bs__head_name='Current Assets').exclude(amt=0).values('id', 'name','amt')
            loans_liabilities = BSItem.objects.filter(bs__company_id=id, bs__head_name='Loans (Liability)').exclude(amt=0).values('id', 'name','amt')
            # opening_stock = DateWiseLedger.objects.filter(~Q(closing_balance=None),
            #                                      Q(ledger_id__name='Opening Stock')).aggregate(Sum('closing_balance'))
            # sundry_debtors = DateWiseLedger.objects.filter(~Q(closing_balance=None),
            #                                       Q(ledger_id__primary_group_str='Sundry Debtors')).aggregate(Sum('closing_balance'))
            # bank_acc = DateWiseLedger.objects.filter(~Q(closing_balance=None),
            #                                 Q(ledger_id__primary_group_str='Bank Accounts')).aggregate(Sum('closing_balance'))
            # cash_in_hand = DateWiseLedger.objects.filter(~Q(closing_balance=None),
            #                                     Q(ledger_id__primary_group_str='Cash-in-hand')).aggregate(Sum('closing_balance'))
            # expense_payable = DateWiseLedger.objects.filter(~Q(closing_balance=None),
            #                                        Q(ledger_id__name='Expenses Payable')).aggregate(Sum('closing_balance'))
            #
            # SundryCreditors = DateWiseLedger.objects.filter(ledger_id__primary_group_str='Sundry Creditors').aggregate(Sum('closing_balance'))
            #
            # taxes = DateWiseLedger.objects.filter(~Q(closing_balance=None),  (
            #             Q(ledger_id__name='APMC Tax') | Q(ledger_id__name='Deferred Tax') | Q(
            #         ledger_id__name='Deffred Tax Expenses') | Q(ledger_id__name='Income Tax Expenses') | Q(
            #         ledger_id__name='PROPERTY TAXES') | Q(ledger_id__name='VAT LIABILITY A/C'))).aggregate(Sum('closing_balance'))
            # context = {
            #     'opening_stock': opening_stock['closing_balance__sum'],
            #     'sundry_debtors': sundry_debtors['closing_balance__sum'],
            #     'bank_acc': bank_acc['closing_balance__sum'] + cash_in_hand['closing_balance__sum'],
            #     'a_value': float(opening_stock['closing_balance__sum']) if opening_stock['closing_balance__sum']!=None else 0 + float(sundry_debtors['closing_balance__sum']) if sundry_debtors['closing_balance__sum']!=None else 0 + float(bank_acc['closing_balance__sum']) if bank_acc['closing_balance__sum']!=None else 0 +
            #                float(cash_in_hand['closing_balance__sum']) if cash_in_hand['closing_balance__sum']!=None else 0,
            #     'b_value': float(SundryCreditors['closing_balance__sum']) if SundryCreditors['closing_balance__sum']!=None else 0 + float(taxes['closing_balance__sum']) if taxes['closing_balance__sum']!=None else 0,
            #     'a_b_value': (float(opening_stock['closing_balance__sum']) if opening_stock['closing_balance__sum']!=None else 0 + float(sundry_debtors['closing_balance__sum']) if sundry_debtors['closing_balance__sum']!=None else 0 + float(bank_acc['closing_balance__sum']) if sundry_debtors['closing_balance__sum']!=None else 0 +
            #                   float(cash_in_hand['closing_balance__sum']) if cash_in_hand['closing_balance__sum']!=None else 0) - (float(SundryCreditors['closing_balance__sum']) if SundryCreditors['closing_balance__sum']!=None else 0 + float(taxes['closing_balance__sum']) if taxes['closing_balance__sum']!=None else 0),
            #     'SundryCreditors': SundryCreditors['closing_balance__sum'],
            #     'taxes': taxes['closing_balance__sum'],
            #
            # }
            for item in current_assets:
                if (item['amt']<0):
                    item.update({'amt': format(-1 * item['amt'],',') })
                else:
                    item.update({'amt': format((item['amt']), ',')})
            for item in current_liablities:
                if (item['amt']<0):
                    item.update({'amt': format( item['amt'],',') })
                else:
                    item.update({'amt': format((item['amt']), ',')})
            od_ac_value = 0.00
            occ_ac_value = 0.00
            for item in loans_liabilities:
                if ('OD' in item['name']):
                    od_ac_value=item['amt']
                elif ('OCC' in item['name']):
                    occ_ac_value=format(item['amt'],'.2f')
            total_value = 0.00
            total_value =format(-float(current_assets_val[0]['total_amt'])-float(current_liablities_val[0]['total_amt']),'.2f')
            a_b_value_final = 0.0
            a_b_value_final = format(float(total_value)-float(od_ac_value)-float(occ_ac_value),'.2f')
            context={
                'current_liablities':current_liablities,
                'current_assets':current_assets,
                'current_liablities_val': format(current_liablities_val[0]['total_amt'],','),
                'current_assets_val': format(-1 * current_assets_val[0]['total_amt'],','),
                'a_b_value': format(float(total_value),','),
                'a_b_value_final': format(float(a_b_value_final),','),
                'od_ac_value' : format(od_ac_value,','),
                'occ_ac_value' : format(occ_ac_value,','),
            }
            response_list.append(context)
            return Response(response_list,status=200)
        except Exception as e:
            print("Exception:"+str(e))
            print(traceback.print_exc())
            response_list = []
            response_list.append({'Error': 'Something Went Wrong '+str(e),})
            return Response(response_list,status=500)


class MISFFSFTP(APIView):


    def get(self, request,id, *args,**kwargs):
        try:
            #Models Used:
            #BalanceSheet
            #DateWiseLedger
            #
            #

            response_list = []
            print("id")
            print(id)
            # id = 28
            current_liablities_val = BalanceSheet.objects.filter(company_id=id, head_name='Current Liabilities').values(
                'total_amt')
            current_assets_val = BalanceSheet.objects.filter(company_id=id, head_name='Current Assets').values(
                'total_amt')
            loans_val = BalanceSheet.objects.filter(company_id=id, head_name='Loans (Liability)').values('total_amt')
            capital_ac_val = BalanceSheet.objects.filter(company_id=id, head_name='Capital Account').values('total_amt')
            fixed_asset_val = BalanceSheet.objects.filter(company_id=id, head_name='Fixed Assets').values('total_amt')
            net_profit_val = BalanceSheet.objects.filter(company_id=id, head_name='Profit & Loss A/c').values(
                'total_amt')
            current_liablities = BSItem.objects.filter(bs__company_id=id, bs__head_name='Current Liabilities').values(
                'id', 'name', 'amt')
            current_assets = BSItem.objects.filter(bs__company_id=id, bs__head_name='Current Assets').values('id',
                                                                                                             'name',
                                                                                                             'amt')

            for index, item in enumerate(current_liablities):
                bank_acc = DateWiseLedger.objects.filter((~Q(closing_balance=None) & Q(ledger_date=todays_date) &
                                                          Q(ledger_id__parent_str=item['name'])) | (
                                                                     Q(ledger_id__name=item['name']) & Q(
                                                                 ledger_date=todays_date))).aggregate(
                    Sum('closing_balance'))
                current_liablities[index].update({'opening_balance': bank_acc['closing_balance__sum'] if bank_acc[
                                                                                                             'closing_balance__sum'] != None else 0, })
            for index, item in enumerate(current_assets):
                bank_acc = DateWiseLedger.objects.filter((~Q(closing_balance=None) & Q(ledger_date=todays_date) &
                                                          Q(ledger_id__parent_str=item['name'])) | (
                                                                     Q(ledger_id__name=item['name']) & Q(
                                                                 ledger_date=todays_date))).aggregate(
                    Sum('closing_balance'))
                current_assets[index].update({'opening_balance': bank_acc['closing_balance__sum'] if bank_acc[
                                                                                                         'closing_balance__sum'] != None else 0, })
            purchase = {}
            gross_margin = 100.0
            sales_actual_till_date = {}
            gross_margin_current_month = 100
            sales_current_month =10.2
            SundryCreditors = DateWiseLedger.objects.filter(ledger_id__parent_str='Sundry Creditors').aggregate(
                Sum('closing_balance'))
            if purchase['closing_balance__sum'] != None:
                no_of_days_creditors = int(
                    (SundryCreditors['closing_balance__sum'] / purchase['closing_balance__sum']) * 365)
            else:
                no_of_days_creditors = 0

            Inventories = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Opening Stock')).aggregate(
                Sum('closing_balance'))
            salary = DateWiseLedger.objects.filter(ledger_id__parent_str='SALARY').aggregate(Sum('closing_balance'))
            INTEREST = DateWiseLedger.objects.filter(ledger_id__parent_str='INTEREST ON TDS').aggregate(
                Sum('closing_balance'))
            major_expenses = Ledgers.objects.filter(
                Q(parent_str='Indirect Expenses') | Q(
                    parent_str='Direct Expenses') | Q(parent_str='Truck Running Expenses')).order_by(
                '-closing_balance').reverse()[0:4].values('id', 'parent_str', 'name', 'closing_balance', 'budget')
            budget = Budget.objects.filter(id=1).values('id', 'sales', 'gross', 'nett')
            more_than_three_month_debtors = AgeingReport.objects.filter(days__gt=90).aggregate(Sum('amount'))
            more_than_six_month_debtors = AgeingReport.objects.filter(days__gt=180).aggregate(Sum('amount'))
            more_than_three_month_creditors = CreditorsAgeingReport.objects.filter(days__gt=90).aggregate(Sum('amount'))

            print("more_than_six_month_debtors")

            print(more_than_three_month_debtors['amount__sum'])
            print(more_than_six_month_debtors['amount__sum'])
            gross_per_till_date = (gross_margin / sales_actual_till_date['closing_balance__sum'])
            gross_per_current_month = (gross_margin_current_month / sales_current_month)

            print("current_liablities")
            print(current_liablities)
            # ================================================

            bank_acc = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                     Q(ledger_id__parent_str='Bank Accounts')).aggregate(
                Sum('closing_balance'))
            cash_in_hand = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                         Q(ledger_id__parent_str='Cash-in-hand')).aggregate(
                Sum('closing_balance'))
            opening_stock = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                          Q(ledger_id__name='Opening Stock')).aggregate(
                Sum('closing_balance'))
            receivables = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                        Q(ledger_id__name__icontains='Receivable')).aggregate(
                Sum('closing_balance'))
            trade_payables = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                           Q(ledger_id__name__icontains='payable'),
                                                           ~Q(ledger_id__parent_str='Duties & Taxes'),
                                                           ~Q(ledger_id__parent_str='Current Liabilities')).aggregate(
                Sum('closing_balance'))
            other_assets = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                         Q(ledger_id__parent_str__icontains='Asset')).aggregate(
                Sum('closing_balance'))
            loan_advance = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                         Q(ledger_id__parent_str='Loans & Advances (Asset)')).aggregate(
                Sum('closing_balance'))
            deposits = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                     Q(ledger_id__parent_str='Deposits (Asset)')).aggregate(
                Sum('closing_balance'))
            current_liabilities = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                                Q(
                                                                    ledger_id__parent_str='Current Liabilities')).aggregate(
                Sum('closing_balance'))
            duties_taxes = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                         Q(ledger_id__parent_str='Duties & Taxes')).aggregate(
                Sum('closing_balance'))
            # header==================================================
            loans_header = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                         Q(ledger_id__parent_str__icontains='Loans')).aggregate(
                Sum('closing_balance'))

            sales_actual_till_date = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                                   Q(ledger_id__parent_str='Sales Accounts')).aggregate(
                Sum('closing_balance'))

            direct_exp = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                       Q(ledger_id__parent_str='Direct Expenses')).aggregate(
                Sum('closing_balance'))
            indirect_exp = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                         Q(ledger_id__parent_str='Indirect Expenses')).aggregate(
                Sum('closing_balance'))
            direct_income = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                          Q(ledger_id__parent_str='Direct Incomes')).aggregate(
                Sum('closing_balance'))

            indirect_income = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                            Q(ledger_id__parent_str='Indirect Incomes')).aggregate(
                Sum('closing_balance'))

            if direct_income['closing_balance__sum'] != None:
                gross_margin = sales_actual_till_date['closing_balance__sum'] + direct_income['closing_balance__sum'] - \
                               direct_exp[
                                   'closing_balance__sum']
            else:
                gross_margin = sum(filter(None, [sales_actual_till_date['closing_balance__sum'], 0.0])) - sum(
                    filter(None, [direct_exp['closing_balance__sum'], 0.0]))

            net_profit_header = gross_margin - sum(
                filter(None, [indirect_exp['closing_balance__sum'], indirect_income['closing_balance__sum']]))

            capital_acc_header = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                               Q(ledger_id__parent_str='Capital Account')).aggregate(
                Sum('closing_balance'))

            fixed_asset_header = DateWiseLedger.objects.filter(~Q(closing_balance=None),
                                                               Q(ledger_id__parent_str='Fixed Assets')).aggregate(
                Sum('closing_balance'))
            total_assets = sum(filter(None, [opening_stock['closing_balance__sum'], bank_acc['closing_balance__sum'],
                                             cash_in_hand['closing_balance__sum'],receivables['closing_balance__sum'], loan_advance['closing_balance__sum'],
                                             deposits['closing_balance__sum'],other_assets['closing_balance__sum']]))
            total_liabilities = sum(filter(None, [current_liabilities['closing_balance__sum'],
                                                  trade_payables['closing_balance__sum'], duties_taxes[
                                                      'closing_balance__sum']]))
            context = {
                'opening_stock': opening_stock['closing_balance__sum'],
                'trade_payables': trade_payables['closing_balance__sum'],
                'other_assets': other_assets['closing_balance__sum'],
                'receivables': receivables['closing_balance__sum'],
                'duties_taxes': duties_taxes['closing_balance__sum'],
                'current_liabilities': current_liabilities['closing_balance__sum'],
                'deposits': deposits['closing_balance__sum'],
                'loan_advance': loan_advance['closing_balance__sum'],
                'bank_acc': sum(filter(None, [bank_acc['closing_balance__sum'] , cash_in_hand['closing_balance__sum']])),
                # headers
                'loans_header': loans_header['closing_balance__sum'],
                'net_profit_header': net_profit_header,
                'capital_acc_header': capital_acc_header['closing_balance__sum'],
                'fixed_asset_header': fixed_asset_header['closing_balance__sum'],
                # totals
                'total_assets': total_assets,
                'total_liabilities': total_liabilities,
                'diff_in_assets': total_assets - total_liabilities,
                #assests n liab
                'current_liablities': current_liablities,
                'current_assets': current_assets,
                'current_liablities_val': current_liablities_val[0]['total_amt'] if len(current_liablities_val)>0 else 0.0,
                'current_assets_val': current_assets_val[0]['total_amt'] if len(current_assets_val)>0 else 0.0,
                'loans_val': loans_val[0]['total_amt'] if len(loans_val)>0 else 0.0,
                'capital_ac_val': capital_ac_val[0]['total_amt'] if len(capital_ac_val)>0 else 0.0,
                'fixed_asset_val': fixed_asset_val[0]['total_amt'] if len(fixed_asset_val)>0 else 0.0,
                'net_profit_val': net_profit_val[0]['total_amt'] if len(net_profit_val)>0 else 0.0,
                'a_b_value': round(-float(current_assets_val[0]['total_amt'] if len(current_assets_val)>0 else 0.0) - float(current_liablities_val[0]['total_amt'] if len(current_liablities_val)>0 else 0.0),2)

            }
            response_list.append(context)
            return Response(response_list,status=200)
        except Exception as e:
            print("Exception:"+str(e))
            print(traceback.print_exc())
            response_list = []
            response_list.append({'Error': 'Something Went Wrong'+str(e),})
            return Response(response_list,status=500)


class MISDAR(APIView):


    def get(self, request,id, *args,**kwargs):
        try:
            response_list =[]
            ageing= AgeingReport.objects.filter(company_id__id=id).values('id', 'customer_name','amount','days')
            # ageing = AgeingReport.objects.values('customer_name').annotate(data_sum=Sum('amount'))
            # print(ageing)
            print("ageing")
            print("ageing")
            # print([person.is_thirty_days for person in AgeingReport.objects.all()])
            # for item in ageing[:10]:
            #
            #     item['cust_list'] = list(AgeingReport.objects.filter(customer_name=item['customer_name']).values('id', 'customer_name','amount'))
            #     print(item['customer_name'])
            #     print(item['cust_list'])

            context = {
                'ageing': list(ageing),
                # 'ageing2': list(ageing2),
            }
            response_list.append(context)
            return Response(response_list,status=200)
        except Exception as e:
            print("Exception:"+str(e))
            print(traceback.print_exc())
            response_list = []
            response_list.append({'Error': 'Something Went Wrong'+str(e),})
            return Response(response_list,status=500)


class MISCAR(APIView):


    def get(self, request,id, *args,**kwargs):
        try:

            response_list =[]
            ageing= CreditorsAgeingReport.objects.filter(company_id__id=id).values('id', 'customer_name','amount','days')
            # ageing = AgeingReport.objects.values('customer_name').annotate(data_sum=Sum('amount'))
            # print(ageing)
            print("ageing")
            print("ageing")
            # print([person.is_thirty_days for person in AgeingReport.objects.all()])
            # for item in ageing[:10]:
            #
            #     item['cust_list'] = list(AgeingReport.objects.filter(customer_name=item['customer_name']).values('id', 'customer_name','amount'))
            #     print(item['customer_name'])
            #     print(item['cust_list'])

            context = {
                'ageing': list(ageing),
                # 'ageing2': list(ageing2),
            }
            response_list.append(context)
            return Response(response_list,status=200)
        except Exception as e:
            print("Exception:"+str(e))
            print(traceback.print_exc())
            response_list = []
            response_list.append({'Error': 'Something Went Wrong'+str(e),})
            return Response(response_list,status=500)


@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def send_mis2(request, email):
    try:
        response_list = []

        sales_actual_till_date = DateWiseLedger.objects.filter(
                                                               Q(
                                                                   ledger_id__primary_group_str='Sales Accounts')).aggregate(
            Sum('closing_balance'))

        direct_exp = DateWiseLedger.objects.filter(
                                                   Q(ledger_id__primary_group_str='Direct Expenses')).aggregate(
            Sum('closing_balance'))
        indirect_exp = DateWiseLedger.objects.filter(
                                                     Q(ledger_id__primary_group_str='Indirect Expenses')).aggregate(
            Sum('closing_balance'))
        purchase = DateWiseLedger.objects.filter(
                                                 Q(ledger_id__primary_group_str='Purchase Accounts')).aggregate(
            Sum('closing_balance'))
        direct_income = DateWiseLedger.objects.filter(
                                                      Q(ledger_id__primary_group_str='Direct Incomes')).aggregate(
            Sum('closing_balance'))

        indirect_income = DateWiseLedger.objects.filter(
                                                        Q(ledger_id__primary_group_str='Indirect Incomes')).aggregate(
            Sum('closing_balance'))

        direct_exp_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                 Q(
                                                                     ledger_id__primary_group_str='Direct Expenses')).aggregate(
            Sum('closing_balance'))
        indirect_exp_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                   Q(
                                                                       ledger_id__primary_group_str='Indirect Expenses')).aggregate(
            Sum('closing_balance'))
        purchase_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                               Q(
                                                                   ledger_id__primary_group_str='Purchase Accounts')).aggregate(
            Sum('closing_balance'))
        direct_income_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                    Q(
                                                                        ledger_id__primary_group_str='Direct Incomes')).aggregate(
            Sum('closing_balance'))

        indirect_income_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                      Q(
                                                                          ledger_id__primary_group_str='Indirect Incomes')).aggregate(
            Sum('closing_balance'))
        print("sales_actual_till_date['closing_balance__sum']")
        print(sales_actual_till_date['closing_balance__sum'])
        print(direct_income['closing_balance__sum'])
        print(direct_exp['closing_balance__sum'])
        sales_current_month = sales_actual_till_date['closing_balance__sum'] - \
                              DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                            Q(ledger_id__primary_group_str='Sales Accounts')).aggregate(
                                  Sum('closing_balance'))['closing_balance__sum']

        if direct_income['closing_balance__sum'] != None:
            gross_margin = sales_actual_till_date['closing_balance__sum'] + direct_income['closing_balance__sum'] - \
                           direct_exp['closing_balance__sum']

            gross_margin_current_month = sales_current_month + direct_income_current_month['closing_balance__sum'] - \
                                         direct_exp_current_month['closing_balance__sum']
        else:
            gross_margin = sales_actual_till_date['closing_balance__sum'] - direct_exp['closing_balance__sum']
            gross_margin_current_month = sales_current_month - direct_exp_current_month['closing_balance__sum']

        net_profit = gross_margin - indirect_exp['closing_balance__sum'] + indirect_income['closing_balance__sum']
        net_profit_current_month = gross_margin_current_month - indirect_exp_current_month['closing_balance__sum'] + \
                                   indirect_income_current_month['closing_balance__sum']

        # total_assets = sum(filter(None, [opening_stock['closing_balance__sum'], bank_acc['closing_balance__sum'],
        #                                  cash_in_hand['closing_balance__sum'], \
        #                                  receivables['closing_balance__sum'], loan_advance['closing_balance__sum'],
        #                                  deposits['closing_balance__sum'], \
        #                                  other_assets['closing_balance__sum']]))

        SundryDebtors = DateWiseLedger.objects.filter(ledger_id__primary_group_str='Sundry Debtors').aggregate(
            Sum('closing_balance'))
        sales_no_days = (sales_actual_till_date['closing_balance__sum'] / 30) * 365
        no_of_days = int((SundryDebtors['closing_balance__sum'] / sales_actual_till_date['closing_balance__sum']) * 365)

        SundryCreditors = DateWiseLedger.objects.filter(ledger_id__primary_group_str='Sundry Creditors').aggregate(
            Sum('closing_balance'))
        if purchase['closing_balance__sum'] != None:
            no_of_days_creditors = int(
                (SundryCreditors['closing_balance__sum'] / purchase['closing_balance__sum']) * 365)
        else:
            no_of_days_creditors = 0

        Inventories = DateWiseLedger.objects.filter(
                                                    Q(ledger_id__primary_group_str='Opening Stock')).aggregate(
            Sum('closing_balance'))
        salary = DateWiseLedger.objects.filter(ledger_id__primary_group_str='SALARY').aggregate(Sum('closing_balance'))
        INTEREST = DateWiseLedger.objects.filter(ledger_id__primary_group_str='INTEREST ON TDS').aggregate(
            Sum('closing_balance'))
        major_expenses = Ledgers.objects.filter(
                                                Q(primary_group_str='Indirect Expenses') | Q(
                                                    primary_group_str='Direct Expenses')).order_by(
            '-closing_balance').reverse()[0:4].values('id', 'primary_group_str', 'name', 'closing_balance', 'budget')
        budget = Budget.objects.filter(id=1).values('id', 'sales', 'gross', 'nett')
        more_than_three_month_debtors = AgeingReport.objects.filter(days__gt=90).aggregate(Sum('amount'))
        more_than_six_month_debtors = AgeingReport.objects.filter(days__gt=180).aggregate(Sum('amount'))
        more_than_three_month_creditors = CreditorsAgeingReport.objects.filter(days__gt=90).aggregate(Sum('amount'))

        print("more_than_six_month_debtors")

        print(more_than_three_month_debtors['amount__sum'])
        print(more_than_six_month_debtors['amount__sum'])
        gross_per_till_date = (gross_margin / sales_actual_till_date['closing_balance__sum'])
        gross_per_current_month = (gross_margin_current_month / sales_current_month)

        context = {
            'sales_actual_till_date': sales_actual_till_date['closing_balance__sum'],
            'gross_margin': gross_margin,
            'sales_current_month': sales_current_month,
            'gross_margin_current_month': gross_margin_current_month,
            'net_profit_current_month': net_profit_current_month,
            'net_profit': net_profit,
            'SundryDebtors': SundryDebtors['closing_balance__sum'],
            'no_of_days': no_of_days,
            'SundryCreditors': SundryCreditors['closing_balance__sum'],
            'Inventories': Inventories['closing_balance__sum'],
            'salary': salary['closing_balance__sum'],
            'INTEREST': INTEREST['closing_balance__sum'],
            'major_expenses': list(major_expenses),
            'budget': list(budget),
            'more_than_three_month_debtors': more_than_three_month_debtors['amount__sum'],
            'more_than_six_month_debtors': more_than_six_month_debtors['amount__sum'],
            'more_than_three_month_creditors': more_than_three_month_creditors['amount__sum'],
            'no_of_days_creditors': no_of_days_creditors,
            'gross_per_till_date': int(gross_per_till_date),
            'gross_per_current_month': int(gross_per_current_month),
        }
        response_list.append(context)

        template = get_template('React_tables/FinancialDashboard.html')
        html = template.render(response_list)

        send_html_mail("CFO Services - MIS", html, settings.EMAIL_HOST_USER, [email, ])
        response_list = []
        response_list.append({'Success': 'SENT', })
        return Response(response_list, status=200)
    except Exception as e:
        response_list = []
        response_list.append({'Error': 'Something Went Wrong' + str(e), })
        return Response(response_list, status=500)


class send_mis(APIView):


    def get(self, request,email, *args,**kwargs):
        try:
            response_list =[]

            sales_actual_till_date = DateWiseLedger.objects.filter(
                                                          Q(ledger_id__primary_group_str='Sales Accounts')).aggregate(
                Sum('closing_balance'))

            direct_exp = DateWiseLedger.objects.filter(
                                              Q(ledger_id__primary_group_str='Direct Expenses')).aggregate(Sum('closing_balance'))
            indirect_exp = DateWiseLedger.objects.filter(
                                                Q(ledger_id__primary_group_str='Indirect Expenses')).aggregate(Sum('closing_balance'))
            purchase = DateWiseLedger.objects.filter(
                                            Q(ledger_id__primary_group_str='Purchase Accounts')).aggregate(Sum('closing_balance'))
            direct_income = DateWiseLedger.objects.filter(
                                                 Q(ledger_id__primary_group_str='Direct Incomes')).aggregate(Sum('closing_balance'))

            indirect_income = DateWiseLedger.objects.filter(
                                                   Q(ledger_id__primary_group_str='Indirect Incomes')).aggregate(Sum('closing_balance'))

            direct_exp_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                       Q(ledger_id__primary_group_str='Direct Expenses')).aggregate(
                Sum('closing_balance'))
            indirect_exp_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                         Q(ledger_id__primary_group_str='Indirect Expenses')).aggregate(
                Sum('closing_balance'))
            purchase_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                     Q(ledger_id__primary_group_str='Purchase Accounts')).aggregate(
                Sum('closing_balance'))
            direct_income_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                          Q(ledger_id__primary_group_str='Direct Incomes')).aggregate(
                Sum('closing_balance'))

            indirect_income_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                            Q(ledger_id__primary_group_str='Indirect Incomes')).aggregate(
                Sum('closing_balance'))
            print("sales_actual_till_date['closing_balance__sum']")
            print(sales_actual_till_date['closing_balance__sum'])
            print(direct_income['closing_balance__sum'])
            print(direct_exp['closing_balance__sum'])
            sales_current_month = sales_actual_till_date['closing_balance__sum'] - DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                Q(ledger_id__primary_group_str='Sales Accounts')).aggregate(Sum('closing_balance'))['closing_balance__sum']

            if direct_income['closing_balance__sum'] != None:
                gross_margin = sales_actual_till_date['closing_balance__sum'] + direct_income['closing_balance__sum'] - direct_exp['closing_balance__sum']

                gross_margin_current_month = sales_current_month + direct_income_current_month['closing_balance__sum'] - direct_exp_current_month['closing_balance__sum']
            else:
                gross_margin = sales_actual_till_date['closing_balance__sum'] - direct_exp['closing_balance__sum']
                gross_margin_current_month = sales_current_month - direct_exp_current_month['closing_balance__sum']

            net_profit = gross_margin - indirect_exp['closing_balance__sum'] + indirect_income['closing_balance__sum']
            net_profit_current_month = gross_margin_current_month - indirect_exp_current_month['closing_balance__sum'] + indirect_income_current_month['closing_balance__sum']

            # total_assets = sum(filter(None, [opening_stock['closing_balance__sum'], bank_acc['closing_balance__sum'],
            #                                  cash_in_hand['closing_balance__sum'], \
            #                                  receivables['closing_balance__sum'], loan_advance['closing_balance__sum'],
            #                                  deposits['closing_balance__sum'], \
            #                                  other_assets['closing_balance__sum']]))

            SundryDebtors = DateWiseLedger.objects.filter(ledger_id__primary_group_str='Sundry Debtors').aggregate(Sum('closing_balance'))
            sales_no_days = (sales_actual_till_date['closing_balance__sum'] / 30) * 365
            no_of_days = int((SundryDebtors['closing_balance__sum'] / sales_actual_till_date['closing_balance__sum']) * 365)

            SundryCreditors = DateWiseLedger.objects.filter(ledger_id__primary_group_str='Sundry Creditors').aggregate(Sum('closing_balance'))
            if purchase['closing_balance__sum']!=None:
                no_of_days_creditors = int((SundryCreditors['closing_balance__sum'] / purchase['closing_balance__sum']) * 365)
            else:
                no_of_days_creditors=0

            Inventories = DateWiseLedger.objects.filter(  Q(ledger_id__primary_group_str='Opening Stock')).aggregate(
                Sum('closing_balance'))
            salary = DateWiseLedger.objects.filter(ledger_id__primary_group_str='SALARY').aggregate(Sum('closing_balance'))
            INTEREST = DateWiseLedger.objects.filter(ledger_id__primary_group_str='INTEREST ON TDS').aggregate(Sum('closing_balance'))
            major_expenses = Ledgers.objects.filter(
                                                  Q(primary_group_str='Indirect Expenses') | Q(
                                                      primary_group_str='Direct Expenses')).order_by(
                '-closing_balance').reverse()[0:4].values('id', 'primary_group_str','name','closing_balance','budget')
            budget = Budget.objects.filter(id=1).values('id', 'sales','gross','nett')
            more_than_three_month_debtors = AgeingReport.objects.filter(days__gt=90).aggregate(Sum('amount'))
            more_than_six_month_debtors = AgeingReport.objects.filter(days__gt=180).aggregate(Sum('amount'))
            more_than_three_month_creditors = CreditorsAgeingReport.objects.filter(days__gt=90).aggregate(Sum('amount'))

            print("more_than_six_month_debtors")

            print(more_than_three_month_debtors['amount__sum'])
            print(more_than_six_month_debtors['amount__sum'])
            gross_per_till_date = (gross_margin/sales_actual_till_date['closing_balance__sum'])
            gross_per_current_month = (gross_margin_current_month/sales_current_month)

            cont = {"Item" : {
                'sales_actual_till_date': sales_actual_till_date['closing_balance__sum'],
                'gross_margin': gross_margin,
                'sales_current_month': sales_current_month,
                'gross_margin_current_month': gross_margin_current_month,
                'net_profit_current_month': net_profit_current_month,
                'net_profit': net_profit,
                'SundryDebtors': SundryDebtors['closing_balance__sum'],
                'no_of_days': no_of_days,
                'SundryCreditors': SundryCreditors['closing_balance__sum'],
                'Inventories': Inventories['closing_balance__sum'],
                'salary': salary['closing_balance__sum'],
                'INTEREST': INTEREST['closing_balance__sum'],
                'major_expenses': list(major_expenses),
                'budget': list(budget),
                'more_than_three_month_debtors': more_than_three_month_debtors['amount__sum'],
                'more_than_six_month_debtors': more_than_six_month_debtors['amount__sum'],
                'more_than_three_month_creditors': more_than_three_month_creditors['amount__sum'],
                'no_of_days_creditors': no_of_days_creditors,
                'gross_per_till_date': int(gross_per_till_date),
                'gross_per_current_month': int(gross_per_current_month),
            }}

            template = get_template('React_tables/FinancialDashboard.html')
            html = template.render(cont)

            send_html_mail("CFO Services - MIS", html, settings.EMAIL_HOST_USER, [email, ])
            response_list = []
            response_list.append({'Success': 'SENT', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            print(traceback.print_exc())
            response_list = []
            response_list.append({'Error': 'Something Went Wrong'+str(e),})
            return Response(response_list,status=500)


class schedule_mail(APIView):


    def get(self, request,email,time, *args,**kwargs):
        try:
            def send_mis_email():
                try:
                    response_list = []

                    sales_actual_till_date = DateWiseLedger.objects.filter(
                                                                           Q(
                                                                               ledger_id__primary_group_str='Sales Accounts')).aggregate(
                        Sum('closing_balance'))

                    direct_exp = DateWiseLedger.objects.filter(
                                                               Q(
                                                                   ledger_id__primary_group_str='Direct Expenses')).aggregate(
                        Sum('closing_balance'))
                    indirect_exp = DateWiseLedger.objects.filter(
                                                                 Q(
                                                                     ledger_id__primary_group_str='Indirect Expenses')).aggregate(
                        Sum('closing_balance'))
                    purchase = DateWiseLedger.objects.filter(
                                                             Q(
                                                                 ledger_id__primary_group_str='Purchase Accounts')).aggregate(
                        Sum('closing_balance'))
                    direct_income = DateWiseLedger.objects.filter(
                                                                  Q(
                                                                      ledger_id__primary_group_str='Direct Incomes')).aggregate(
                        Sum('closing_balance'))

                    indirect_income = DateWiseLedger.objects.filter(
                                                                    Q(
                                                                        ledger_id__primary_group_str='Indirect Incomes')).aggregate(
                        Sum('closing_balance'))

                    direct_exp_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                             Q(
                                                                                 ledger_id__primary_group_str='Direct Expenses')).aggregate(
                        Sum('closing_balance'))
                    indirect_exp_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                               Q(
                                                                                   ledger_id__primary_group_str='Indirect Expenses')).aggregate(
                        Sum('closing_balance'))
                    purchase_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                           Q(
                                                                               ledger_id__primary_group_str='Purchase Accounts')).aggregate(
                        Sum('closing_balance'))
                    direct_income_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                                Q(
                                                                                    ledger_id__primary_group_str='Direct Incomes')).aggregate(
                        Sum('closing_balance'))

                    indirect_income_current_month = DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                                  Q(
                                                                                      ledger_id__primary_group_str='Indirect Incomes')).aggregate(
                        Sum('closing_balance'))
                    print("sales_actual_till_date['closing_balance__sum']")
                    print(sales_actual_till_date['closing_balance__sum'])
                    print(direct_income['closing_balance__sum'])
                    print(direct_exp['closing_balance__sum'])
                    sales_current_month = sales_actual_till_date['closing_balance__sum'] - \
                                          DateWiseLedger.objects.filter(Q(ledger_date=todays_date),
                                                                        Q(ledger_id__primary_group_str='Sales Accounts')).aggregate(
                                              Sum('closing_balance'))['closing_balance__sum']

                    if direct_income['closing_balance__sum'] != None:
                        gross_margin = sales_actual_till_date['closing_balance__sum'] + direct_income[
                            'closing_balance__sum'] - direct_exp['closing_balance__sum']

                        gross_margin_current_month = sales_current_month + direct_income_current_month[
                            'closing_balance__sum'] - direct_exp_current_month['closing_balance__sum']
                    else:
                        gross_margin = sales_actual_till_date['closing_balance__sum'] - direct_exp[
                            'closing_balance__sum']
                        gross_margin_current_month = sales_current_month - direct_exp_current_month[
                            'closing_balance__sum']

                    net_profit = gross_margin - indirect_exp['closing_balance__sum'] + indirect_income[
                        'closing_balance__sum']
                    net_profit_current_month = gross_margin_current_month - indirect_exp_current_month[
                        'closing_balance__sum'] + indirect_income_current_month['closing_balance__sum']

                    # total_assets = sum(filter(None, [opening_stock['closing_balance__sum'], bank_acc['closing_balance__sum'],
                    #                                  cash_in_hand['closing_balance__sum'], \
                    #                                  receivables['closing_balance__sum'], loan_advance['closing_balance__sum'],
                    #                                  deposits['closing_balance__sum'], \
                    #                                  other_assets['closing_balance__sum']]))

                    SundryDebtors = DateWiseLedger.objects.filter(
                        ledger_id__primary_group_str='Sundry Debtors').aggregate(Sum('closing_balance'))
                    sales_no_days = (sales_actual_till_date['closing_balance__sum'] / 30) * 365
                    no_of_days = int(
                        (SundryDebtors['closing_balance__sum'] / sales_actual_till_date['closing_balance__sum']) * 365)

                    SundryCreditors = DateWiseLedger.objects.filter(
                        ledger_id__primary_group_str='Sundry Creditors').aggregate(Sum('closing_balance'))
                    if purchase['closing_balance__sum'] != None:
                        no_of_days_creditors = int(
                            (SundryCreditors['closing_balance__sum'] / purchase['closing_balance__sum']) * 365)
                    else:
                        no_of_days_creditors = 0

                    Inventories = DateWiseLedger.objects.filter( Q(
                        ledger_id__primary_group_str='Opening Stock')).aggregate(
                        Sum('closing_balance'))
                    salary = DateWiseLedger.objects.filter(ledger_id__primary_group_str='SALARY').aggregate(
                        Sum('closing_balance'))
                    INTEREST = DateWiseLedger.objects.filter(ledger_id__primary_group_str='INTEREST ON TDS').aggregate(
                        Sum('closing_balance'))
                    major_expenses = Ledgers.objects.filter(
                                                            Q(primary_group_str='Indirect Expenses') | Q(
                                                                primary_group_str='Direct Expenses')).order_by(
                        '-closing_balance').reverse()[0:4].values('id', 'primary_group_str', 'name', 'closing_balance',
                                                                  'budget')
                    budget = Budget.objects.filter(id=1).values('id', 'sales', 'gross', 'nett')
                    more_than_three_month_debtors = AgeingReport.objects.filter(days__gt=90).aggregate(Sum('amount'))
                    more_than_six_month_debtors = AgeingReport.objects.filter(days__gt=180).aggregate(Sum('amount'))
                    more_than_three_month_creditors = CreditorsAgeingReport.objects.filter(days__gt=90).aggregate(
                        Sum('amount'))

                    print("more_than_six_month_debtors")

                    print(more_than_three_month_debtors['amount__sum'])
                    print(more_than_six_month_debtors['amount__sum'])
                    gross_per_till_date = (gross_margin / sales_actual_till_date['closing_balance__sum'])
                    gross_per_current_month = (gross_margin_current_month / sales_current_month)

                    cont = {"Item": {
                        'sales_actual_till_date': sales_actual_till_date['closing_balance__sum'],
                        'gross_margin': gross_margin,
                        'sales_current_month': sales_current_month,
                        'gross_margin_current_month': gross_margin_current_month,
                        'net_profit_current_month': net_profit_current_month,
                        'net_profit': net_profit,
                        'SundryDebtors': SundryDebtors['closing_balance__sum'],
                        'no_of_days': no_of_days,
                        'SundryCreditors': SundryCreditors['closing_balance__sum'],
                        'Inventories': Inventories['closing_balance__sum'],
                        'salary': salary['closing_balance__sum'],
                        'INTEREST': INTEREST['closing_balance__sum'],
                        'major_expenses': list(major_expenses),
                        'budget': list(budget),
                        'more_than_three_month_debtors': more_than_three_month_debtors['amount__sum'],
                        'more_than_six_month_debtors': more_than_six_month_debtors['amount__sum'],
                        'more_than_three_month_creditors': more_than_three_month_creditors['amount__sum'],
                        'no_of_days_creditors': no_of_days_creditors,
                        'gross_per_till_date': int(gross_per_till_date),
                        'gross_per_current_month': int(gross_per_current_month),
                    }}

                    template = get_template('React_tables/FinancialDashboard.html')
                    html = template.render(cont)

                    send_html_mail("CFO Services - MIS", html, settings.EMAIL_HOST_USER, [email, ])
                except Exception as e:
                    print("Exception"+str(e))

            import schedule
            schedule.every().day.at(time).do(send_mis_email())
            # schedule.every().monday.do(send_mis_email())
            # schedule.every().wednesday.at("13:15").do(send_mis_email())
            # If you would like some randomness / variation you could also do something like this
            # schedule.every(1).to(2).hours.do(send_mis_email())

            def print_square(r):
                while True:
                    schedule.run_pending()

            t1 = threading.Thread(target=print_square, args=(10,))
            t1.start()


            response_list = []
            response_list.append({'Success': 'Email Sent to:'+str(email), })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            print(traceback.print_exc())
            response_list = []
            response_list.append({'Error': 'Something Went Wrong'+str(e),})
            return Response(response_list,status=500)


class send_mis_test(APIView):


    def get(self, request,email, *args,**kwargs):
        try:
            response_list =[]

            cont={"test":"test",}
            template = get_template('React_tables/FinancialDashboard.html')
            html = template.render(cont)

            send_html_mail("CFO Services - MIS", html, settings.EMAIL_HOST_USER, [email, ])
            response_list = []
            response_list.append({'Success': 'SENT', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            print(traceback.print_exc())
            response_list = []
            response_list.append({'Error': 'Something Went Wrong'+str(e),})
            return Response(response_list,status=500)


def send_mis_test_schedular():
    cont = {"test": "test", }
    template = get_template('React_tables/FinancialDashboard.html')
    html = template.render(cont)
    print("crontab2252552")
    send_html_mail("CFO Services - MIS", html, settings.EMAIL_HOST_USER, ['vikas.pandey9323@gmail.com', ])


class sync_history(APIView):

    def get(self, request, *args,**kwargs):
        try:
            response_list =[]
            obj_list = SyncHistory.objects.all().values('id','company_name__company_name','sync_timedate','sync_from_user','is_auto_sync',)

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)



class gst_r1_sales(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTR1_gst.objects.filter(gstr1_invoice__gstr1__company_id=company_id).values('id','txval','camt','samt','iamt','gstr1_invoice__invoice_no',
                       'gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no','gstr1_invoice__gstr1__customer_billing_name')
            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            to_date = user_data.pop("to_date")
            from_date = user_data.pop("from_date")
            print("to_date")
            print(request_data)
            print(to_date)
            print(from_date)
            # if GSTR1_invoice.objects.filter(gstr1__company_id=company_id,invoice_date__range=[from_date,to_date]).count()>0:
            #     response_list = []
            #     response_list.append({'Error': 'Data Already Present' , })
            #     return Response(response_list, status=500)

            current_company = Company.objects.get(id=company_id)
            current_company_gst = current_company.gst_no
            csv_data = request.FILES["csv_file"]
            import csv
            decoded_file = csv_data.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)
            count = 1
            if (count==1):
                for row in reader:
                    object_main = GSTR1()
                    object_main.company_id = current_company
                    inv_object = GSTR1_invoice()
                    sub_sub_obj = GSTR1_gst()
                    for key,value in row.items():

                        if key == 'Supplier GSTIN':
                            object_main.gst_no = value

                        if key == 'Customer Billing Name':
                            object_main.customer_billing_name = value
                            try:
                                object_main.save()
                            except Exception as e:
                                print("Exception: " + str(e))
                        if key == 'Invoice Date':
                            inv_object.invoice_date = datetime.datetime.strptime(value, '%d-%b-%y').strftime('%Y-%m-%d')
                        elif key == 'Invoice Number':
                            inv_object.invoice_no = value
                        elif key == 'Invoice Type':
                            inv_object.inv_typ = value
                        elif key == 'Total Transaction Value':
                            inv_object.total_value = value


                        if key == 'CGST Amount':
                            sub_sub_obj.camt = value
                        elif key == 'SGST Amount':
                            sub_sub_obj.samt = value
                        elif key == 'IGST Amount':
                            sub_sub_obj.iamt = value
                        elif key == 'Item Taxable Value':
                            sub_sub_obj.txval = float(value)

                    try:
                        inv_object.gstr1 = object_main
                        inv_object.save()
                    except Exception as e:
                        print("Exception: " + str(e))
                    try:
                        sub_sub_obj.gstr1_invoice = inv_object

                        sub_sub_obj.save()
                    except Exception as e:
                        print("Exception: " + str(e))
                    print('')
            gst_list = []
            invoice_list_file = []
            extra_invoice_file = []
            extra_invoice_tally = []
            obj_list = GSTR1_gst.objects.filter(gstr1_invoice__gstr1__company_id=company_id).values('id', 'txval',
                                                                                                    'camt', 'samt',
                                                                                                    'iamt',
                                                                                                    'gstr1_invoice__invoice_no',
                                                                                                    'gstr1_invoice__invoice_date',
                                                                                                    'gstr1_invoice__total_value',
                                                                                                    'gstr1_invoice__gstr1__gst_no',
                                                                                                    'gstr1_invoice__gstr1__id',)

            print("len(obj_list)) true list")
            print(GSTR1.objects.filter(report1=True).count())
            print(GSTR1.objects.filter(report2=True).count())
            print(GSTR1.objects.filter(report3=True).count())
            print(len(obj_list))
            print(len(invoice_list_file))
            invoice_list_tally = []

            vouchers_list = Vouchers.objects.filter(Q(company_id=company_id) & Q(voucher_date__lte=to_date)& Q(voucher_date__gte=from_date) & (Q(voucher_type_internal='sales') | Q(voucher_type_internal='credit_note'))).values(
                'gst',
                'v_date',
                'invoice_date_time',
                'v_number', 'voucher_date','type_name','id')
            print("vouchers_list1")
            print(vouchers_list.count())
            for item in vouchers_list:
                if item['v_number'] not in invoice_list_tally:
                    invoice_list_tally.append(item['v_number'])


                sales_object = GSTSalesValues()
                sales_object.company_id= current_company
                sales_object.gst_no= item['gst']
                sales_object.inv_no= item['v_number']
                sales_object.inv_date= item['voucher_date']
                object = VoucherItem.objects.filter(Q(voucher_id = item['id'])).values('amt','ledger_name_temp','type')
                for obj in object:
                    if obj['type'] == 'DR':
                        sales_object.total_value = obj['amt']
                    elif 'CGST' in obj['ledger_name_temp']:
                        sales_object.camt = obj['amt']
                    elif 'SGST' in obj['ledger_name_temp']:
                        sales_object.samt = obj['amt']
                    elif 'IGST' in obj['ledger_name_temp']:
                        sales_object.iamt = obj['amt']
                    elif obj['type'] == 'CR' :
                        sales_object.txval = obj['amt']
                sales_object.save()

            for item in obj_list:
                # print(item)
                if item['gstr1_invoice__gstr1__gst_no'] not in gst_list:
                    gst_list.append(item['gstr1_invoice__gstr1__gst_no'])
                if item['gstr1_invoice__invoice_no'] not in invoice_list_file:
                    invoice_list_file.append(item['gstr1_invoice__invoice_no'])
                if GSTSalesValues.objects.filter(
                        Q(company_id=company_id) & Q(gst_no=item['gstr1_invoice__gstr1__gst_no']) & Q(
                                inv_no=item['gstr1_invoice__invoice_no']) & Q(
                                total_value=(0 - item['gstr1_invoice__total_value'])) & Q(txval=item['txval']) & Q(
                                inv_date=item['gstr1_invoice__invoice_date'])).count() > 0:
                    GSTR1.objects.filter(id=item['gstr1_invoice__gstr1__id']).update(report1=True)
                elif GSTSalesValues.objects.filter(
                        Q(company_id=company_id) & Q(gst_no=item['gstr1_invoice__gstr1__gst_no']) & Q(
                                inv_no=item['gstr1_invoice__invoice_no']) & Q(txval=item['txval']) & ~Q(
                                inv_date=item['gstr1_invoice__invoice_date'])).count() > 0:
                    GSTR1.objects.filter(id=item['gstr1_invoice__gstr1__id']).update(report2=True)
                elif GSTSalesValues.objects.filter(
                        Q(company_id=company_id) & Q(gst_no=item['gstr1_invoice__gstr1__gst_no']) & Q(
                            inv_no=item['gstr1_invoice__invoice_no']) & ~Q(txval__gte=float(item['txval'])) & ~Q(txval__lte=float(item['txval']))).count() > 0:
                    print(float(item['txval']))
                    num = int(str(item['txval']).split('.')[1])
                    if num!=0:
                        GSTR1.objects.filter(id=item['gstr1_invoice__gstr1__id']).update(report3=True)

            print("len(obj_list)) true list 4 5 ")
            print(GSTR1.objects.filter(report4=True).count())
            print(GSTSalesValues.objects.filter(report5=True).count())

            for item in invoice_list_file:
                if item not in invoice_list_tally:
                    GSTR1.objects.filter(id=GSTR1_invoice.objects.get(invoice_no=item).gstr1.id).update(report4=True)
                    # extra_invoice_file.append(item)

            for item in invoice_list_tally:
                if item not in invoice_list_file:
                    GSTSalesValues.objects.filter(inv_no= item).update(report5=True)
                    # extra_invoice_tally.append(item)
            print("len(obj_list)) true list 4 5 ")
            print(GSTR1.objects.filter(report4=True).count())
            print(GSTSalesValues.objects.filter(report5=True).count())

            voucher_item = VoucherItem.objects.filter(Q(voucher_id__company_id=company_id) & Q(voucher_id__voucher_date__lte=to_date)& Q(voucher_id__voucher_date__gte=from_date) & Q(voucher_id__type_name__icontains='SALES- 19-20')).values(
                'voucher_id__gst',
                'voucher_id__v_date',
                'voucher_id__invoice_date_time',
                'voucher_id__v_number', 'voucher_id__voucher_date','voucher_id__type_name','amt','ledger_name_temp','type',)
            # for item in voucher_item:
            #     print("item:")
                # print(item)

            vouchers_list = Vouchers.objects.filter(Q(gst__in=gst_list) & Q(company_id=company_id) & Q(voucher_date__lte=to_date)& Q(voucher_date__gte=from_date) & (Q(voucher_type_internal='sales') | Q(voucher_type_internal='credit_note'))).values(
                'gst',
                'v_date',
                'v_number')
            print("vouchers_list111")
            print(vouchers_list.count())

            if (request.FILES.get("json_file")):
                data = json.loads(request.FILES.get("json_file").read())

                if current_company_gst!=data['gstin']:
                    pass
                    # response_list = []
                    # response_list.append({'Error': 'GST No. Of Company from Tally and Json File Do Not Match', })
                    # return Response(response_list, status=404)
                    # for item in data:
                        # create model instances...

                        # for key in data:
                        #     value = data[key]
                        #     print(key+"Value:"+str(value))


                        # print(item)
                        # for attribute, value in item.items():
                        #     print(attribute, value)  # ex
                        # items.append(item)
                else:
                    for item in data['b2b']:
                        object_main = GSTR1()
                        object_main.company_id = current_company
                        object_main.gst_no = item['ctin']
                        try:
                            object_main.save()
                        except Exception as e:
                            print("Exception: "+str(e))

                        obj = item['inv']
                        for key in obj:
                            for key2 in key:
                                if key2=='itms':
                                    value = key[key2]
                                    inv_object = GSTR1_invoice()
                                    inv_object.gstr1 = object_main
                                    inv_object.invoice_no = key['inum']
                                    inv_object.invoice_date = datetime.datetime.strptime(key['idt'], '%d-%m-%Y').strftime('%Y-%m-%d')
                                    inv_object.total_value = key['val']
                                    inv_object.inv_typ = key['inv_typ']
                                    try:
                                        inv_object.save()
                                    except Exception as e:
                                        print("Exception: " + str(e))
                                    for key3 in value:
                                        print("key3")
                                        print(key3)
                                        for key4 in key3:  #{'num': 1, 'itm_det': {'csamt': 0, 'samt': 0, 'rt': 18, 'txval': 6000, 'camt': 0, 'iamt': 1080}}
                                            print("key4")
                                            print(key4)
                                            if key4=='itm_det':
                                                val = key3[key4]
                                                sub_sub_obj = GSTR1_gst()
                                                sub_sub_obj.gstr1_invoice = inv_object
                                                sub_sub_obj.txval = val['txval']
                                                sub_sub_obj.camt = val['camt']
                                                sub_sub_obj.samt = val['samt']
                                                sub_sub_obj.iamt = val['iamt']
                                                sub_sub_obj.rate = val['rt']
                                                try:
                                                    sub_sub_obj.save()
                                                except Exception as e:
                                                    print("Exception: " + str(e))
                                                # for key5 in val:
                                                #     #{'csamt': 0, 'samt': 0, 'rt': 18, 'txval': 6000, 'camt': 0, 'iamt': 1080}
                                                #     print("key5")
                                                #     print(key5)
                                                #     print("val[key5]")
                                                #     print(val[key5])
                                            else:
                                                print("key3[key4]")
                                                print(key3[key4])

                                else:
                                    pass
                                    # print("Value22 :"+str(key[key2]))

                        # print(item)
                        # print("\n")
                        # for attribute, value in item.items():
                        #     print(attribute, value)  # ex
                        # items.append(item)

            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class report_sales1(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTR1_gst.objects.filter(Q(gstr1_invoice__gstr1__company_id=company_id)&Q(gstr1_invoice__gstr1__report1=True)).values('id','txval','camt','samt','iamt','gstr1_invoice__invoice_no',
                       'gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no','gstr1_invoice__gstr1__customer_billing_name')

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class report_sales2(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTR1_gst.objects.filter(Q(gstr1_invoice__gstr1__company_id=company_id)&Q(gstr1_invoice__gstr1__report2=True)).values('id','txval','camt','samt','iamt','gstr1_invoice__invoice_no',
                       'gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no','gstr1_invoice__gstr1__customer_billing_name')

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class report_sales3(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTR1_gst.objects.filter(Q(gstr1_invoice__gstr1__company_id=company_id)&Q(gstr1_invoice__gstr1__report3=True)).values('id','txval','camt','samt','iamt','gstr1_invoice__invoice_no',
                       'gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no','gstr1_invoice__gstr1__customer_billing_name')

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class report_sales4(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTR1_gst.objects.filter(Q(gstr1_invoice__gstr1__company_id=company_id)&Q(gstr1_invoice__gstr1__report4=True)).values('id','txval','camt','samt','iamt','gstr1_invoice__invoice_no',
                       'gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no','gstr1_invoice__gstr1__customer_billing_name')

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class report_sales5(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTSalesValues.objects.filter(Q(company_id=company_id)&Q(report5=True) & (~Q(gst_no="")|~Q(gst_no=None))).values('id','txval','camt','samt','iamt','inv_no',
                       'inv_date','total_value','gst_no',)

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)

class report_sales6(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTSalesValues.objects.filter(Q(company_id=company_id)& (Q(gst_no="")|Q(gst_no=None))).values('id','txval','camt','samt','iamt','inv_no',
                       'inv_date','total_value','gst_no',)

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)



# class gst_r12_purchase(APIView):
#
#     def get(self, request,company_id, *args,**kwargs):
#         try:
#             response_list =[]
#             obj_list = GSTR1_gst.objects.filter(gstr1_invoice__gstr1__company_id=company_id).values('id','txval','camt','samt','iamt','gstr1_invoice__invoice_no',
#                        'gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no')
#             context = {
#                 'obj_list': list(obj_list),
#             }
#             response_list.append(context)
#             return Response(response_list, status=200)
#
#         except Exception as e:
#             print("Exception:"+str(e))
#             response_list = []
#             response_list.append({'Error': 'Something Went Wrong', })
#             return Response(response_list, status=404)
#
#
#     def post(self, request, company_id, *args,**kwargs):
#         import json
#         try:
#             request_data = json.loads(request.data.get('data'))
#             user_data = request_data.pop("body")
#             to_date = user_data.pop("to_date")
#             from_date = user_data.pop("from_date")
#             print("to_date")
#             print(to_date)
#             print(from_date)
#             current_company = Company.objects.get(id=company_id)
#             current_company_gst = current_company.gst_no
#             csv_data = request.FILES["csv_file"]
#             import csv
#             decoded_file = csv_data.read().decode('utf-8').splitlines()
#             reader = csv.DictReader(decoded_file)
#             count = 1
#             if (count==1):
#                 for row in reader:
#                     object_main = GSTR1()
#                     object_main.company_id = current_company
#                     inv_object = GSTR1_invoice()
#                     sub_sub_obj = GSTR1_gst()
#                     for key,value in row.items():
#
#                         if key == 'Supplier GSTIN':
#                             object_main.gst_no = value
#                             try:
#                                 object_main.save()
#                             except Exception as e:
#                                 print("Exception: " + str(e))
#
#                         if key == 'Invoice Date':
#                             inv_object.invoice_date = datetime.datetime.strptime(value, '%d-%b-%y').strftime('%Y-%m-%d')
#                         elif key == 'Invoice Number':
#                             inv_object.invoice_no = value
#                         elif key == 'Invoice Type':
#                             inv_object.inv_typ = value
#                         elif key == 'Total Transaction Value':
#                             inv_object.total_value = value
#
#
#                         if key == 'CGST Amount':
#                             sub_sub_obj.camt = value
#                         elif key == 'SGST Amount':
#                             sub_sub_obj.samt = value
#                         elif key == 'IGST Amount':
#                             sub_sub_obj.iamt = value
#                         elif key == 'Item Taxable Value':
#                             sub_sub_obj.txval = value
#
#                     try:
#                         inv_object.gstr1 = object_main
#                         inv_object.save()
#                     except Exception as e:
#                         print("Exception: " + str(e))
#                     try:
#                         sub_sub_obj.gstr1_invoice = inv_object
#
#                         sub_sub_obj.save()
#                     except Exception as e:
#                         print("Exception: " + str(e))
#                     print('')
#             gst_list = []
#             invoice_list_file = []
#             extra_invoice_file = []
#             extra_invoice_tally = []
#             obj_list = GSTR1_gst.objects.filter(gstr1_invoice__gstr1__company_id=company_id).values('id', 'txval',
#                                                                                                     'camt', 'samt',
#                                                                                                     'iamt',
#                                                                                                     'gstr1_invoice__invoice_no',
#                                                                                                     'gstr1_invoice__invoice_date',
#                                                                                                     'gstr1_invoice__total_value',
#                                                                                                     'gstr1_invoice__gstr1__gst_no',
#                                                                                                     'gstr1_invoice__gstr1__id',)
#
#             print("len(obj_list)) true list")
#             print(GSTR1.objects.filter(report1=True).count())
#             print(GSTR1.objects.filter(report2=True).count())
#             print(GSTR1.objects.filter(report3=True).count())
#             print(len(obj_list))
#             print(len(invoice_list_file))
#             invoice_list_tally = []
#
#             vouchers_list = Vouchers.objects.filter(Q(company_id=company_id) & Q(voucher_date__lte=to_date)& Q(voucher_date__gte=from_date) & (Q(voucher_type_internal='purchase') | Q(voucher_type_internal='debit_note'))).values(
#                 'gst',
#                 'v_date',
#                 'invoice_date_time',
#                 'v_number', 'voucher_date','type_name','id')
#             print("vouchers_list1")
#             print(vouchers_list.count())
#             for item in vouchers_list:
#                 if item['v_number'] not in invoice_list_tally:
#                     invoice_list_tally.append(item['v_number'])
#
#
#                 sales_object = GSTSalesValues()
#                 sales_object.company_id= current_company
#                 sales_object.gst_no= item['gst']
#                 sales_object.inv_no= item['v_number']
#                 sales_object.inv_date= item['voucher_date']
#                 object = VoucherItem.objects.filter(Q(voucher_id = item['id'])).values('amt','ledger_name_temp','type')
#                 for obj in object:
#                     if obj['type'] == 'DR':
#                         sales_object.total_value = obj['amt']
#                     elif 'CGST' in obj['ledger_name_temp']:
#                         sales_object.camt = obj['amt']
#                     elif 'SGST' in obj['ledger_name_temp']:
#                         sales_object.samt = obj['amt']
#                     elif 'IGST' in obj['ledger_name_temp']:
#                         sales_object.iamt = obj['amt']
#                     elif obj['type'] == 'CR' :
#                         sales_object.txval = obj['amt']
#                 sales_object.save()
#             print("vouchers_list tally count")
#             print(len(invoice_list_tally))
#
#             # print(obj_list)
#             print(GSTR1.objects.filter(report1=True).count())
#             print(GSTR1.objects.filter(report2=True).count())
#             print(GSTR1.objects.filter(report3=True).count())
#             for item in obj_list:
#                 # print(item)
#                 if item['gstr1_invoice__gstr1__gst_no'] not in gst_list:
#                     gst_list.append(item['gstr1_invoice__gstr1__gst_no'])
#                 if item['gstr1_invoice__invoice_no'] not in invoice_list_file:
#                     invoice_list_file.append(item['gstr1_invoice__invoice_no'])
#                 if GSTSalesValues.objects.filter(
#                         Q(company_id=company_id) & Q(gst_no=item['gstr1_invoice__gstr1__gst_no']) & Q(
#                                 inv_no=item['gstr1_invoice__invoice_no']) & Q(
#                                 total_value=(0 - item['gstr1_invoice__total_value'])) & Q(txval=item['txval']) & Q(
#                                 inv_date=item['gstr1_invoice__invoice_date'])).count() > 0:
#                     GSTR1.objects.filter(id=item['gstr1_invoice__gstr1__id']).update(report1=True)
#                 elif GSTSalesValues.objects.filter(
#                         Q(company_id=company_id) & Q(gst_no=item['gstr1_invoice__gstr1__gst_no']) & Q(
#                                 inv_no=item['gstr1_invoice__invoice_no']) & Q(txval=item['txval']) & ~Q(
#                                 inv_date=item['gstr1_invoice__invoice_date'])).count() > 0:
#                     GSTR1.objects.filter(id=item['gstr1_invoice__gstr1__id']).update(report2=True)
#                 elif GSTSalesValues.objects.filter(
#                         Q(company_id=company_id) & Q(gst_no=item['gstr1_invoice__gstr1__gst_no']) & Q(
#                                 inv_no=item['gstr1_invoice__invoice_no']) & ~Q(txval__range=(item['txval'], item['txval']))).count() > 0:
#                     print(item['txval'])
#                     GSTR1.objects.filter(id=item['gstr1_invoice__gstr1__id']).update(report3=True)
#
#             print("len(obj_list)) true list 4 5 ")
#             print(GSTR1.objects.filter(report4=True).count())
#             print(GSTSalesValues.objects.filter(report5=True).count())
#
#             for item in invoice_list_file:
#                 if item not in invoice_list_tally:
#                     GSTR1.objects.filter(id=GSTR1_invoice.objects.get(invoice_no=item).gstr1.id).update(report4=True)
#                     # extra_invoice_file.append(item)
#
#             for item in invoice_list_tally:
#                 if item not in invoice_list_file:
#                     GSTSalesValues.objects.filter(inv_no= item).update(report5=True)
#                     # extra_invoice_tally.append(item)
#             print("len(obj_list)) true list 4 5 ")
#             print(GSTR1.objects.filter(report4=True).count())
#             print(GSTSalesValues.objects.filter(report5=True).count())
#
#             voucher_item = VoucherItem.objects.filter(Q(voucher_id__company_id=company_id) & Q(voucher_id__voucher_date__lte=to_date)& Q(voucher_id__voucher_date__gte=from_date) & Q(voucher_id__type_name__icontains='SALES- 19-20')).values(
#                 'voucher_id__gst',
#                 'voucher_id__v_date',
#                 'voucher_id__invoice_date_time',
#                 'voucher_id__v_number', 'voucher_id__voucher_date','voucher_id__type_name','amt','ledger_name_temp','type',)
#             # for item in voucher_item:
#             #     print("item:")
#                 # print(item)
#
#             vouchers_list = Vouchers.objects.filter(Q(gst__in=gst_list) & Q(company_id=company_id) & Q(voucher_date__lte=to_date)& Q(voucher_date__gte=from_date) & (Q(voucher_type_internal='purchase') | Q(voucher_type_internal='debit_note'))).values(
#                 'gst',
#                 'v_date',
#                 'v_number')
#             print("vouchers_list111")
#             print(vouchers_list.count())
#
#             if (request.FILES.get("json_file")):
#                 data = json.loads(request.FILES.get("json_file").read())
#
#                 if current_company_gst!=data['gstin']:
#                     pass
#                     # response_list = []
#                     # response_list.append({'Error': 'GST No. Of Company from Tally and Json File Do Not Match', })
#                     # return Response(response_list, status=404)
#                     # for item in data:
#                         # create model instances...
#
#                         # for key in data:
#                         #     value = data[key]
#                         #     print(key+"Value:"+str(value))
#
#
#                         # print(item)
#                         # for attribute, value in item.items():
#                         #     print(attribute, value)  # ex
#                         # items.append(item)
#                 else:
#                     for item in data['b2b']:
#                         object_main = GSTR1()
#                         object_main.company_id = current_company
#                         object_main.gst_no = item['ctin']
#                         try:
#                             object_main.save()
#                         except Exception as e:
#                             print("Exception: "+str(e))
#
#                         obj = item['inv']
#                         for key in obj:
#                             for key2 in key:
#                                 if key2=='itms':
#                                     value = key[key2]
#                                     inv_object = GSTR1_invoice()
#                                     inv_object.gstr1 = object_main
#                                     inv_object.invoice_no = key['inum']
#                                     inv_object.invoice_date = datetime.datetime.strptime(key['idt'], '%d-%m-%Y').strftime('%Y-%m-%d')
#                                     inv_object.total_value = key['val']
#                                     inv_object.inv_typ = key['inv_typ']
#                                     try:
#                                         inv_object.save()
#                                     except Exception as e:
#                                         print("Exception: " + str(e))
#                                     for key3 in value:
#                                         print("key3")
#                                         print(key3)
#                                         for key4 in key3:  #{'num': 1, 'itm_det': {'csamt': 0, 'samt': 0, 'rt': 18, 'txval': 6000, 'camt': 0, 'iamt': 1080}}
#                                             print("key4")
#                                             print(key4)
#                                             if key4=='itm_det':
#                                                 val = key3[key4]
#                                                 sub_sub_obj = GSTR1_gst()
#                                                 sub_sub_obj.gstr1_invoice = inv_object
#                                                 sub_sub_obj.txval = val['txval']
#                                                 sub_sub_obj.camt = val['camt']
#                                                 sub_sub_obj.samt = val['samt']
#                                                 sub_sub_obj.iamt = val['iamt']
#                                                 sub_sub_obj.rate = val['rt']
#                                                 try:
#                                                     sub_sub_obj.save()
#                                                 except Exception as e:
#                                                     print("Exception: " + str(e))
#                                                 # for key5 in val:
#                                                 #     #{'csamt': 0, 'samt': 0, 'rt': 18, 'txval': 6000, 'camt': 0, 'iamt': 1080}
#                                                 #     print("key5")
#                                                 #     print(key5)
#                                                 #     print("val[key5]")
#                                                 #     print(val[key5])
#                                             else:
#                                                 print("key3[key4]")
#                                                 print(key3[key4])
#
#                                 else:
#                                     pass
#                                     # print("Value22 :"+str(key[key2]))
#
#                         # print(item)
#                         # print("\n")
#                         # for attribute, value in item.items():
#                         #     print(attribute, value)  # ex
#                         # items.append(item)
#
#             response_list = []
#             response_list.append({'Success': 'Done', })
#             return Response(response_list, status=200)
#         except Exception as e:
#             print("Exception:"+str(e))
#             traceback.print_exc()
#             response_list = []
#             response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
#             return Response(response_list, status=500)

class gst_r12_purchase(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTR2_gst.objects.filter(gstr2_invoice__gstr1__company_id=company_id).values('id','txval','camt','samt','iamt','gstr2_invoice__invoice_no',
                       'gstr2_invoice__invoice_date','gstr2_invoice__total_value','gstr2_invoice__gstr1__gst_no','gstr2_invoice__gstr1__customer_billing_name')
            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            to_date = user_data.pop("to_date")
            from_date = user_data.pop("from_date")
            print("to_date")
            print(request_data)
            print(to_date)
            print("from_date")
            print(from_date)
            # if GSTR2_invoice.objects.filter(gstr1__company_id=company_id,invoice_date__range=[from_date,to_date]).count()>0:
            #     response_list = []
            #     response_list.append({'Error': 'Data Already Present' , })
            #     return Response(response_list, status=500)

            current_company = Company.objects.get(id=company_id)
            current_company_gst = current_company.gst_no
            csv_data = request.FILES["csv_file"]
            import csv
            print("csv_data")
            print("csv_data")
            print(csv_data)
            decoded_file = csv_data.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)
            if (request.FILES.get("json_file")): #Insert in GSTR2 Model From uploaded JSON File
                data = json.loads(request.FILES.get("json_file").read())

                if current_company_gst!=data['gstin']: #Data does not exist in Tally
                    pass

                else: #Data exist in Tally Insert in GSTR2 Model
                    for item in data['b2b']:
                        object_main = GSTR2()
                        object_main.company_id = current_company
                        object_main.gst_no = item['ctin']
                        try:
                            object_main.save()
                        except Exception as e:
                            print("Exception: "+str(e))

                        obj = item['inv']
                        for key in obj:
                            for key2 in key:
                                if key2=='itms':
                                    value = key[key2]
                                    inv_object = GSTR2_invoice()
                                    inv_object.gstr1 = object_main
                                    inv_object.invoice_no = key['inum']
                                    inv_object.invoice_date = datetime.datetime.strptime(key['idt'], '%d-%m-%Y').strftime('%Y-%m-%d')
                                    inv_object.total_value = key['val']
                                    inv_object.inv_typ = key['inv_typ']
                                    try:
                                        inv_object.save()
                                    except Exception as e:
                                        print("Exception: " + str(e))
                                    for key3 in value:
                                        print("key3")
                                        print(key3)
                                        for key4 in key3:  #{'num': 1, 'itm_det': {'csamt': 0, 'samt': 0, 'rt': 18, 'txval': 6000, 'camt': 0, 'iamt': 1080}}
                                            print("key4")
                                            print(key4)
                                            if key4=='itm_det':
                                                val = key3[key4]
                                                sub_sub_obj = GSTR2_gst()
                                                sub_sub_obj.gstr2_invoice = inv_object
                                                sub_sub_obj.txval = val['txval']
                                                sub_sub_obj.camt = val['camt']
                                                sub_sub_obj.samt = val['samt']
                                                sub_sub_obj.iamt = val['iamt']
                                                sub_sub_obj.rate = val['rt']
                                                try:
                                                    sub_sub_obj.save()
                                                except Exception as e:
                                                    print("Exception: " + str(e))

                                            else:
                                                print("key3[key4]")
                                                print(key3[key4])

                                else:
                                    pass
                                    # print("Value22 :"+str(key[key2]))



            count = 1
            if (count==1):          #Insert in GSTR2 Model From uploaded CSV
                for row in reader:
                    print(str(row))
                    print(str(row))
                    object_main = GSTR2()
                    object_main.company_id = current_company
                    inv_object = GSTR2_invoice()
                    sub_sub_obj = GSTR2_gst()
                    for key,value in row.items():

                        if key == 'Supplier GSTIN':
                            object_main.gst_no = value

                        if key == 'Customer Billing Name':
                            object_main.customer_billing_name = value
                            try:
                                object_main.save()
                            except Exception as e:
                                print("Exception: " + str(e))
                        if key == 'Invoice Date':
                            inv_object.invoice_date = datetime.datetime.strptime(value, '%d-%b-%y').strftime('%Y-%m-%d')
                        elif key == 'Invoice Number':
                            inv_object.invoice_no = value
                        elif key == 'Invoice Type':
                            inv_object.inv_typ = value
                        elif key == 'Total Transaction Value':
                            inv_object.total_value = value


                        if key == 'CGST Amount':
                            sub_sub_obj.camt = value
                        elif key == 'SGST Amount':
                            sub_sub_obj.samt = value
                        elif key == 'IGST Amount':
                            sub_sub_obj.iamt = value
                        elif key == 'Item Taxable Value':
                            sub_sub_obj.txval = float(value)

                    try:
                        inv_object.gstr2 = object_main
                        inv_object.save()
                    except Exception as e:
                        print("Exception4566: " + str(e))

                        traceback.print_exc()
                    try:
                        sub_sub_obj.gstr2_invoice = inv_object

                        sub_sub_obj.save()
                    except Exception as e:
                        traceback.print_exc()
                        print("Exception8889: " + str(e))
                    print('')   #
            gst_list = []
            invoice_list_file = []
            extra_invoice_file = []
            extra_invoice_tally = []
            obj_list = GSTR2_gst.objects.filter(gstr2_invoice__gstr2__company_id=company_id).values('id', 'txval',
                                                                                                    'camt', 'samt',
                                                                                                    'iamt',
                                                                                                    'gstr2_invoice__invoice_no',
                                                                                                    'gstr2_invoice__invoice_date',
                                                                                                    'gstr2_invoice__total_value',
                                                                                                    'gstr2_invoice__gstr2__gst_no',
                                                                                                    'gstr2_invoice__gstr2__id',)

            print("Reports Count 1 - 3:")
            print(GSTR2.objects.filter(report1=True).count())
            print(GSTR2.objects.filter(report2=True).count())
            print(GSTR2.objects.filter(report3=True).count())
            print(len(obj_list))
            print(len(invoice_list_file))
            print(str(company_id))
            invoice_list_tally = []

            vouchers_list = Vouchers.objects.filter(Q(company_id=company_id) & Q(voucher_date__lte=to_date)& Q(voucher_date__gte=from_date) & (Q(voucher_type_internal='purchase') | Q(voucher_type_internal='debit_note') | Q(type_name='Journal') | Q(type_name='Payment'))).values(
                'gst',
                'v_date',
                'invoice_date_time',
                'v_number', 'voucher_date','type_name','id')
                # 'v_number', 'voucher_date','type_name','id').exclude(id__in=VoucherItem.objects.filter(Q(voucher_id__company_id=company_id) & Q(ledger_name_temp__icontains='gst')).values_list('voucher_id__pk',flat=True))
            #in jv if 'gst' in debit and credit then ignore
            #in payment only if ledger is under 'Fixed Asset' group or 'Expense group'

            print("vouchers_list1")
            print(vouchers_list.count())
            for item in vouchers_list:
                if item['v_number'] not in invoice_list_tally:
                    invoice_list_tally.append(item['v_number'])


                sales_object = GSTPurchaseValues()   #Insert Data From Voucher Model To GSTPurchaseValues For Comparision
                sales_object.company_id= current_company
                sales_object.gst_no= item['gst']
                sales_object.inv_no= item['v_number']
                sales_object.inv_date= item['voucher_date']
                object = VoucherItem.objects.filter(Q(voucher_id=item['id'])).values('amt','ledger_name_temp','type')
                for obj in object:
                    print("obj")
                    print(obj)
                    if obj['type'] == 'CR':
                        sales_object.total_value = obj['amt']
                    elif 'CGST' in obj['ledger_name_temp']:
                        sales_object.camt = float(obj['amt'])
                    elif 'SGST' in obj['ledger_name_temp']:
                        sales_object.samt = float(obj['amt'])
                    elif 'IGST' in obj['ledger_name_temp']:
                        sales_object.iamt = float(obj['amt'])
                    elif obj['type'] == 'DR' :
                        sales_object.txval = obj['amt']
                sales_object.save()

            for item in obj_list:   #Compare Data From GSTR2 and GSTPurchaseValues For Generating 5 Reports
                # print(item)
                if item['gstr2_invoice__gstr2__gst_no'] not in gst_list:
                    gst_list.append(item['gstr2_invoice__gstr2__gst_no'])
                if item['gstr2_invoice__invoice_no'] not in invoice_list_file:
                    invoice_list_file.append(item['gstr2_invoice__invoice_no'])
                if GSTPurchaseValues.objects.filter(    #For Report 1
                        Q(company_id=company_id) & Q(gst_no=item['gstr2_invoice__gstr2__gst_no']) & Q(
                                inv_no=item['gstr2_invoice__invoice_no']) & Q(
                                total_value=(0 - item['gstr2_invoice__total_value'])) & Q(txval=item['txval']) & Q(
                                inv_date=item['gstr2_invoice__invoice_date'])).count() > 0:
                    GSTR2.objects.filter(id=item['gstr2_invoice__gstr2__id']).update(report1=True)
                elif GSTPurchaseValues.objects.filter(  #For Report 2
                        Q(company_id=company_id) & Q(gst_no=item['gstr2_invoice__gstr2__gst_no']) & Q(
                                inv_no=item['gstr2_invoice__invoice_no']) & Q(txval=item['txval']) & ~Q(
                                inv_date=item['gstr2_invoice__invoice_date'])).count() > 0:
                    GSTR2.objects.filter(id=item['gstr2_invoice__gstr2__id']).update(report2=True)
                elif GSTPurchaseValues.objects.filter(   #For Report 3
                        Q(company_id=company_id) & Q(gst_no=item['gstr2_invoice__gstr2__gst_no']) & Q(
                            inv_no=item['gstr2_invoice__invoice_no']) & ~Q(txval__gte=float(item['txval'])) & ~Q(txval__lte=float(item['txval']))).count() > 0:
                    print(float(item['txval']))
                    num = int(str(item['txval']).split('.')[1])
                    if num!=0:
                        GSTR2.objects.filter(id=item['gstr2_invoice__gstr2__id']).update(report3=True)

            print("len(obj_list)) true list 4 5 ")
            print(GSTR2.objects.filter(report4=True).count())
            print(GSTPurchaseValues.objects.filter(report5=True).count())

            for item in invoice_list_file: #For Report 4
                if item not in invoice_list_tally:
                    GSTR2.objects.filter(id=GSTR2_invoice.objects.get(invoice_no=item).gstr1.id).update(report4=True)
                    # extra_invoice_file.append(item)

            for item in invoice_list_tally:  #For Report 5
                if item not in invoice_list_file:
                    GSTPurchaseValues.objects.filter(inv_no= item).update(report5=True)
                    # extra_invoice_tally.append(item)
            print("len(obj_list)) true list 4 5 ")
            print(GSTR2.objects.filter(report4=True).count())
            print(GSTPurchaseValues.objects.filter(report5=True).count())

            voucher_item = VoucherItem.objects.filter(Q(voucher_id__company_id=company_id) & Q(voucher_id__voucher_date__lte=to_date)& Q(voucher_id__voucher_date__gte=from_date) & Q(voucher_id__type_name__icontains='SALES- 19-20')).values(
                'voucher_id__gst',
                'voucher_id__v_date',
                'voucher_id__invoice_date_time',
                'voucher_id__v_number', 'voucher_id__voucher_date','voucher_id__type_name','amt','ledger_name_temp','type',)
            # for item in voucher_item:
            #     print("item:")
                # print(item)

            vouchers_list = Vouchers.objects.filter(Q(gst__in=gst_list) & Q(company_id=company_id) & Q(voucher_date__lte=to_date)& Q(voucher_date__gte=from_date) & (Q(voucher_type_internal='purchase') | Q(voucher_type_internal='debit_note') | Q(type_name='Journal'))).values(
                'gst',
                'v_date',
                'v_number')
            print("vouchers_list111")
            print(vouchers_list.count())

            if (request.FILES.get("json_file")): #Insert in GSTR2 Model From uploaded JSON File
                data = json.loads(request.FILES.get("json_file").read())

                if current_company_gst!=data['gstin']: #Data does not exist in Tally
                    pass
                    # response_list = []
                    # response_list.append({'Error': 'GST No. Of Company from Tally and Json File Do Not Match', })
                    # return Response(response_list, status=404)
                    # for item in data:
                        # create model instances...

                        # for key in data:
                        #     value = data[key]
                        #     print(key+"Value:"+str(value))


                        # print(item)
                        # for attribute, value in item.items():
                        #     print(attribute, value)  # ex
                        # items.append(item)
                else: #Data exist in Tally Insert in GSTR2 Model
                    for item in data['b2b']:
                        object_main = GSTR2()
                        object_main.company_id = current_company
                        object_main.gst_no = item['ctin']
                        try:
                            object_main.save()
                        except Exception as e:
                            print("Exception: "+str(e))

                        obj = item['inv']
                        for key in obj:
                            for key2 in key:
                                if key2=='itms':
                                    value = key[key2]
                                    inv_object = GSTR2_invoice()
                                    inv_object.gstr1 = object_main
                                    inv_object.invoice_no = key['inum']
                                    inv_object.invoice_date = datetime.datetime.strptime(key['idt'], '%d-%m-%Y').strftime('%Y-%m-%d')
                                    inv_object.total_value = key['val']
                                    inv_object.inv_typ = key['inv_typ']
                                    try:
                                        inv_object.save()
                                    except Exception as e:
                                        print("Exception: " + str(e))
                                    for key3 in value:
                                        print("key3")
                                        print(key3)
                                        for key4 in key3:  #{'num': 1, 'itm_det': {'csamt': 0, 'samt': 0, 'rt': 18, 'txval': 6000, 'camt': 0, 'iamt': 1080}}
                                            print("key4")
                                            print(key4)
                                            if key4=='itm_det':
                                                val = key3[key4]
                                                sub_sub_obj = GSTR2_gst()
                                                sub_sub_obj.gstr2_invoice = inv_object
                                                sub_sub_obj.txval = val['txval']
                                                sub_sub_obj.camt = val['camt']
                                                sub_sub_obj.samt = val['samt']
                                                sub_sub_obj.iamt = val['iamt']
                                                sub_sub_obj.rate = val['rt']
                                                try:
                                                    sub_sub_obj.save()
                                                except Exception as e:
                                                    print("Exception: " + str(e))
                                                # for key5 in val:
                                                #     #{'csamt': 0, 'samt': 0, 'rt': 18, 'txval': 6000, 'camt': 0, 'iamt': 1080}
                                                #     print("key5")
                                                #     print(key5)
                                                #     print("val[key5]")
                                                #     print(val[key5])
                                            else:
                                                print("key3[key4]")
                                                print(key3[key4])

                                else:
                                    pass
                                    # print("Value22 :"+str(key[key2]))

                        # print(item)
                        # print("\n")
                        # for attribute, value in item.items():
                        #     print(attribute, value)  # ex
                        # items.append(item)

            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)

class report_purchase1(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTR1_gst.objects.filter(Q(gstr1_invoice__gstr1__company_id=company_id)&Q(gstr1_invoice__gstr1__report1=True)).values('id','txval','camt','samt','iamt','gstr1_invoice__invoice_no',
                       'gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no')

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class report_purchase2(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTR1_gst.objects.filter(Q(gstr1_invoice__gstr1__company_id=company_id)&Q(gstr1_invoice__gstr1__report2=True)).values('id','txval','camt','samt','iamt','gstr1_invoice__invoice_no',
                       'gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no')

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class report_purchase3(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTR1_gst.objects.filter(Q(gstr1_invoice__gstr1__company_id=company_id)&Q(gstr1_invoice__gstr1__report3=True)).values('id','txval','camt','samt','iamt','gstr1_invoice__invoice_no',
                       'gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no')

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class report_purchase4(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTR1_gst.objects.filter(Q(gstr1_invoice__gstr1__company_id=company_id)&Q(gstr1_invoice__gstr1__report4=True)).values('id','txval','camt','samt','iamt','gstr1_invoice__invoice_no',
                       'gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no')

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class report_purchase5(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            obj_list = GSTSalesValues.objects.filter(Q(company_id=company_id)&Q(report5=True)).values('id','txval','camt','samt','iamt','inv_no',
                       'inv_date','total_value','gst_no')

            context = {
                'obj_list': list(obj_list),
            }
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


def get_diff(a,b):
    if a != None and b!=None:
        return a-b
    elif a!= None and b==None:
        return a
    elif b!=None and a==None:
        return b
    else:
        return 0


class gst_summary(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            print("symmary")
            response_list =[]
            company_id = 1
            # obj_list = GSTSalesValues.objects.filter(Q(company_id=company_id)).values('id','txval','camt','samt','iamt','inv_no','inv_date','total_value','gst_no')
            obj_list = GSTSalesValues.objects.filter(Q(company_id=company_id)).values('gst_no','customer_billing_name')
            obj_list = obj_list.distinct()
            print("obj_list")
            print(obj_list)
            main_obj_list = []
            for obj in obj_list:
                gst_file = GSTR1_gst.objects.filter(gstr1_invoice__gstr1__company_id__pk=company_id,gstr1_invoice__gstr1__gst_no=obj['gst_no']).values('txval','camt','samt','iamt','gstr1_invoice__invoice_no','gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no','gstr1_invoice__gstr1__customer_billing_name')
                obj_list112 = gst_file.aggregate(txval_amt=Sum('txval'))
                obj_list22 = gst_file.aggregate(camt_amt=Sum('camt'))
                obj_list32 = gst_file.aggregate(samt_amt=Sum('samt'))
                obj_list42 = gst_file.aggregate(iamt_amt=Sum('iamt'))
                obj_list52 = gst_file.aggregate(total_value=Sum('gstr1_invoice__total_value'))

                obj_list1 = GSTSalesValues.objects.filter(Q(company_id=company_id)&Q(gst_no=obj['gst_no'])).values('txval','camt','samt','iamt','inv_no','inv_date','total_value','gst_no')
                obj_list11 = obj_list1.aggregate(txval_amt=Sum('txval'))
                obj_list2 = obj_list1.aggregate(camt_amt=Sum('camt'))
                obj_list3 = obj_list1.aggregate(samt_amt=Sum('samt'))
                obj_list4 = obj_list1.aggregate(iamt_amt=Sum('iamt'))
                obj_list5 = obj_list1.aggregate(total_value=Sum('total_value'))

                # for single_obj_gst_file in gst_file:
                #
                #     print("single_objss")
                #     print(single_obj)
                for single_obj in obj_list1:
                    for single_obj_gst_file in gst_file:
                        if single_obj_gst_file['gstr1_invoice__invoice_no'] ==  single_obj['inv_no']:
                            single_obj.update({
                                "tx_val" :single_obj_gst_file['txval'],
                                "c_amt" :single_obj_gst_file['camt'],
                                "s_amt" :single_obj_gst_file['samt'],
                                "i_amt" :single_obj_gst_file['iamt'],
                                "customer_billing_name" :single_obj_gst_file['gstr1_invoice__gstr1__customer_billing_name'],
                                "gstr1_invoice__invoice_no" :single_obj_gst_file['gstr1_invoice__invoice_no'],
                                "gstr1_invoice__invoice_date" :single_obj_gst_file['gstr1_invoice__invoice_date'],
                                "gstr1_invoice__total_value" :single_obj_gst_file['gstr1_invoice__total_value'],
                                "gstr1_invoice__gstr1__gst_no" :single_obj_gst_file['gstr1_invoice__total_value'],
                                "diff_cgst" :single_obj_gst_file['camt']-single_obj['camt'],
                                "diff_sgst" :single_obj_gst_file['samt']-single_obj['samt'],
                                "diff_igst" :single_obj_gst_file['iamt']-single_obj['iamt'],
                            })

                # gst_file = list(gst_file)
                # obj_list1 = list(obj_list1)
                # # result = {x['id']: x for x in gst_file + obj_list1}.values()
                # # print("result")
                # # print(result)
                main_obj = {
                    'gst_no': obj['gst_no'],
                    'txval': obj_list11['txval_amt'],
                    'camt': obj_list2['camt_amt'],
                    'samt': obj_list3['samt_amt'],
                    'iamt': obj_list4['iamt_amt'],
                    'total_value': obj_list5['total_value'],

                    'txval_gst_file': obj_list112['txval_amt'],
                    'camt_gst_file': obj_list22['camt_amt'],
                    'samt_gst_file': obj_list32['samt_amt'],
                    'iamt_gst_file': obj_list42['iamt_amt'],
                    'total_value_gst_file': obj_list52['total_value'],

                    "diff_txval": get_diff(obj_list11['txval_amt'] , obj_list112['txval_amt']),
                    "diff_cgst": get_diff(obj_list2['camt_amt'] , obj_list22['camt_amt']),
                    "diff_sgst":   get_diff(obj_list3['samt_amt'] , obj_list32['samt_amt']),
                    "diff_igst": get_diff(obj_list4['iamt_amt'] , obj_list42['iamt_amt']),
                    "diff_total_value": get_diff(obj_list5['total_value'] ,obj_list52['total_value']),

                    'sub_item_list': list(obj_list1),
                    'toggle': False,
                    'customer_billing_name': obj['customer_billing_name'],

                }
                main_obj_list.append(main_obj)

                # print("main_obj")
                # print(main_obj)
                # print("------------------------------------------")

                
            # obj_list = GSTSalesValues.objects.filter(Q(company_id=company_id)).values('id','txval','camt','samt','iamt','inv_no','inv_date','total_value','gst_no')
            # for item in obj_list:
            #     print(item)
            from django.db.models import Count
            gstr1=GSTR1_gst.objects.all().values('txval','camt','samt','rate')
            gstsalsevalues=GSTSalesValues.objects.all().values('txval','camt','samt','rate')
            # gst_file = GSTR1_gst.objects.filter(gstr1_invoice__gstr1__company_id__pk=company_id,gstr1_invoice__gstr1__gst_no=obj['gst_no']).values('txval','camt','samt','iamt','gstr1_invoice__invoice_no','gstr1_invoice__invoice_date','gstr1_invoice__total_value','gstr1_invoice__gstr1__gst_no')
      

            # dupes = GSTR1_gst.objects.values('gstr1_invoice__invoice_no').order_by().annotate(Count('id')).order_by()
            # GSTSales=GSTSalesValues.objects.filter(inv_no__in=[item['gstr1_invoice__invoice_no'] for item in dupes])
            #
            # if GSTSales:
            #     for item in GSTSales:
            #         gst_file = GSTR1_gst.objects.filter(gstr1_invoice__invoice_no=item.inv_no).values('gstr1_invoice__gstr1__gst_no','gstr1_invoice__invoice_date','gstr1_invoice','txval','camt','samt','iamt','rate')
            #         for gst in gst_file:
            #             diff_txval=item.txval-gst['txval']
            #             diff_camt=item.camt-gst['camt']
            #             diff_samt=item.samt-gst['samt']
            #             diff_iamt=item.iamt-gst['iamt']
            #             diff_rate=item.rate-gst['rate']
            #             # print(gst['gstr1_invoice__gstr1__gst_no'],gst['gstr1_invoice__invoice_date'],gst['gstr1_invoice'],diff_txval,diff_camt,diff_samt,diff_iamt,diff_rate)
            #             main_obj1 = {
            #             'gst_no':gst['gstr1_invoice__gstr1__gst_no'],
            #             'txval': gst['txval'],
            #             'camt': gst['camt'],
            #             'samt': gst['samt'],
            #             'iamt': gst['iamt'],
            #             'cess': gst['rate'],
            #             # 'total_value': obj_list5['total_value'],
            #             'inv_date': gst['gstr1_invoice__invoice_date'],
            #             'inv_no': gst['gstr1_invoice'],
            #             'tx_val': item.txval,
            #             'c_gst': item.camt,
            #             's_gst':item.samt,
            #             'i_gst':item.iamt,
            #             'c_ess':item.rate,
            #             'diff_cgst':diff_camt,
            #             'diff_sgst':diff_samt,
            #             'diff_igst':diff_iamt,
            #             'diff_rate':diff_rate,
            #             }
            #             main_obj_list.append(main_obj1)

            context = {
                'obj_list': list(obj_list),                
                'main_obj_list': main_obj_list,
            }
            
            response_list.append(context)
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            print(traceback.print_exc())
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class sales_report(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            print("company_id")
            print(company_id)
            ledger_list = []
            company_id = 39
            if company_id == 'undefined':
                company_id=28
            todays_date = datetime.datetime.today().strftime('%Y-%m-%d')
            obj_list = VoucherItem.objects.filter(Q(voucher_id__company_id=company_id)&Q(voucher_id__type_name__icontains='receipt')&Q(type='CR'))[0:10].values('id','ledger_name_temp','amt','voucher_id__v_date')
            # day_sales = VoucherItem.objects.filter(Q(voucher_id__company_id=company_id)&Q(voucher_id__voucher_date=)).aggregate(
            #     Sum('amt'))
            obj_ledgers = Ledgers.objects.filter(Q(parent_str='Bank Accounts') & Q(company_id__id=company_id)).exclude(closing_balance=0)[0:10].values('id','name','closing_balance',)
            sales_actual_till_date = DateWiseLedger.objects.filter(Q(ledger_id__company_id=company_id) &Q(ledger_id__parent_str='Sales Accounts')
                                                                   & Q(ledger_date__month=12)&
                                                                   Q(ledger_date__year=2019)).aggregate(
                Sum('closing_balance'))
            sales_actual_monthly_apr = DateWiseLedger.objects.filter(Q(ledger_id__company_id=company_id)&Q(ledger_id__parent_str='Sales Accounts')&Q(ledger_date__month=11)).aggregate(Sum('closing_balance'))
            sales_actual_monthly_may = DateWiseLedger.objects.filter(Q(ledger_id__company_id=company_id) & Q(ledger_id__parent_str='Sales Accounts')&Q(ledger_date__month=12)).aggregate(Sum('closing_balance'))
            print("sales_actual_monthly_apr")
            print(sales_actual_monthly_apr['closing_balance__sum'])
            print("final figures")
            print(sales_actual_monthly_may['closing_balance__sum']-sales_actual_monthly_apr['closing_balance__sum'])
            sales_actual_yearly = DateWiseLedger.objects.filter(Q(ledger_id__company_id=company_id) &Q(ledger_id__parent_str='Sales Accounts')&Q(ledger_date__month=12)).aggregate(Sum('closing_balance'))
            print("sales_actual_yearly")
            print(sales_actual_yearly)
            for item in obj_list:
                print(item['ledger_name_temp'])
                ledger_list.append(item['ledger_name_temp'])
                current_date = str(item['voucher_id__v_date'])
                item.update({'voucher_id_date': current_date[6:8] + "/" +current_date[4:6] + "/" +current_date[0:4]    })

            from django.db.models.functions import TruncMonth
            from django.db.models import Count
            import calendar
            sales_graph = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')).annotate(month=TruncMonth('ledger_date')).values('month').annotate(ledger_amt=Sum('closing_balance')).values('month', 'ledger_amt')
            receipt_graph = DateWiseLedger.objects.filter(Q(ledger_id__name=ledger_list)).annotate(month=TruncMonth('ledger_date')).values('month').annotate(ledger_amt=Sum('closing_balance')).values('month', 'ledger_amt')
            sales_month_list = []
            sales_amount_list = []
            receipt_amount_list = []
            items_list = {}
            for item in receipt_graph:
                items_list.update({calendar.month_abbr[item['month'].month] : item['ledger_amt']})
            for item in sales_graph:
                sales_month_list.append(calendar.month_abbr[item['month'].month])
                sales_amount_list.append(item['ledger_amt'])
                if calendar.month_abbr[item['month'].month] in items_list:
                    receipt_amount_list.append(items_list[calendar.month_abbr[item['month'].month]])
                else:
                    receipt_amount_list.append(0.0)
            for item in obj_ledgers:
                item.update({'closing_balance': format(float(format(-1 * item['closing_balance'],'.2f')) ,',')})
            for item in obj_list:
                item.update({'amt': format(float(format(item['amt'], '.2f')), ',')})


            sales_todays = CrucialNumbers.objects.filter(company_id=company_id).order_by('-id')[0:1].values('id','todays_sale',)
            print("sales_todays")
            print(sales_todays[0]['todays_sale'])
            context = {
                'obj_list': list(obj_list),
                'obj_ledgers': list(obj_ledgers),
                'sales_actual_till_date': sales_todays[0]['todays_sale'],
                'sales_actual_monthly': sales_actual_monthly_may['closing_balance__sum']-sales_actual_monthly_apr['closing_balance__sum'],
                'sales_actual_yearly': sales_actual_yearly['closing_balance__sum'],
                'sales_month_list': sales_month_list,
                'sales_amount_list': sales_amount_list,
                'receipt_amount_list': receipt_amount_list,
            }
            response_list.append(context)
            template = get_template('React_tables/CFOMail_WOGraph.html')
            html = template.render(context)

            # send_html_mail("CFO Services - MIS", html, settings.EMAIL_HOST_USER, ['vikas.pandey9323@gmail.com', ])
            return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class sales_report_mail(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            print("company_id")
            print(company_id)
            ledger_list = []
            company_id = 39
            obj_list = VoucherItem.objects.filter(Q(voucher_id__company_id=company_id)&Q(voucher_id__type_name__icontains='receipt')&Q(type='CR'))[0:10].values('id','ledger_name_temp','amt','voucher_id__v_date')
            obj_ledgers = Ledgers.objects.filter(Q(parent_str__icontains='bank'))[0:10].values('id','name','closing_balance',)
            sales_actual_till_date = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')
                                                                   , Q(ledger_date__month=10),
                                                                   Q(ledger_date__year=2019)).aggregate(
                Sum('closing_balance'))
            sales_actual_monthly = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')).aggregate(Sum('closing_balance'))
            sales_actual_yearly = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')).aggregate(Sum('closing_balance'))

            for item in obj_list:
                print(item['ledger_name_temp'])
                ledger_list.append(item['ledger_name_temp'])
                current_date = str(item['voucher_id__v_date'])
                item.update({'voucher_id_date': current_date[0:3]+"/"+current_date[4:5]+"/"+current_date[5:6]})

            from django.db.models.functions import TruncMonth
            from django.db.models import Count
            import calendar
            sales_graph = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')).annotate(month=TruncMonth('ledger_date')).values('month').annotate(ledger_amt=Sum('closing_balance')).values('month', 'ledger_amt')
            receipt_graph = DateWiseLedger.objects.filter(Q(ledger_id__name=ledger_list)).annotate(month=TruncMonth('ledger_date')).values('month').annotate(ledger_amt=Sum('closing_balance')).values('month', 'ledger_amt')
            sales_month_list = []
            sales_amount_list = []
            receipt_amount_list = []
            items_list = {}
            sales_list_canvas= []
            receipt_list_canvas= []
            val1 = 'label'
            val2 = 'y'
            for item in receipt_graph:
                items_list.update({calendar.month_abbr[item['month'].month] : item['ledger_amt']})
            for item in sales_graph:
                sales_list_canvas.append({val1.lstrip('\'').rstrip('\''): calendar.month_abbr[item['month'].month], val2 : float(item['ledger_amt'])},)
                sales_month_list.append(calendar.month_abbr[item['month'].month])
                sales_amount_list.append(item['ledger_amt'])
                if calendar.month_abbr[item['month'].month] in items_list:
                    receipt_amount_list.append(items_list[calendar.month_abbr[item['month'].month]])
                    receipt_list_canvas.append(
                        {val1.lstrip('\'').rstrip('\''): calendar.month_abbr[item['month'].month], val2: float(item['ledger_amt'])}, )

                else:
                    receipt_amount_list.append(0.0)
                    receipt_list_canvas.append(
                        {val1.lstrip('\'').rstrip('\''): calendar.month_abbr[item['month'].month], val2: 0.0}, )
            print("obj_list")
            print(obj_list)

            context = {
                'obj_list': list(obj_list),
                'obj_ledgers': list(obj_ledgers),
                'sales_actual_till_date': sales_actual_till_date['closing_balance__sum'],
                'sales_actual_monthly': sales_actual_monthly['closing_balance__sum'],
                'sales_actual_yearly': sales_actual_yearly['closing_balance__sum'],
                'sales_month_list': sales_month_list,
                'sales_amount_list': sales_amount_list,
                'receipt_amount_list': receipt_amount_list,
                'sales_list_canvas': sales_list_canvas,
                'receipt_list_canvas': receipt_list_canvas,
            }
            response_list.append(context)

            template = get_template('React_tables/CFOMail.html')
            html = template.render(response_list)

            send_html_mail("CFO Services - MIS", html, settings.EMAIL_HOST_USER, ['vikas.pandey9323@gmail.com', ])


            return render(request, "React_tables/CFOMail.html", context)
            # return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, company_id, *args,**kwargs):
        import json
        try:
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class sales_report_mail_image(APIView):

    def get(self, request,company_id, *args,**kwargs):
        try:
            response_list =[]
            print("company_id")
            print(company_id)
            ledger_list = []
            obj_list = VoucherItem.objects.filter(Q(voucher_id__company_id=company_id)&Q(voucher_id__type_name__icontains='receipt')&Q(type='CR'))[0:10].values('id','ledger_name_temp','amt','voucher_id__v_date')
            obj_ledgers = Ledgers.objects.filter(Q(parent_str__icontains='bank'))[0:10].values('id','name','closing_balance',)
            sales_actual_till_date = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')
                                                                   , Q(ledger_date__month=10),
                                                                   Q(ledger_date__year=2019)).aggregate(
                Sum('closing_balance'))
            sales_actual_monthly = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')).aggregate(Sum('closing_balance'))
            sales_actual_yearly = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')).aggregate(Sum('closing_balance'))

            for item in obj_list:
                print(item['ledger_name_temp'])
                ledger_list.append(item['ledger_name_temp'])

            from django.db.models.functions import TruncMonth
            from django.db.models import Count
            import calendar
            sales_graph = DateWiseLedger.objects.filter(Q(ledger_id__parent_str='Sales Accounts')).annotate(month=TruncMonth('ledger_date')).values('month').annotate(ledger_amt=Sum('closing_balance')).values('month', 'ledger_amt')
            receipt_graph = DateWiseLedger.objects.filter(Q(ledger_id__name=ledger_list)).annotate(month=TruncMonth('ledger_date')).values('month').annotate(ledger_amt=Sum('closing_balance')).values('month', 'ledger_amt')
            sales_month_list = []
            sales_amount_list = []
            receipt_amount_list = []
            items_list = {}
            for item in receipt_graph:
                items_list.update({calendar.month_abbr[item['month'].month] : item['ledger_amt']})
            for item in sales_graph:
                sales_month_list.append(calendar.month_abbr[item['month'].month])
                sales_amount_list.append(item['ledger_amt'])
                if calendar.month_abbr[item['month'].month] in items_list:
                    receipt_amount_list.append(items_list[calendar.month_abbr[item['month'].month]])
                else:
                    receipt_amount_list.append(0.0)

            context = {
                'obj_list': list(obj_list),
                'obj_ledgers': list(obj_ledgers),
                'sales_actual_till_date': sales_actual_till_date['closing_balance__sum'],
                'sales_actual_monthly': sales_actual_monthly['closing_balance__sum'],
                'sales_actual_yearly': sales_actual_yearly['closing_balance__sum'],
                'sales_month_list': sales_month_list,
                'sales_amount_list': sales_amount_list,
                'receipt_amount_list': receipt_amount_list,
            }
            response_list.append(context)
            return render(request, "React_tables/CFOMail.html", context)
            # return Response(response_list, status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, *args,**kwargs):
        try:
            print("request.data")
            print(request.POST['file_pdf'])

            import base64
            from PIL import Image
            import os, io

            image2 = request.POST['file_pdf']
            print(image2)
            from PIL import Image
            from io import BytesIO
            import base64

            image2 = image2.split('octet-stream;base64,')[1]

            im = Image.open(BytesIO(base64.b64decode(image2)))
            buffer = BytesIO()
            im.save(buffer, format='JPEG', quality=100)
            desiredObject = buffer.getbuffer()
            history = SalesReport()
            history.imag.save('rep.jpeg', ContentFile(desiredObject), save=False)
            history.save()
            obj_tr = history
            cont = {"image": obj_tr, }
            print('imag.url')
            print(obj_tr.imag.url)
            template = get_template('React_tables/index.html')
            html = template.render(cont)


            # email_send = EmailMessage('Proforma Invoice for Enquiry Number ' , 'hello',
            #                           settings.EMAIL_HOST_USER, ["vikas.pandey9323@gmail.com", ],
            #                           )
            # email_send.content_subtype = 'html'
            # email_send.attach('ProformaInvoice.jpeg', desiredObject, 'image/png')
            # email_send.send()

            send_html_mail("CFO Services - MIS2",html , settings.EMAIL_HOST_USER, ["vikas.pandey9323@gmail.com", ])

            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class sales_report_mail_show(APIView):

    def get(self, request, *args,**kwargs):
        try:
            history = SalesReport.objects.all().order_by('-id')[0]

            cont = {"image": history, }

            return render(request, "React_tables/index.html", cont)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)


    def post(self, request, *args,**kwargs):
        import json
        try:

            history = SalesReport().objects.latest()


            cont = {"image": history, }

            return render(request, "React_tables/index.html", cont)
            request_data = json.loads(request.data.get('data'))
            user_data = request_data.pop("body")
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)


class schedule_mis_mails(APIView):
    def post(self, request, *args,**kwargs):
        import json
        try:
            print(request.data)
            request_data = json.loads(request.data.get('data'))
            main_data = request_data.pop("body")


            sch_email = ScheduleMail()
            sch_email.schedule_by = SiteUser.objects.get(id=1)
            sch_email.company_id = Company.objects.get(id=int(main_data['selected_company']))
            sch_email.mis_name = main_data['selected_mis']
            sch_email.days = main_data['days_array']
            sch_email.is_daily = True if 'daily' in main_data['days_array'] else False
            sch_email.from_email = main_data['selected_email_id']
            sch_email.save()
            response_list = []
            response_list.append({'Success': 'Done', })
            return Response(response_list, status=200)
        except Exception as e:
            print("Exception:"+str(e))
            traceback.print_exc()
            response_list = []
            if 'Duplicate entry' in str(e):
                return Response({'Error': 'Already Scheduled',}, status=500)
            response_list.append({'Error': 'Something Went Wrong error:'+str(e), })
            return Response(response_list, status=500)

    def get(self, request, *args,**kwargs):
        try:
            all_schedules = ScheduleMail.objects.all().values('company_id__company_email')

            for item in all_schedules:
                print(item['company_id__company_email'])

            history = ScheduleMail.objects.all().values('company_id__company_name','days','from_email','id','is_daily','mis_name','schedule_by_id',)


            return Response(list(history), status=200)

        except Exception as e:
            print("Exception:"+str(e))
            response_list = []
            response_list.append({'Error': 'Something Went Wrong', })
            return Response(response_list, status=404)

class TrialBalanceList(ListAPIView):
    queryset = TrialBalance.objects.all()
    serializer_class = TrialBalanceSerializer


class TrialBalanceMappingList(ListAPIView):
    queryset = TrialBalanceMapping.objects.all()
    serializer_class = TrialBalanceMappingSerializer

class TrialBalanceMappingView(APIView):
    def get_object(self, pk):
        try:
            return TrialBalanceMapping.objects.get(pk=pk)
        except TrialBalanceMapping.DoesNotExist:
            raise Http404

    def get(self, request, tbm_id):
        trial_bal_mapping_obj = self.get_object(tbm_id)
        serializer = TrialBalanceMappingSerializer(trial_bal_mapping_obj)
        return Response(serializer.data)

    def post(self, request, tbm_id=None):
        data = request.data
        trial_balance = TrialBalance.objects.get(id=data['trial_balance'])
        parent_group = ParentGroup.objects.get(id=data['parent_group'])
        groups = Group.objects.filter(pk__in=data['groups'])
        trial_bal_mapping_obj = TrialBalanceMapping.objects.create(
            trial_balance=trial_balance,
            parent_group=parent_group,
        )
        trial_bal_mapping_obj.groups.set(groups)
        trial_bal_mapping_obj.save()
        serializer = TrialBalanceMappingSerializer(trial_bal_mapping_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, tbm_id):
        data = request.data
        trial_bal_mapping_obj = TrialBalanceMapping.objects.get(id=tbm_id)

        if 'custom_parent_group' in data:
            custom_parent_group = ParentGroup.objects.get(id=data['custom_parent_group'])
            trial_bal_mapping_obj.custom_parent_group = custom_parent_group

        if 'custom_group' in data:
            custom_group = Group.objects.get(id=data['custom_group'])
            trial_bal_mapping_obj.custom_group = custom_group

        trial_bal_mapping_obj.save()
        serializer = TrialBalanceMappingSerializer(trial_bal_mapping_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, tbm_id):
        trial_bal_mapping_obj = self.get_object(tbm_id)
        trial_bal_mapping_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TrialBalanceMappingData(APIView):
    def get(self, request):
        trial_balance_serializer = TrialBalanceSerializer(TrialBalance.objects.all(), many=True)
        parent_group_serializer = ParentGroupSerializer(ParentGroup.objects.all(),  many=True)
        groups_serializer = GroupSerializer(Group.objects.all(), many=True)

        context = {
            'trial_balance' : trial_balance_serializer.data,
            'parent_group' : parent_group_serializer.data,
            'groups' : groups_serializer.data
        }
        return Response(context)

class ParentGroupList(ListAPIView):
    queryset = ParentGroup.objects.all()
    serializer_class = ParentGroupSerializer

class ParentGroupView(APIView):
    def get_object(self, pk):
        try:
            return ParentGroup.objects.get(pk=pk)
        except ParentGroup.DoesNotExist:
            raise Http404

    def get(self, request, pg_id):
        parent_group_obj = self.get_object(pg_id)
        serializer = ParentGroupSerializer(parent_group_obj)
        return Response(serializer.data)

    def post(self, request, pg_id=None):
        serializer = ParentGroupSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_201_CREATED)

    def put(self, request, pg_id):
        parent_group = self.get_object(pg_id)
        serializer = ParentGroupSerializer(parent_group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_201_CREATED)


    def delete(self, request, pg_id):
        parent_group_obj = self.get_object(pg_id)
        parent_group_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class GroupList(ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class GroupView(APIView):
    def get_object(self, pk):
        try:
            return Group.objects.get(pk=pk)
        except Group.DoesNotExist:
            raise Http404

    def get(self, request, group_id):
        group_obj = self.get_object(group_id)
        serializer = GroupSerializer(group_obj)
        return Response(serializer.data)

    def post(self, request, group_id=None):
        group = Group.objects.create(name=request.data["name"])       
        if 'primary' in request.data:
            primary = ParentGroup.objects.get(id=request.data["primary"])
            group.primary = primary
        
        group.save()
        serializer = GroupSerializer(group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, group_id):
        group = self.get_object(group_id)
        if 'primary' in request.data:
            print(request.data["primary"])
            primary = ParentGroup.objects.get(id=request.data["primary"])
            group.primary = primary
    
        if 'name' in request.data:
            name = request.data['name']
            group.name = name
        
        group.save()
        serializer = GroupSerializer(group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def delete(self, request, group_id):
        group_obj = self.get_object(group_id)
        group_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class Companymapping(APIView):

    def get(self, request):
        try:
            response_list=[]
            companies=Company.objects.all().values('id','company_name')
            print(companies)


            context = {
                    'obj_list': list(companies),                

                }

            response_list.append(context)
            print(response_list)

            return Response(response_list, status=200)
        except Exception as E:
            print(E)


class BalanceSheetView(ListAPIView):
    queryset = BalanceSheet.objects.all()
    serializer_class = BalanceSheetSerializer
    
class BSItemView(ListAPIView):
    queryset = BSItem.objects.all()
    serializer_class = BSItemSerializer


class LedgersList(APIView):
    def get(self, request):    
        queryset = Ledgers.objects.all()[:100]
        data = [serialize_ledger(ledger) for ledger in queryset]
        return Response(data)

class LedgersView(APIView):
    def get_object(self, pk):
        try:
            return Ledgers.objects.get(pk=pk)
        except Ledgers.DoesNotExist:
            raise Http404

    def get(self, request, ledgers_id):
        ledgers_obj = self.get_object(ledgers_id)
        # serializer = LedgerSerializer(ledgers_obj)
        return Response(serialize_ledger(ledgers_obj))

    def put(self, request, ledgers_id):
        data = request.data
        print(data)
        ledgers_obj = self.get_object(ledgers_id)
 
        if ("custom_parent_group" in data):
            under_custom = CustomGroup.objects.get(id=data["custom_parent_group"])
            ledgers_obj.under_custom = under_custom
            ledgers_obj.save()

        # Sub Groups 
        if ("custom_groups" in data):
            under_custom = ledgers_obj.under_custom
            for cg_id in data['custom_groups']:
                group = CustomGroup.objects.get(id=cg_id)
                group.under = under_custom
                group.save()
        # serializer = LedgerSerializer(ledgers_obj)
        return Response(serialize_ledger(ledgers_obj), status=status.HTTP_201_CREATED)

    def delete(self, request, ledgers_obj):
        ledgers_obj = self.get_object(ledgers_obj)
        ledgers_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class QueryDataView(APIView):
    def get(self, request, script_master_id):
        script_master_id = int(script_master_id)
        company_list = list(set(request.GET.getlist('company')))
        from_date = request.GET.get("from")
        to_date = request.GET.get("to")
        context = {
            "company_list" : company_list,
            "script_master_id" : script_master_id,
            "from_date" : from_date,
            "to_date" : to_date
        }
        if (script_master_id in  [4, 12, 21,41] ): # vouchers
            queryset = get_vouchers_queryset(**context)
            print(queryset)
            for item in queryset:
                print(item.id)
            serializer = VoucherItemSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else: # ledgers
            queryset = get_ledgers_queryset(**context)
            data = [serialize_ledger_for_queries(ledger) for ledger in queryset]
            return Response(data, status=status.HTTP_201_CREATED)

class ExportDataView(View):
    def get(self, request, script_master_id):
        script_master_id = int(script_master_id)
        company_list = list(set(request.GET.getlist('company')))
        from_date = request.GET.get("from")
        to_date = request.GET.get("to")
        today = datetime.date.today()
        context = {
            "company_list" : company_list,
            "script_master_id" : script_master_id,
            "from_date" : from_date,
            "to_date" : to_date
        }
        if (script_master_id in [4, 12, 21]):
            queryset = get_vouchers_queryset(**context)
        else:
            queryset = get_ledgers_queryset(**context)
        return render_to_csv_response(queryset, filename=f"{script_master_id}-{today}.csv")


class EmailDataView(APIView):
    def get(self, request, script_master_id):
        script_master_id = int(script_master_id)
        company_list = list(set(request.GET.getlist('company')))
        from_date = request.GET.get("from")
        to_date = request.GET.get("to")
        context = {
            'company_list': company_list,
            "script_master_id": script_master_id,
            "from_date" : from_date,
            "to_date" : to_date,
            "email": request.user.email
        }
        ledgers_data_email.apply_async(args=[], kwargs=context)
        return Response({"message": "Ledgers date emailed successfully"})

def testing_views(request):
    key = 41
    company_list = Company.objects.values_list('id', flat=True)
    context = {
        'company_list': company_list,
        "script_master_id": key,
        "from_date": "2021-04-01",
        "to_date": todays_date,
        "email": "vikas.pandey9323@gmail.com"
    }

    if (key == 4 or key == 12 or key == 41):
        queryset = get_vouchers_queryset(**context)
    else:
        queryset = get_ledgers_queryset(**context)

    for obj in queryset:
        print("obj")
        print(obj)
    context = {"queryset":queryset,"data":"Query Name","last_sync":todays_date}
    return render(request,"React_tables/testing_html.html",context)