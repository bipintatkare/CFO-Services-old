from django.contrib.auth import authenticate, login
from django.db.models import Sum
from django.views.decorators.csrf import csrf_exempt
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import VoucherItemSerializer, CompanyListSerializer, VoucherListSerializer
from import_app.models import Vouchers, Company,CompanyPerson
from user.models import SiteUser, UserType
from django.shortcuts import render, redirect
from rest_framework.generics import ListAPIView
from django.utils.decorators import method_decorator
#for dashboard - purchase and sales list
from import_app.models import CrucialNumbersBank, Ledgers, CrucialNumbers, VoucherItem
from datetime import datetime
from django.db.models import Q 

current_user = {}
# ~Q(ledger_name_temp__contains="Cash"),

class VoucherList(APIView):
    # serializer_class = VoucherListSerializer
    def get(self, request, comp_id, bank_name, fromDate, toDate):
        try:
            
            fromDate = datetime.strptime(fromDate.strip(), "%Y-%m-%d").date()
            toDate = datetime.strptime(toDate.strip(), "%Y-%m-%d").date()
            voucher_item =Vouchers.objects.filter(voucher_date__range=[fromDate,toDate],
                id__in=VoucherItem.objects.filter( voucher_id__company_id__id=comp_id, ledger_name_temp=bank_name).values_list('voucher_id_id',flat=True)).values()
            
            serializer = VoucherListSerializer(voucher_item, many=True) 
            print(serializer.data)
            return Response({"voucher_list":serializer.data}, status=200)
        except Exception as e:
            print('Exception: '+ str(e))
            pass


class BankList(APIView):

    def get(self, request, comp_id, bank_type):
        
        if bank_type == 'Bank':
            bank_list = list(CrucialNumbersBank.objects.filter(~Q(bank_name__icontains='Cash'), company_id__id=comp_id).values("bank_name","dr_amt"))
        else :
            bank_list = list(CrucialNumbersBank.objects.filter(Q(bank_name__icontains='Cash'), company_id__id=comp_id).values("bank_name","dr_amt"))

        return Response({"bank_list": bank_list}, status=200)
    # serializer_class = VoucherListSerializer

class CompanyList(ListAPIView):
    current_user = {}
    serializer_class = CompanyListSerializer
    def get_queryset(self):
        current_user = self.request.user
        if current_user.user_type == UserType.ADMIN:
            return Company.objects.all()
        elif str(current_user.user_type) != str(UserType.ADMIN):
            return Company.objects.filter(
                id__in=CompanyPerson.objects.filter(person__id=SiteUser.objects.get(id=current_user.id).id).values_list(
                    'company__id', flat=True))

class LedgersList(APIView):

    def get(self, request,comp_id):
        bank_list = Ledgers.objects.filter(company_id__id=comp_id).values("name","closing_balance")
        return Response({"bank_list": bank_list}, status=200)

class SalesDetails(APIView):

    def get(self, request,comp_id):
        bank_list = CrucialNumbers.objects.filter(company_id__id=comp_id,yearly_cumulative__gte=1.0).order_by('-id')[0]
        print("bank_list")
        print(Ledgers.objects.filter(company_id__id=comp_id,parent_str="Sundry Creditors").aggregate(Sum('closing_balance')))
        results = []
        results.append({"Sales":VoucherItem.objects.filter(voucher_id__type_name="Receipt",type="CR").order_by('-id')[0].amt})
        results.append({"Sales":bank_list.yearly_cumulative})
        results.append({"Sales":bank_list.monthly_cumulative})
        results.append({"Sales":bank_list.todays_sale})
        results.append({"Sales":str(Ledgers.objects.filter(company_id__id=comp_id,parent_str="Sundry Creditors").aggregate(Sum('closing_balance'))['closing_balance__sum'])})
        #currently nil in credit notes
        # results.append({"Sales":VoucherItem.objects.filter(voucher_id__voucher_type_internal="credit_note",type="CR").order_by('-id')[0].amt})     
        return Response({"bank_list": results}, status=200)

class PurchaseDetails(APIView):

    def get(self, request,comp_id):
        bank_list = CrucialNumbers.objects.filter(company_id__id=comp_id,yearly_cumulative__gte=1.0).order_by('-id')[0]
        print("bank_list")
        print(Ledgers.objects.filter(company_id__id=comp_id,parent_str="Sundry Creditors").aggregate(Sum('closing_balance')))
        results = []
        results.append({"Sales":VoucherItem.objects.filter(voucher_id__type_name="Payment",type="CR").order_by('-id')[0].amt})
        
        results.append({"Sales":"0.0"})
        #currently nil in debit notes
        # results.append({"Sales":VoucherItem.objects.filter(voucher_id__voucher_type_internal="debit_note",type="CR").order_by('-id')[0].amt})
        results.append({"Sales":str(Ledgers.objects.filter(company_id__id=comp_id,parent_str="Sundry Debtors").aggregate(Sum('closing_balance'))['closing_balance__sum'])})
        return Response({"bank_list": results}, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    return_url = None

    def get(self, request):

        return Response({"Error": "Invalid Credentials"}, status=500)


    def post(self, request):
        Details = request.data
        email = Details['UserEmail']
        password = Details['UserPassword']

        print(request.POST)
       
        try:
            user = SiteUser.objects.get(email=email)
            # active=User.objects.get(active=active)
            print(user.is_active)
            if user.is_active == True:
                user = authenticate(request, email=email, password=password)
                print(user)
                if user is not None:
                    login(request, user)
                    company_list = CompanyPerson.objects.filter(person__id=user.id).values_list("company",flat=True)
                    print("company_list")
                    print(company_list)

                    company_list=Company.objects.filter(id__in=company_list).values("company_name","id")
                    print(list(company_list))
                    return Response({"Success":"Logged In","email":email,"password":password,"id":user.id,"company_list":list(company_list)}, status=200)
                else:
                    return Response({"Error":"Invalid Credentials"}, status=500)
            else:
                return Response({"Error":"Account Blocked Contact Admin"}, status=500)
        except:
            return Response({"Error":"Invalid Credentials"}, status=500)
