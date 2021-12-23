import os
from django.http import HttpResponse, Http404
from builtins import float

from django.shortcuts import render
from rest_framework.generics import ListAPIView

from user.models import SiteUser, PartnerUser, UserType
from user.serializers import SiteUserListSerializer
from django.db.models import Sum, Count, Q
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from placc.models import PLACC,Mapping_Company_tally_notes, Company,NOTES,REPORTS, Mapping_Company_notes_report,Tally_mapping,AgeingReport, Budget
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password, check_password
from user.tasks import forget_password
from django.conf import settings

@ensure_csrf_cookie
def home(request):
    return render(request,"index.html",)




class UsersList(ListAPIView):
    queryset = SiteUser.objects.all()
    serializer_class = SiteUserListSerializer

class UsersByUser(APIView):
    def get(self, request, user_id):
        queryset = SiteUser.objects.filter(under__id=user_id)
        serializer = SiteUserListSerializer(queryset, many=True)
        return Response(serializer.data)

class SiteUserView(APIView):
    def get_object(self, pk):
        try:
            return SiteUser.objects.get(pk=pk)
        except SiteUser.DoesNotExist:
            raise Http404

    def get(self, request, user_id):
        user = self.get_object(user_id)
        serializer = SiteUserListSerializer(user)
        return Response(serializer.data)

    def post(self, request, user_id):
        print(request.data)
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        email = request.data['email']
        mobile = request.data['contact_no']
        dob = request.data['d_o_b']
        
        try:
            user = SiteUser.objects.create(
                first_name=first_name,
                last_name=last_name,
                email=email,
                mobile=mobile,
                user_type= UserType.MANAGER,
                dob=dob,
                is_staff=True,
                is_admin=True
            )
            serializer = SiteUserListSerializer(user)
            return Response(serializer.data)
        except IntegrityError as e:
            return Response({"message": "User already exists!"}, status=status.HTTP_409_CONFLICT)
    
    def delete(self, request, user_id):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        data = request.data
       
        try:
            user = SiteUser.objects.get(email=username)
            if user.is_active == True:
                user = authenticate(request, email=username, password=password)
                print(user)
                if user is not None:
                    login(request, user)
                    user_ser = SiteUserListSerializer(user)
                    context = {'message': 'Login Successful!!', 'user': user_ser.data }
                    return Response(data=context, status=status.HTTP_200_OK)
                else:
                    return Response({'error': "Invalid Credentials!!!"}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({'error':"Your account has been blocked, Please contact admin!!!"}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({'error': "Invalid Credentials!!!"}, status=status.HTTP_401_UNAUTHORIZED)


class SignupView(APIView):
    def post(self, request):
        
        name = request.data['name']
        first_name, last_name = name, ""
        email = request.data['email']
        password = request.data['password']
        hashedpassword = make_password(password=password)
        
        if ' ' in name:
            first_name, last_name = name.split(" ")
        
        if SiteUser.objects.filter(email=email).exists():
            return Response(status=status.HTTP_409_CONFLICT)
        else:
            user = PartnerUser.objects.create_superuser(
                first_name=first_name, last_name=last_name, email=email, password=password)          
            user.save()
            user_ser = SiteUserListSerializer(user)
            return Response({'message': 'Sign-Up Successful!!', 'user': user_ser.data }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    def get(self, request):
        logout(request)
        return Response({'message': 'Sign-Out Successful!!'}, status=status.HTTP_200_OK)


class ProfileView(APIView):
    def get(self, request):
        try:
            user = SiteUser.objects.get(id=request.user.id)
            user_ser = SiteUserListSerializer(user)
            return Response(user_ser.data, status=status.HTTP_200_OK)
        except SiteUser.DoesNotExist:
            return Response({"error": "User not found!"}, status=status.HTTP_200_OK)

    def post(self, request):
        name = request.POST.get('name')
        profile_name = request.POST.get('profile_name')
        mobile = request.POST.get('mobile')
        email = request.POST.get('email')
        current_user = request.user
        try:
            user = SiteUser.objects.filter(
                mobile=current_user.mobile, email=current_user.email).first()
            user_ser = SiteUserListSerializer(user)
            return Response(user_ser.data, status=status.HTTP_200_OK)

        except SiteUser.DoesNotExist:
            return Response({"error": "User not found!"}, status=status.HTTP_200_OK)


class PasswordResetView(APIView):
    def get(self, request, param):
        try:
            email = param
            user = SiteUser.objects.get(email=email)
            serializer = SiteUserListSerializer(user)
            forget_password.delay(**serializer.data)
            return Response({"message" : "Password reset link sent to your email {0}".format(email)}, status=status.HTTP_200_OK)
        except SiteUser.DoesNotExist:
            return Response({"error": "User not found!"}, status=status.HTTP_200_OK)


    def post(self, request, param=None):
        user_id = param
        raw_password = request.data['password']
        try:
            print(raw_password)
            user = SiteUser.objects.get(id=user_id)
            user.set_password(raw_password)
            user.save()            
            return Response({"message": "Password reset successfully!"}, status=status.HTTP_200_OK)
        except SiteUser.DoesNotExist:
            return Response({"error": "User not found!"}, status=status.HTTP_200_OK)


def download(request):
    APPLICATION_FILE = 'CFOSetupv5.exe'
    file_path = os.path.join(settings.MEDIA_ROOT, APPLICATION_FILE)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/vnd.microsoft.portable-executable")
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    raise Http404


def mis(request):
    return render(request,"mis.html",)

# def login(request):
#     return render(request,"login.html",)

def register(request):
    return render(request,"register.html",)


def darftp(request):
    ageing = AgeingReport.objects.all()
    context={
        'ageing':ageing,
    }
    return render(request,"tables/DARFTP.html",context)

def darftp_test(request):
    ageing2 = AgeingReport.objects.all()
    ageing = AgeingReport.objects.values('customer_name').annotate(data_sum=Sum('amount'))
    print(ageing)
    print("ageing")
    print("ageing")
    for item in ageing:
        print(item['customer_name'])
        print(item['data_sum'])
        item['cust_list'] = AgeingReport.objects.filter(customer_name=item['customer_name'])

    context={
        'ageing':ageing,
        'ageing2':ageing2,
    }
    return render(request,"tables/DARFTP_test.html",context)


def fdfbo(request):
    sales_actual_till_date = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(tally_mapping_primary='Sales Accounts')).aggregate(Sum('final'))

    direct_exp = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(tally_mapping_primary='Direct Expenses')).aggregate(Sum('final'))
    indirect_exp = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(tally_mapping_primary='Indirect Expenses')).aggregate(Sum('final'))
    purchase = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(tally_mapping_primary='Purchase Accounts')).aggregate(Sum('final'))
    direct_income = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(tally_mapping_primary='Direct Incomes')).aggregate(Sum('final'))

    indirect_income = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(tally_mapping_primary='Indirect Incomes')).aggregate(Sum('final'))
    print("sales_actual_till_date['final__sum']")
    print(sales_actual_till_date['final__sum'])
    print(direct_income['final__sum'])
    print(direct_exp['final__sum'])
    if direct_income['final__sum']!=None:
        gross_margin = sales_actual_till_date['final__sum']+direct_income['final__sum']-direct_exp['final__sum']
    else:
        gross_margin = sales_actual_till_date['final__sum']-direct_exp['final__sum']

    net_profit = gross_margin-indirect_exp['final__sum']+indirect_income['final__sum']

    SundryDebtors = PLACC.objects.filter(tally_mapping_primary='Sundry Debtors').aggregate(Sum('final'))
    sales_no_days = (sales_actual_till_date['final__sum']/30)*365
    no_of_days = round((SundryDebtors['final__sum']/sales_actual_till_date['final__sum'])*365, 2)

    SundryCreditors = PLACC.objects.filter(tally_mapping_primary='Sundry Creditors').aggregate(Sum('final'))

    Inventories = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(description='Opening Stock')).aggregate(Sum('final'))
    salary = PLACC.objects.filter(tally_mapping_parent='SALARY').aggregate(Sum('final'))
    INTEREST = PLACC.objects.filter(description='INTEREST ON TDS').aggregate(Sum('final'))
    major_expenses = PLACC.objects.filter(~Q(final=None),~Q(final=0.0000),Q(tally_mapping_primary='Indirect Expenses')|Q(tally_mapping_primary='Direct Expenses')).order_by('-final').reverse()[0:4]
    budget = Budget.objects.get(id=1)

    context={
        'sales_actual_till_date':sales_actual_till_date['final__sum'],
        'gross_margin':gross_margin,
        'net_profit':net_profit,
        'SundryDebtors':SundryDebtors['final__sum'],
        'no_of_days':no_of_days,
        'SundryCreditors':SundryCreditors['final__sum'],
        'Inventories':Inventories['final__sum'],
        'salary':salary['final__sum'],
        'INTEREST':INTEREST['final__sum'],
        'major_expenses':major_expenses,
        'budget':budget,
    }
    return render(request,"tables/FDFBO.html",context)


