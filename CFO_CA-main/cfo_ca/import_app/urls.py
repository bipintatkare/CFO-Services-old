from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt

from .views import CompanyList, CompanyDetails, MISFDBO, MISLBOB, MISFFSFTP, \
    MISDAR, MISCAR, sales_report, sales_report_mail, send_mis_test, sync_history, \
    schedule_mail, gst_r1_sales, report_sales1, report_sales2, report_sales3, report_sales4, \
    report_sales5, schedule_mis_mails, gst_r12_purchase, report_purchase1, report_purchase2, \
    gst_summary, \
    report_purchase3, report_purchase4, report_purchase5, report_sales6, TrialBalanceMappingList, \
    TrialBalanceMappingView, TrialBalanceList, TrialBalanceMappingData,Companymapping

from .views import GroupList, GroupView, ParentGroupList, ParentGroupView, \
    BalanceSheetView, BSItemView, LedgersList, LedgersView, \
    ExportDataView, EmailDataView, QueryDataView,testing_views

urlpatterns = [
    path('company_list/', CompanyList.as_view()),
    path('company_details/<str:id>', CompanyDetails.as_view()),
    path('company-mapping', Companymapping.as_view()),
    path('mis_fdbo/<str:id>', MISFDBO.as_view()),
    path('mis_lbob/<str:id>', MISLBOB.as_view()),
    path('mis_ffsftp/<str:id>', MISFFSFTP.as_view()),
    path('mis_dar/<str:id>', MISDAR.as_view()),
    path('mis_car/<str:id>', MISCAR.as_view()),
    path('send_mail/<str:email>', send_mis_test.as_view()),
    path('sync_history', sync_history.as_view()),
    path('schedule_mail/<str:email>/<str:time>', schedule_mail.as_view()),
    path('gst_r1/<str:company_id>', gst_r1_sales.as_view()),
    path('report_1/<str:company_id>', report_sales1.as_view()),
    path('report_2/<str:company_id>', report_sales2.as_view()),
    path('report_3/<str:company_id>', report_sales3.as_view()),
    path('report_4/<str:company_id>', report_sales4.as_view()),
    path('report_5/<str:company_id>', report_sales5.as_view()),
    path('report_6/<str:company_id>', report_sales6.as_view()),
    path('sales_report/<str:company_id>', sales_report.as_view()),

    path('gst_r2/<str:company_id>', gst_r12_purchase.as_view()),
    path('report_purchase1/<str:company_id>', report_purchase1.as_view()),
    path('report_purchase2/<str:company_id>', report_purchase2.as_view()),
    path('report_purchase3/<str:company_id>', report_purchase3.as_view()),
    path('report_purchase4/<str:company_id>', report_purchase4.as_view()),
    path('report_purchase5/<str:company_id>', report_purchase5.as_view()),
    path('gst_summary/<str:company_id>', gst_summary.as_view()),

    path('schedule_mis_mails', schedule_mis_mails.as_view()),

    path('trial_balances/', TrialBalanceList.as_view()),
    path('trial_balance_mappings/', TrialBalanceMappingList.as_view()),
    path('trial_balance_mapping/<str:tbm_id>/',
         TrialBalanceMappingView.as_view()),

    path('trial_balance_dropdown_data/', TrialBalanceMappingData.as_view()),

    path('parent_group/<str:pg_id>/', ParentGroupView.as_view()),
    path('parent_groups/', ParentGroupList.as_view()),

    path('group/<str:group_id>/', GroupView.as_view()),
    path('groups/', GroupList.as_view()),

    path('balance_sheet/', BalanceSheetView.as_view()),
    path('bs_item/', BSItemView.as_view()),

    path('ledgers_list/', LedgersList.as_view()),
    path('ledgers/<str:ledgers_id>/', LedgersView.as_view()),



    # path('cash_ledger_limit/', CashLedgerLimitView.as_view()),
    # path('ledgers_by_duties_n_taxes/', DutiesNTaxesLedgerView.as_view()),
    # path('assets_and_liabilities_report/', AssetsNLiabilitiesReport.as_view()),
    # path("loans_and_liabilites_by_gvoucher/", LoansNLiabilitiesByGeneralVoucher.as_view()),
    # path("ledgers_with_zero_voucher/", CurrentYearLedgerWithZeroVoucher.as_view()),
    # path("ledgers_with_zero_voucher2/", CurrentYearLedgerWithZeroVoucher2.as_view()),
    # path("cash_ledger_current_month/", CashLedgersCurrentMonthView.as_view()),
    # path("voucher_bank_reconcilation/", VoucherBankReconcilation.as_view()),

    path("query_data/<str:script_master_id>/", QueryDataView.as_view()),
    path("export_data/<str:script_master_id>/", ExportDataView.as_view()),
    path("email_data/<str:script_master_id>/", EmailDataView.as_view()),

]
