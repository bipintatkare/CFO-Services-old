from django.contrib import admin
from django.urls import path,include
from .views import *
urlpatterns = [
    path('company_list/', CompanyList.as_view()),
    path('get_banks/<str:comp_id>/<str:bank_type>', BankList.as_view()),
    path('get_bank_vouchers/<str:comp_id>/<str:bank_name>/<str:fromDate>/<str:toDate>', VoucherList.as_view()),
    path('ledger_list/<str:comp_id>', LedgersList.as_view()),
    path('get_sales/<str:comp_id>', SalesDetails.as_view()),
    path('get_purchase/<str:comp_id>', PurchaseDetails.as_view()),
    path('auth/login', LoginView.as_view()),

]