def ffsftp(request):
    bank_acc = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), Q(tally_mapping_primary='Bank Accounts')).aggregate(
        Sum('final'))
    cash_in_hand = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0),
                                        Q(tally_mapping_primary='Cash-in-hand')).aggregate(Sum('final'))
    opening_stock = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(description='Opening Stock')).aggregate(Sum('final'))
    receivables = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(description__icontains='Receivable')).aggregate(Sum('final'))
    trade_payables = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(description__icontains='payable'),~Q(tally_mapping_primary='Duties & Taxes'),~Q(tally_mapping_primary='Current Liabilities')).aggregate(Sum('final'))
    other_assets = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(tally_mapping_primary__icontains='Asset')).aggregate(Sum('final'))
    loan_advance = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), Q(tally_mapping_primary='Loans & Advances (Asset)')).aggregate(
        Sum('final'))
    deposits = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), Q(tally_mapping_primary='Deposits (Asset)')).aggregate(
        Sum('final'))
    current_liabilities = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), Q(tally_mapping_primary='Current Liabilities')).aggregate(
        Sum('final'))
    duties_taxes = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), Q(tally_mapping_primary='Duties & Taxes')).aggregate(
        Sum('final'))
    #header==================================================
    loans_header = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0),
                                        Q(tally_mapping_primary__icontains='Loans')).aggregate(
        Sum('final'))

    sales_actual_till_date = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0),
                                                  Q(tally_mapping_primary='Sales Accounts')).aggregate(Sum('final'))

    direct_exp = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0),
                                      Q(tally_mapping_primary='Direct Expenses')).aggregate(Sum('final'))
    indirect_exp = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0),
                                        Q(tally_mapping_primary='Indirect Expenses')).aggregate(Sum('final'))
    direct_income = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0),
                                         Q(tally_mapping_primary='Direct Incomes')).aggregate(Sum('final'))

    indirect_income = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0),
                                           Q(tally_mapping_primary='Indirect Incomes')).aggregate(Sum('final'))

    if direct_income['final__sum'] != None:
        gross_margin = sales_actual_till_date['final__sum'] + direct_income['final__sum'] - direct_exp['final__sum']
    else:
        gross_margin = sales_actual_till_date['final__sum'] - direct_exp['final__sum']

    net_profit_header = gross_margin - indirect_exp['final__sum'] + indirect_income['final__sum']

    capital_acc_header  = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), Q(tally_mapping_primary='Capital Account')).aggregate(
        Sum('final'))

    fixed_asset_header  = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), Q(tally_mapping_primary='Fixed Assets')).aggregate(
        Sum('final'))
    total_assets = opening_stock['final__sum']+bank_acc['final__sum'] + cash_in_hand['final__sum']+receivables['final__sum']+loan_advance['final__sum']+deposits['final__sum']+other_assets['final__sum']
    total_liabilities = current_liabilities['final__sum']+trade_payables['final__sum']+duties_taxes['final__sum']
    context={
        'opening_stock': opening_stock['final__sum'],
        'trade_payables': trade_payables['final__sum'],
        'other_assets': other_assets['final__sum'],
        'receivables': receivables['final__sum'],
        'duties_taxes': duties_taxes['final__sum'],
        'current_liabilities': current_liabilities['final__sum'],
        'deposits': deposits['final__sum'],
        'loan_advance': loan_advance['final__sum'],
        'bank_acc': bank_acc['final__sum'] + cash_in_hand['final__sum'],
        #headers
        'loans_header': loans_header['final__sum'],
        'net_profit_header': net_profit_header,
        'capital_acc_header': capital_acc_header['final__sum'],
        'fixed_asset_header': fixed_asset_header['final__sum'],
        #totals
        'total_assets':total_assets,
        'total_liabilities': total_liabilities,
        'diff_in_assets' : total_assets-total_liabilities,

    }
    return render(request,"tables/FFSFTP.html",context)


