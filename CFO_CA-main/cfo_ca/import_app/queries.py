
from import_app.models import Ledgers, VoucherItem, DateWiseLedger
import datetime
from django.db.models import Q


QUERIES = {
    # Ledgers
    2 : "Ledgers Having Zero Entries",  #for email
    3 : "Ledgers Having Zero Entries ( closing_bal > 0 )",  #for email
    8 : "Assets Liabilities Report",   #for email
    21 : "Cash Ledger (Current Month)",
    22 : "Loans & Liabilities (General Voucher)",   #for email
    23 : "Ledger by Duties and Taxes",
    41 : "Suspense Acc Ledgers", #for email
    # Vouchers
    4 : "Voucher Bank Reconciliation",
    12 : "Cash Ledger Exceeding Limit",
}

def get_ledgers_queryset(**kwargs):
    company_list = kwargs['company_list']
    script_master_id = kwargs['script_master_id']
    from_date = kwargs["from_date"]
    to_date = kwargs["to_date"]

    today = datetime.date.today()
    if company_list:
        company_filter = Q(company_id_id__in=company_list)
    else:
        company_filter = Q()
    queryset = Ledgers.objects.filter(company_filter)

    if script_master_id == 2 or script_master_id == 3:
        ledgers_without_vouchers = []  
        ledgers_with_vouchers = []
        ledgers_with_vouchers = VoucherItem.objects.all().values_list("ledger_name_temp", flat=True)
        print("ledgers_with_vouchers")
        print(ledgers_with_vouchers)
        # queryset = queryset.filter(
        #     ~Q(name__in=ledgers_with_vouchers)
        #     # ~Q(name__in=ledgers_with_vouchers) & Q(auto_timedate__year=today.year)
        # )

        if script_master_id == 3:
            queryset = queryset.filter(
                Q(closing_balance__gt=0)
            )
        else:
            queryset = queryset.filter(
                Q(closing_balance=0)
            )

    elif script_master_id == 8:

        queryset = queryset.filter(
            ((Q(parent_str__icontains="Capital Account") | Q(parent_str__icontains="Current Liabilities") | Q(parent_str__icontains="Loans (Liability)")) & Q(closing_balance__gt=0))
            | ((Q(parent_str__icontains="Investments") | Q(parent_str__icontains="Current Assets") | Q(parent_str__icontains="Suspense A/c")) & Q(closing_balance__gt=0))
        )

        # queryset = queryset.filter(
        #     (Q(under__balance_sheet_type="Liabilities") & Q(under__closing_balance_dr__gt=0))
        #     | (Q(under__balance_sheet_type="Assets") & Q(under__closing_balance_cr__lt=0))
        # )

    elif script_master_id == 22:
        ledgers_with_vouchers = []
        ledgers_with_vouchers = VoucherItem.objects.all().values_list("ledger_name_temp", flat=True)
        queryset = queryset.filter(
            Q(name__in=ledgers_with_vouchers)
        )[:100]

    elif script_master_id == 23:
        queryset = queryset.filter(Q(under__name="Duties & Taxes"))
    
    return queryset


def get_vouchers_queryset(**kwargs):
    company_list = kwargs['company_list']
    script_master_id = kwargs['script_master_id']
    from_date = kwargs["from_date"]
    to_date = kwargs["to_date"]
    print("company_list")
    print("company_list")

    print(company_list)
    today = datetime.date.today()
    if company_list:
        company_filter = Q(voucher_id__company_id_id__in=company_list)
    else:
        company_filter = Q()

    if from_date:
        fdate = datetime.datetime.strptime(from_date, "%Y-%m-%d").date()
        print(fdate)
        from_date = Q(voucher_id__voucher_date__gte=fdate) 
    else:
        from_date = Q()

    if to_date:
        tdate = datetime.datetime.strptime(str(to_date), "%Y-%m-%d").date()
        print(tdate)
        to_date = Q(voucher_id__voucher_date__lte=tdate) 
    else:
        to_date = Q()

    queryset = VoucherItem.objects.filter(company_filter, from_date, to_date)
    print(queryset)
    if script_master_id == 4:
        ledgers_name_list = Ledgers.objects.filter(Q(under__name="Bank Accounts")).values_list('name', flat=True)
        queryset = queryset.filter(
            Q(ledger_name_temp__in=ledgers_name_list) &
            Q(voucher_id__is_reconciled=True)
        )

    elif script_master_id == 12:
        detail_list = []
        testing_queryset = queryset.filter(
            Q(ledger_name_temp__in=["Cash", "Petty Cash"]) & 
            Q(amt__gte=10000)
        )
        for item in testing_queryset:
            detail_list.append(item.voucher_id.pk)
        queryset = queryset.filter(Q(voucher_id__id__in=detail_list) & ~Q(ledger_name_temp__in=["Cash", "Petty Cash"]))


    elif script_master_id == 41:
        print("huhuhuhuhuhu")
        detail_list =[]
        testing_queryset = queryset.filter(Q(ledger_name_temp__icontains="suspense"))
        for item in testing_queryset:
            detail_list.append(item.voucher_id.pk)
        queryset = queryset.filter(Q(voucher_id__id__in=detail_list) & ~Q(ledger_name_temp__icontains="suspense"))

    elif script_master_id == 21:
        # Filter with DateWiseLedger model
        if company_list:
            company_filter = Q(ledger_id__company_id_id__in=company_list)
        else:
            company_filter = Q()

        ledgers_id_list = DateWiseLedger.objects.filter(
            Q(ledger_id__under__name="Cash-in-hand") & 
            Q(ledger_date__month=today.month, ledger_date__year=today.year)
        ).values_list("ledger_id", flat=True)
        queryset = queryset.filter(Q(ledger_id__in=ledgers_id_list))

    return queryset