def lbob(request):
    opening_stock = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(description='Opening Stock')).aggregate(Sum('final'))
    sundry_debtors = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(tally_mapping_primary='Sundry Debtors')).aggregate(Sum('final'))
    bank_acc = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(tally_mapping_primary='Bank Accounts')).aggregate(Sum('final'))
    cash_in_hand = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(tally_mapping_primary='Cash-in-hand')).aggregate(Sum('final'))
    expense_payable = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),Q(description='Expenses Payable')).aggregate(Sum('final'))


    SundryCreditors = PLACC.objects.filter(tally_mapping_primary='Sundry Creditors').aggregate(Sum('final'))

    taxes = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),(Q(description='APMC Tax')|Q(description='Deferred Tax')|Q(description='Deffred Tax Expenses')|Q(description='Income Tax Expenses')|Q(description='PROPERTY TAXES')|Q(description='VAT LIABILITY A/C'))).aggregate(Sum('final'))
    context={
        'opening_stock':opening_stock['final__sum'],
        'sundry_debtors':sundry_debtors['final__sum'],
        'bank_acc':bank_acc['final__sum']+cash_in_hand['final__sum'],
        'a_value':opening_stock['final__sum']+sundry_debtors['final__sum']+bank_acc['final__sum']+cash_in_hand['final__sum'],
        'b_value':SundryCreditors['final__sum']+taxes['final__sum'],
        'a_b_value':(opening_stock['final__sum']+sundry_debtors['final__sum']+bank_acc['final__sum']+cash_in_hand['final__sum'])-(SundryCreditors['final__sum']+taxes['final__sum']),
        'SundryCreditors':SundryCreditors['final__sum'],
        'taxes':taxes['final__sum'],

    }

    return render(request,"tables/LBOF.html",context)


def pcftp(request):
    return render(request,"tables/PCFTP.html",)


def plaws(request):
    return render(request,"tables/plaws.html",)

# def notemapping(request):
#     form = mappingcompForm()
#     context = {
#         'form':form,
#     }
#     return render(request,"notemapping.html",context)

def mapping(request):


    return render(request,"mapping.html",)

def notemapping(request):
    tally_rec_mapping = PLACC.objects.order_by().values_list('tally_mapping_primary',flat=True).distinct()
    notes_list=NOTES.objects.all().values_list('name',flat=True)
    tally_notes_list=[]
    for item in tally_rec_mapping:
        if item not in notes_list and item != None:
            tally_notes_list.append(NOTES(
                name=str(item),

            ))
        # print("item")
        print(item)
    if tally_notes_list != None:
        NOTES.objects.bulk_create(tally_notes_list)



    tally_rec_mapping = PLACC.objects.order_by().values_list('tally_mapping_parent', flat=True).distinct()
    notes_list = REPORTS.objects.all().values_list('name', flat=True)
    tally_report_list2 = []
    for item in tally_rec_mapping:
        if item not in notes_list and item != None:
            print(item)
            tally_report_list2.append(REPORTS(
                name=str(item),

            ))
        # print("item")

    if tally_report_list2 != None:
        REPORTS.objects.bulk_create(tally_report_list2)
    # default_mapping_list = Tally_mapping.objects.all().values_list('name')
    print("tally_rec_mapping")
    print("tally_rec_mapping")
    print("tally_rec_mapping")
    # print(tally_rec_mapping)

    notes_list=NOTES.objects.all()
    reports_list=REPORTS.objects.all()
    tally_mapping_list=Tally_mapping.objects.all()

    if request.method == 'POST' and 'note_value' in request.POST:
        name=request.POST.get('note_value')
        note=NOTES()
        note.name=name
        note.save()
        notes_list = NOTES.objects.all()
        reports_list = REPORTS.objects.all()
        tally_mapping_list = Tally_mapping.objects.all()
        context = {
            'notes_list': notes_list,
            'reports_list': reports_list,
            'tally_mapping_list': tally_mapping_list,
        }
        return render(request, "notemapping.html", context)

    if request.method == 'POST' and 'report_value' in request.POST:
        name = request.POST.get('report_value')
        report = REPORTS()
        report.name = name
        report.save()
        notes_list = NOTES.objects.all()
        reports_list = REPORTS.objects.all()
        tally_mapping_list = Tally_mapping.objects.all()
        context = {
            'notes_list': notes_list,
            'reports_list': reports_list,
            'tally_mapping_list': tally_mapping_list,
        }
        return render(request, "notemapping.html", context)

    if request.method == 'POST' and 'tally_value' in request.POST:
        name = request.POST.get('tally_value')
        report = Tally_mapping()
        report.name = name
        try:
            report.save()
        except:
            pass

        notes_list = NOTES.objects.all()
        reports_list = REPORTS.objects.all()
        tally_mapping_list = Tally_mapping.objects.all()
        context = {
            'notes_list': notes_list,
            'reports_list': reports_list,
            'tally_mapping_list': tally_mapping_list,
        }
        return render(request, "notemapping.html", context)

    context={
        'notes_list':notes_list,
        'reports_list':reports_list,
        'tally_mapping_list':tally_mapping_list,
    }


    return render(request,"notemapping.html",context)

def mappingcomp(request):
    tally_rec_mapping= PLACC.objects.all().values_list('tally_mapping_primary')
    default_mapping_list = Tally_mapping.objects.all().values_list('name')  #PLACC.objects.all().values_list('tally_mapping')
    default_mapping_final_list = []
    objects = []
    company_name_fk = Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED')
    company_name_pk = Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED').pk
    print(default_mapping_list)
    for data in tally_rec_mapping:
        if data not in default_mapping_list:
            # default_mapping_final_list.append(data)
            objects.append(Tally_mapping(
                name=str(data)[2:-3],

            ))

            # objects.append(Mapping_Company_tally_notes(
            #     Company_Name=company_name_fk,
            #     Tally_Mapping=str(data)[2:-3],
            #     Notes_Mapping=None,
            # ))

    count=Tally_mapping.objects.all().count()

    if count<40:
        try:

            Tally_mapping.objects.bulk_create(objects)
        except:
            pass

    map_list_report=Mapping_Company_notes_report.objects.all()

    notes_list = NOTES.objects.all()
    reports_list = REPORTS.objects.all()
    map_list=Mapping_Company_tally_notes.objects.all()
    default_mapping_list = Tally_mapping.objects.all()
    if request.method == 'POST' and 'tally_mapping' in request.POST:
        tally = request.POST.get('tally_mapping')
        note = request.POST.get('note_mapping')

        if Mapping_Company_tally_notes.objects.filter(Q(Tally_Mapping=Tally_mapping.objects.get(name=tally))).count() > 0:
            item=Mapping_Company_tally_notes.objects.get(Tally_Mapping=Tally_mapping.objects.get(name=tally))
            # item.Company_Name=Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED')
            # item.Tally_Mapping=tally
            item.Notes_Mapping=NOTES.objects.get(name=note)
            item.save(update_fields=['Notes_Mapping', ])
        else:
            item = Mapping_Company_tally_notes()
            item.Company_Name=Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED')
            item.Tally_Mapping=Tally_mapping.objects.get(name=tally)
            item.Notes_Mapping = NOTES.objects.get(name=note)
            item.save()

        map_list_report = Mapping_Company_notes_report.objects.all()

        notes_list = NOTES.objects.all()
        reports_list = REPORTS.objects.all()
        map_list = Mapping_Company_tally_notes.objects.all()
        default_mapping_list = Tally_mapping.objects.all()

        context = {
            'notes_list': notes_list,
            'reports_list': reports_list,
            'map_list': map_list,
            'map_list_report': map_list_report,
            'default_mapping_list': default_mapping_list,
        }

        return render(request, "mappingcomp.html", context)

    if request.method == 'POST' and 'report_mapping' in request.POST:
        report = request.POST.get('report_mapping')
        note = request.POST.get('note_mapping')
        if Mapping_Company_notes_report.objects.filter(Q(Notes_Mapping=NOTES.objects.get(name=note))).count() > 0:
            item = Mapping_Company_notes_report.objects.get(Notes_Mapping=NOTES.objects.get(name=note))
            # item.Company_Name = Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED')
            item.Report_Mapping = REPORTS.objects.get(name=report)
            # item.Notes_Mapping = NOTES.objects.get(name=note)
            item.save(update_fields=['Report_Mapping', ])
        else:
            item=Mapping_Company_notes_report()
            item.Company_Name=Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED')
            item.Report_Mapping=REPORTS.objects.get(name=report)
            item.Notes_Mapping=NOTES.objects.get(name=note)
            item.save()

        map_list_report = Mapping_Company_notes_report.objects.all()

        notes_list = NOTES.objects.all()
        reports_list = REPORTS.objects.all()
        map_list = Mapping_Company_tally_notes.objects.all()
        default_mapping_list = Tally_mapping.objects.all()
        context = {
            'notes_list': notes_list,
            'reports_list': reports_list,
            'map_list': map_list,
            'map_list_report': map_list_report,
            'default_mapping_list': default_mapping_list,
        }

        return render(request, "mappingcomp.html", context)


    context={
        'notes_list':notes_list,
        'reports_list':reports_list,
        'map_list':map_list,
        'map_list_report': map_list_report,
        'default_mapping_list': default_mapping_list,

    }

    return render(request,"mappingcomp.html",context)



def plandbl(request):
    list_notes = Mapping_Company_tally_notes.objects.all().values_list('Notes_Mapping')
    final_list = []
    for item in list_notes:
        if item not in final_list:
            final_list.append(item)

    list1 = []
    for item in final_list:
        value = list(Mapping_Company_tally_notes.objects.filter(Notes_Mapping=item))
        list1.append(value)
    print('list1')
    print(list1)
    list2 = []
    for item in list1:
        for i in item:
            list2.append(i)
    print('list555555555555')
    print(list2)
    for i in list2:
        # print("i.name")
        # print(i.Tally_Mapping)

        total = PLACC.objects.filter(tally_mapping_primary=i.Tally_Mapping).aggregate(Sum('final'))['final__sum']
        item = Mapping_Company_tally_notes.objects.get(Tally_Mapping=Tally_mapping.objects.get(name=i.Tally_Mapping))
        item.amt = total
        item.save(update_fields=['amt', ])

        total = Mapping_Company_tally_notes.objects.filter(Notes_Mapping=i.Notes_Mapping).aggregate(Sum('amt'))['amt__sum']

        item = Mapping_Company_notes_report.objects.get(Notes_Mapping=NOTES.objects.get(name=i.Notes_Mapping))
        print('total5555555555555')
        print('total5555555555555')
        print('total5555555555555')
        print(total)
        print(total)
        item.amt = total
        item.save(update_fields=['amt', ])

    # expense_list = Mapping_Company_tally_notes.objects.filter(Notes_Mapping=NOTES.objects.get(name='OTHER EXPENSES'))
    # total_Expense = Mapping_Company_tally_notes.objects.filter(Notes_Mapping=NOTES.objects.get(name='OTHER EXPENSES')).aggregate(Sum('amt'))['amt__sum']

    context = {
        'list1': list1,
        'rent': 0,
        # 'expense_list': expense_list,
        # 'total_Expense': total_Expense,

    }
    return render(request,"plandbl.html",context)


def plandbl_test_old(request):

    list_notes=Mapping_Company_tally_notes.objects.all().values_list('Notes_Mapping')
    final_list = []
    for item in list_notes:
        if item not in final_list:
            final_list.append(item)

    list1=[]
    for item in final_list:
        value=list(Mapping_Company_tally_notes.objects.filter(Notes_Mapping=item))
        list1.append(value)
    print('list1')
    print(list1)

    list2=[]
    for item in list1:
        for i in item:
            list2.append(i)

    amount = 0.0
    amount_list = []
    for item in list1:
        amount = 0.0
        for i in item:
            if i.amt != None and i.amt != '':
                amount=amount+i.amt

        amount_list.append(amount)
    print("printing amount_list")
    print(amount_list)
    # print('list555555555555')
    # print(list2)
    for i in list2:
        # print("i.name")
        # print(i.Tally_Mapping)


        total = PLACC.objects.filter(tally_mapping_primary=i.Tally_Mapping).aggregate(Sum('final'))['final__sum']
        item = Mapping_Company_tally_notes.objects.get(Tally_Mapping=Tally_mapping.objects.get(name=i.Tally_Mapping))
        item.amt = total
        item.save(update_fields=['amt', ])

        total = Mapping_Company_notes_report.objects.filter(Notes_Mapping=i.Notes_Mapping).aggregate(Sum('amt'))['amt__sum']
        item = Mapping_Company_notes_report.objects.get(Notes_Mapping=NOTES.objects.get(name=i.Notes_Mapping))
        item.amt = total
        item.save(update_fields=['amt', ])
    final_total=0.0
    total = 0.0
    for i in list1:
        for j in i:
            total += j.amt
            final_total = total
        total = 0.0




    # expense_list=Mapping_Company_tally_notes.objects.filter(Notes_Mapping=NOTES.objects.get(name='OTHER EXPENSES'))
    # total_Expense = Mapping_Company_tally_notes.objects.filter(Notes_Mapping=NOTES.objects.get(name='OTHER EXPENSES')).aggregate(Sum('amt'))['amt__sum']
    new_list=zip(list1,amount_list)
    context = {
        'list1': list1,
        'rent': 0,
        # 'expense_list':expense_list,
        # 'total_Expense':total_Expense,
        'amount_list':amount_list,
        'new_list':new_list,

    }
    return render(request,"pl_test.html",context)


def plandbl_test(request):
    #for reverting change all tally_mapping_primary to notes_mapping
    list_notes = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0)).values_list('tally_mapping_primary')
    final_list = []
    for item in list_notes:
        if item not in final_list:
            final_list.append(item)

    sum_list=[]
    for item in final_list:
        print(item[0])
        sum_list.append(PLACC.objects.filter(~Q(final=None), ~Q(final=0.0),tally_mapping_primary=item[0]))


    sum_data=PLACC.objects.filter(~Q(final=None), ~Q(final=0.0)).values('tally_mapping_primary').annotate(data_sum=Sum('final'))
    this_lis_date=[]
    this_lis_sum=[]
    for i in sum_data:
        x = i
        this_lis_date.append(x['tally_mapping_primary'])
        this_lis_sum.append(x['data_sum'])

    list_of_final =zip(this_lis_date,this_lis_sum)
    list_of_final_t =zip(this_lis_date,this_lis_sum,sum_list)
    print('list_of_final')
    print('list_of_final')
    print(list_of_final)
    context = {
        'sum_data': sum_data,
        'sum_list': sum_list,
        'list_of_final': list_of_final,
        'list_of_final_t': list_of_final_t,


    }
    return render(request,"pl_test.html",context)



def notes(request):
    travelling = PLACC.objects.filter(tally_mapping_primary='Travelling and coveyance').aggregate(Sum('final'))['final__sum']
    rent = PLACC.objects.filter(tally_mapping_primary='Rent').aggregate(Sum('final'))['final__sum']
    sc = PLACC.objects.filter(tally_mapping_primary='Share Capital').aggregate(Sum('final'))['final__sum']

    print(travelling)

    context = {
        # 'total': travelling+rent,
        'sc': sc,

    }
    return render(request,"notes.html",context)

def notes_test_old(request):
    list_reports = Mapping_Company_notes_report.objecdts.all().values_list('Report_Mapping')
    final_list = []
    for item in list_reports:
        if item not in final_list:
            final_list.append(item)

    print(list_reports)
    print(final_list)
    list1 = []
    for item in final_list:
        value = list(Mapping_Company_notes_report.objects.filter(Report_Mapping=item))
        list1.append(value)
    print('list1')
    print(list1)
    list2 = []
    for item in list1:
        for i in item:
            list2.append(i)
    print('list555555555555')
    print(list2)

    amount = 0.0
    amount_list = []
    for item in list1:
        amount = 0.0
        for i in item:
            amount = amount + i.amt
        amount_list.append(amount)
    print("printing amount_list")
    print(amount_list)

    # for i in list2:
    #     # print("i.name")
    #     # print(i.Tally_Mapping)
    #
    #     total = PLACC.objects.filter(tally_mapping=i.Tally_Mapping).aggregate(Sum('final'))['final__sum']
    #     #total = PLACC.objects.filter(tally_mapping=i.Tally_Mapping).aggregate(Sum('final'))['final__sum']
    #     item = Mapping_Company_tally_notes.objects.get(Tally_Mapping=Tally_mapping.objects.get(name=i.Tally_Mapping))
    #     #item = Mapping_Company_tally_notes.objects.get(Tally_Mapping=Tally_mapping.objects.get(name=i.Tally_Mapping))
    #     item.amt = total
    #     item.save(update_fields=['amt', ])

    # expense_list = Mapping_Company_tally_notes.objects.filter(Notes_Mapping=NOTES.objects.get(name='OTHER EXPENSES'))
    # total_Expense = Mapping_Company_tally_notes.objects.filter(Notes_Mapping=NOTES.objects.get(name='OTHER EXPENSES')).aggregate(
    #     Sum('amt'))['amt__sum']
    new_list = zip(list1, amount_list)
    context = {
        'list1': list1,
        'new_list': new_list,
        'rent': 0,
        # 'expense_list': expense_list,
        # 'total_Expense': total_Expense,

    }
    return render(request, "reports_test.html", context)







    # total_Rates = PLACC.objects.filter(tally_mapping='Rates and taxes').aggregate(Sum('final'))['final__sum']
    # total_travel = PLACC.objects.filter(tally_mapping='Travelling and coveyance').aggregate(Sum('final'))['final__sum']
    # total_Rent = PLACC.objects.filter(tally_mapping='Rent').aggregate(Sum('final'))['final__sum']
    # total_Communication = PLACC.objects.filter(tally_mapping='Communication costs').aggregate(Sum('final'))['final__sum']
    # total_Electricity = PLACC.objects.filter(tally_mapping='Electricity & water charges').aggregate(Sum('final'))['final__sum']
    #
    #
    #
    # item = Mapping_Company_tally_notes.objects.get(Tally_Mapping=Tally_mapping.objects.get(name='Travelling and conveyance'))
    # item.amt = total_travel
    # item.save(update_fields=['amt', ])
    #
    # item = Mapping_Company_tally_notes.objects.get(Tally_Mapping=Tally_mapping.objects.get(name='Electricity & water charges'))
    # item.amt = total_Electricity
    # item.save(update_fields=['amt', ])

def notes_test(request):
    all_list = []
    list_notes = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0)).values_list('tally_mapping_parent')
    final_list = []
    for item in list_notes:
        if item not in final_list:
            final_list.append(item)


    sum_list = []
    for item in final_list:
        print(item[0])
        sum_list.append(PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), tally_mapping_parent=item[0]))

    sum_data = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0)).values('tally_mapping_parent').annotate(data_sum=Sum('final'))
    this_lis_date = []
    this_lis_sum = []
    for i in sum_data:
        x = i
        this_lis_date.append(x['tally_mapping_parent'])
        this_lis_sum.append(x['data_sum'])



    sum_data = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0)).values('tally_mapping_primary').annotate(data_sum=Sum('final'))
    this_lis_date2 = []
    this_lis_sum2 = []
    for i in sum_data:
        x = i
        this_lis_date2.append(x['tally_mapping_primary'])
        this_lis_sum2.append(x['data_sum'])

    list_of_final = zip(this_lis_date, this_lis_sum,this_lis_date2, this_lis_sum2)
    list_of_final2 = zip(this_lis_date2, this_lis_sum2)

    final_zip = zip(list_of_final,list_of_final2)

    context = {
        'sum_data': sum_data,
        'sum_list': sum_list,
        'list_of_final': list_of_final,
        'list_of_final2': list_of_final2,
        'final_zip': final_zip,

    }
    return render(request, "reports_test.html", context)







    # total_Rates = PLACC.objects.filter(tally_mapping='Rates and taxes').aggregate(Sum('final'))['final__sum']
    # total_travel = PLACC.objects.filter(tally_mapping='Travelling and coveyance').aggregate(Sum('final'))['final__sum']
    # total_Rent = PLACC.objects.filter(tally_mapping='Rent').aggregate(Sum('final'))['final__sum']
    # total_Communication = PLACC.objects.filter(tally_mapping='Communication costs').aggregate(Sum('final'))['final__sum']
    # total_Electricity = PLACC.objects.filter(tally_mapping='Electricity & water charges').aggregate(Sum('final'))['final__sum']
    #
    #
    #
    # item = Mapping_Company_tally_notes.objects.get(Tally_Mapping=Tally_mapping.objects.get(name='Travelling and conveyance'))
    # item.amt = total_travel
    # item.save(update_fields=['amt', ])
    #
    # item = Mapping_Company_tally_notes.objects.get(Tally_Mapping=Tally_mapping.objects.get(name='Electricity & water charges'))
    # item.amt = total_Electricity
    # item.save(update_fields=['amt', ])







def test_mail(request):
    context =  {
        "id": 11,
        "meeting_thread": {
            "id": 4,
            "title": "CFO Services",
            "summary": "Test thread",
            "organizer": 1,
            "company": 19,
            "organizer_name": "Gaurav Dabhade",
            "company_name": "CFO SERVICES LLP",
            "created_at": "06/04/2021"
        },
        "perticular": [
            {
                "id": 6,
                "title": "Display first 5 meeting in  dashboard",
                "organizer": 2,
                "completion_date": "06/04/2021 00:00:00",
                "organizer_email": "gaurav@farintsol.com",
                "remark": "Pending",
                "is_completed": False,
                "organizer_name": "Raj R",
                "meeting": {
                    "title": "Demo Meeting",
                    "id": 11
                }
            },
            {
                "id": 5,
                "title": "Connect Partner/Manager/Employee",
                "organizer": 2,
                "completion_date": "06/04/2021 00:00:00",
                "organizer_email": "gaurav@farintsol.com",
                "remark": "Work in progress",
                "is_completed": False,
                "organizer_name": "Raj R",
                "meeting": {
                    "title": "Demo Meeting",
                    "id": 11
                }
            },
            {
                "id": 4,
                "title": "Fetch data in email templates, and add agenda",
                "organizer": 2,
                "completion_date": "06/04/2021 00:00:00",
                "organizer_email": "gaurav@farintsol.com",
                "remark": "Updated Templates review required",
                "is_completed": False,
                "organizer_name": "Raj R",
                "meeting": {
                    "title": "Demo Meeting",
                    "id": 11
                }
            },
            {
                "id": 3,
                "title": "Fetch and Update meeting data",
                "organizer": 2,
                "completion_date": "06/04/2021 00:00:00",
                "organizer_email": "gaurav@farintsol.com",
                "remark": "Able to update meetings",
                "is_completed": True,
                "organizer_name": "Raj R",
                "meeting": {
                    "title": "Demo Meeting",
                    "id": 11
                }
            }
        ],
        "attendee": [
            {
                "id": 10,
                "attendee": {
                    "id": 2,
                    "first_name": "Raj",
                    "last_name": "R",
                    "mobile": "9595959595",
                    "email": "gaurav@farintsol.com",
                    "auto_timedate": "01/04/2021 10:10:42",
                    "user_type": "employee",
                    "under": 3
                },
                "is_present": False,
                "is_organizer": False
            }
        ],
        "start_time": "06/04/2021",
        "end_time": "10/04/2021",
        "created_at": "06/04/2021",
        "thread_name": "CFO Services",
        "title": "Demo Meeting",
        "summary": "Minutes of meeting demo",
        "status": False,
        "is_closed": True,
        "cron": "40 13 THU,WED 06 04",
        "modified_at": "06/04/2021 13:53:10",
        "reminder": None,
        "base_url": "http://localhost:8000"
    }
    
    return render(request, "schedule_meeting.html", context)
















