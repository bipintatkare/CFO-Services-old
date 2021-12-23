from datetime import datetime
from django.db import models
from django.utils import timezone
from user.models import SiteUser
# from tally.models import Group as TallyGroups, CustomGroupCompany


class Company(models.Model):
    persons = models.ManyToManyField(SiteUser, through="CompanyPerson")
    company_name = models.CharField(max_length=200,unique=True)
    company_number = models.IntegerField(null=True,blank=True)
    starting_from = models.CharField(max_length=10,null=True,blank=True)
    ending_at = models.CharField(max_length=10,null=True,blank=True)
    guid = models.CharField(max_length=50,null=True,blank=True)
    gst_no = models.CharField(max_length=90,null=True,blank=True)
    sync_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)
    sync_from_user = models.CharField(max_length=50)
    company_url = models.URLField(null=True, blank=True)
    company_email = models.CharField(default='vikas.pandey9323@gmail.com',max_length=150,null=True,blank=True)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        unique_together = ('company_name', 'company_number','starting_from','ending_at',)

    def __str__(self):
        return self.company_name

class CompanyPerson(models.Model):
    person = models.ForeignKey(SiteUser, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ('person', 'company') 
        
    def __str__(self):
        return "{}".format(self.id)


class ParentGroup(models.Model):
    custom = models.BooleanField(default=False)
    name = models.CharField(max_length=50)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

class CompanyGroup(models.Model):
    company_id = models.ManyToManyField(Company)
    groupname = models.CharField(max_length=50,null=True,blank=True)


class TrialBalance(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    particular = models.CharField(max_length=90)
    dr_amt = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    cr_amt = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    # open_bal = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    # close_bal = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    balance_amt = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    # groups = models.ManyToManyField(Group,blank=True)
    # auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        unique_together = ('company_id', 'particular','dr_amt','cr_amt',)

class Group(models.Model):
    # custom = models.BooleanField(default=False)
    primary = models.ForeignKey(ParentGroup,on_delete=models.CASCADE,null=True, blank=True)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    trial_balance = models.ForeignKey(TrialBalance,  on_delete=models.CASCADE, null=True, blank=True)
    guid = models.CharField(max_length=50,null=True,blank=True)
    name = models.CharField(max_length=90,null=True,blank=True)
    grand_parent = models.CharField(max_length=50,null=True,blank=True)
    parent = models.CharField(max_length=50,null=True,blank=True)
    gst_applicable = models.BooleanField(default=False)
    tds_applicable = models.BooleanField(default=False)
    billwise_on = models.BooleanField(default=False)
    is_cost_center_on = models.BooleanField(default=False)
    is_sub_ledger = models.BooleanField(default=False)
    is_revenue = models.BooleanField(default=False)
    affets_gross_profit = models.BooleanField(default=False)
    is_deemed_positive = models.BooleanField(default=False)
    affects_stock = models.BooleanField(default=False)
    alter_id = models.IntegerField(null=True, blank=True)
    primary_group = models.CharField(max_length=60)
    group_opening_balance = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    group_closing_balance = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    credit_total = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    debit_total = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    overdue_bills = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    cashin = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    cashout = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    has_cost_centers = models.BooleanField(default=False)
    this_yr_bal = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    prv_yr_bal = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    this_qtr_bal = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    prv_qtr_bal = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        unique_together = ('primary', 'company_id','name','grand_parent',)


class SyncHistory(models.Model):
    company_name = models.ForeignKey(Company,on_delete=models.CASCADE)
    sync_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)
    sync_from_user = models.CharField(max_length=50)
    is_auto_sync = models.BooleanField(default=True)

class Customers(models.Model):
    user_id = models.ForeignKey(SiteUser,on_delete=models.CASCADE)
    modules_assigned = models.CharField(max_length=20)
    is_premium = models.BooleanField(default=False)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

class Manager(models.Model):
    user_id = models.ForeignKey(SiteUser,on_delete=models.CASCADE)
    company_id = models.ForeignKey(Customers, on_delete=models.CASCADE)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)


class Ledgers(models.Model):
    company_id = models.ForeignKey(Company,on_delete=models.CASCADE, null=True, blank=True)
    trial_balance = models.ForeignKey(TrialBalance,  on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=90, null=True, blank=True)
    under = models.ForeignKey('tally.Group',on_delete=models.CASCADE, null=True, blank=True)
    under_custom = models.ForeignKey('tally.CustomGroup',on_delete=models.CASCADE, null=True, blank=True)
    primary_group = models.ForeignKey(ParentGroup,on_delete=models.CASCADE, null=True, blank=True)
    primary_group_str = models.CharField(max_length=90, null=True, blank=True)
    parent_str = models.CharField(max_length=90, null=True, blank=True)
    creation_date = models.CharField(max_length=10,null=True,blank=True)
    alteration_date = models.CharField(max_length=10,null=True,blank=True)
    altered_by = models.CharField(max_length=50,null=True,blank=True)
    phone = models.CharField(max_length=90,null=True,blank=True)
    email = models.CharField(max_length=95,null=True,blank=True)
    is_cost_center_on = models.BooleanField(default=False)
    mailing_name = models.CharField(max_length=20,null=True,blank=True)
    gst = models.CharField(max_length=15,null=True,blank=True)
    opening_balance = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #previous yr balance
    credit_limit = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    closing_balance = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #This yr balance
    budget = models.BigIntegerField(null=True,blank=True)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        unique_together = ('company_id', 'name','primary_group_str',)


class DateWiseLedger(models.Model):
    ledger_id = models.ForeignKey(Ledgers,on_delete=models.CASCADE)
    ledger_date = models.DateField()
    closing_balance = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,
                                          default=0.0)  # This yr balance

    def __str__(self):
        return self.ledger_id.company_id.company_name


class voucher_type_parent(models.Model):
    name = models.CharField(max_length=90)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)


class voucher_type(models.Model):
    company_id = models.ForeignKey(Company,on_delete=models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length=90)
    type = models.ForeignKey(voucher_type_parent,on_delete=models.CASCADE,null=True,blank=True)
    is_head = models.BooleanField(default=False)
    total_entry = models.IntegerField(default=0)
    alter_id = models.CharField(max_length=10)
    guid = models.CharField(max_length=55)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        unique_together = ('company_id', 'name','type',)


class Vouchers(models.Model):
    company_id = models.ForeignKey(Company,on_delete=models.CASCADE,null=True,blank=True)
    party_ledger = models.ForeignKey(Ledgers,on_delete=models.CASCADE,null=True,blank=True)
    type_name = models.CharField(max_length=90)
    voucher_type_internal = models.CharField(max_length=90)
    v_number = models.CharField(max_length=30,null=True,blank=True)
    v_date = models.CharField(max_length=10,null=True,blank=True) #tally_date_format
    v_refrence = models.CharField(max_length=20,null=True,blank=True)
    v_refrence_date = models.CharField(max_length=10,null=True,blank=True)  #Puchase
    gst = models.CharField(max_length=90,null=True,blank=True) #Puchase
    basic_order_ref = models.CharField(max_length=15,null=True,blank=True) #Puchase
    state = models.CharField(max_length=20,null=True,blank=True)
    narration = models.CharField(max_length=200,null=True,blank=True)
    invoice_date_time = models.CharField(max_length=25,null=True,blank=True)
    creation_date = models.DateField(null=True, blank=True)
    alteration_date = models.DateField(null=True, blank=True)
    voucher_date = models.DateField(null=True, blank=True)
    #report4 fields
    instrument_number = models.CharField(max_length=30, null=True, blank=True)
    instrument_date = models.CharField(max_length=15, null=True, blank=True)
    bank_date = models.CharField(max_length=15, null=True, blank=True)
    is_reconciled = models.BooleanField(default=False, null=True, blank=True)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    # class Meta:
    #     unique_together = ('company_id', 'party_ledger','type_name','v_number','v_date')
    class Meta:
        ordering = ['-voucher_date']


class VoucherItem(models.Model):
    voucher_id = models.ForeignKey(Vouchers,on_delete=models.CASCADE)
    ledger = models.ForeignKey(Ledgers,on_delete=models.CASCADE,null=True,blank=True)
    ledger_name_temp = models.CharField(max_length=100,null=True,blank=True)
    amt = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    type = models.CharField(max_length=5,choices=(('CR','CR'),('DR','DR')))
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        unique_together = ('ledger_name_temp','amt','type','voucher_id')
        ordering = ['-auto_timedate']

class VoucherBillAllocation(models.Model):
    voucher_item_id = models.ForeignKey(VoucherItem,on_delete=models.CASCADE)
    name = models.CharField(max_length=50,null=True,blank=True)
    amt = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    type = models.CharField(max_length=15,null=True,blank=True)



class StockInfo(models.Model):
    company_id = models.ForeignKey(Company,on_delete=models.CASCADE)
    material_name = models.CharField(max_length=90)
    under = models.ForeignKey(Vouchers,on_delete=models.CASCADE)
    units = models.CharField(max_length=50)
    gst_appicable = models.BooleanField(default=False)
    opening_quantity = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    opening_value = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    rate_per = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    value = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    quantity = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)


class BalanceSheet(models.Model):
    company_id = models.ForeignKey(Company,on_delete=models.CASCADE)
    head_name = models.CharField(max_length=80)
    total_amt = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    type = models.CharField(max_length=20,choices=(('Asset','Asset'),('Liabilities','Liabilities')))
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        unique_together = ('company_id', 'head_name','total_amt','type',)

class BSItem(models.Model):
    bs = models.ForeignKey(BalanceSheet,on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    amt = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)

    class Meta:
        unique_together = ('bs', 'name','amt',)

class ProfitLoss(models.Model):
    company_id = models.ForeignKey(Company,on_delete=models.CASCADE)
    head_name = models.CharField(max_length=80)
    total_amt = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    type = models.CharField(max_length=20,choices=(('Income','Income'),('Expense','Expense')))
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        unique_together = ('company_id', 'head_name','total_amt','type',)

class PLItem(models.Model):
    pl = models.ForeignKey(ProfitLoss,on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    amt = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)

    class Meta:
        unique_together = ('pl', 'name','amt',)


class GSTR1(models.Model):
    company_id = models.ForeignKey(Company,on_delete=models.CASCADE)
    gst_no = models.CharField(max_length=90,null=True,blank=True)
    customer_billing_name = models.CharField(max_length=90,null=True,blank=True)
    report1 = models.BooleanField(default=False)
    report2 = models.BooleanField(default=False)
    report3 = models.BooleanField(default=False)
    report4 = models.BooleanField(default=False)


class GSTR1_invoice(models.Model):
    gstr1 = models.ForeignKey(GSTR1,on_delete=models.CASCADE)
    invoice_no = models.CharField(max_length=20,null=True,blank=True)
    # invoice_date = models.CharField(max_length=12,null=True,blank=True)
    invoice_date = models.DateField(null=True,blank=True)
    total_value = models.FloatField(null=True,blank=True)
    inv_typ = models.CharField(max_length=3,null=True,blank=True)

    class Meta:
        unique_together = ('invoice_no', 'invoice_date','total_value','inv_typ')

class GSTR1_gst(models.Model):
    gstr1_invoice = models.ForeignKey(GSTR1_invoice,on_delete=models.CASCADE)
    txval = models.FloatField(null=True,blank=True)
    camt = models.FloatField(null=True,blank=True)
    samt = models.FloatField(null=True,blank=True)
    iamt = models.FloatField(null=True,blank=True)
    rate = models.FloatField(null=True,blank=True)

    class Meta:
        unique_together = ('gstr1_invoice', 'txval','camt','samt','iamt','rate')


class GSTR2(models.Model):
    company_id = models.ForeignKey(Company,on_delete=models.CASCADE)
    gst_no = models.CharField(max_length=90,null=True,blank=True)
    customer_billing_name = models.CharField(max_length=90,null=True,blank=True)
    report1 = models.BooleanField(default=False)
    report2 = models.BooleanField(default=False)
    report3 = models.BooleanField(default=False)
    report4 = models.BooleanField(default=False)


class GSTR2_invoice(models.Model):
    gstr2 = models.ForeignKey(GSTR2,on_delete=models.CASCADE)
    invoice_no = models.CharField(max_length=20,null=True,blank=True)
    # invoice_date = models.CharField(max_length=12,null=True,blank=True)
    invoice_date = models.DateField(null=True,blank=True)
    total_value = models.FloatField(null=True,blank=True)
    inv_typ = models.CharField(max_length=3,null=True,blank=True)

    class Meta:
        unique_together = ('invoice_no', 'invoice_date','total_value','inv_typ')

class GSTR2_gst(models.Model):
    gstr2_invoice = models.ForeignKey(GSTR2_invoice,on_delete=models.CASCADE)
    txval = models.FloatField(null=True,blank=True)
    camt = models.FloatField(null=True,blank=True)
    samt = models.FloatField(null=True,blank=True)
    iamt = models.FloatField(null=True,blank=True)
    rate = models.FloatField(null=True,blank=True)

    class Meta:
        unique_together = ('gstr2_invoice', 'txval','camt','samt','iamt','rate')

class GSTSalesValues(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    customer_billing_name = models.CharField(max_length=90,null=True,blank=True)
    gst_no = models.CharField(max_length=90,null=True,blank=True)
    inv_no = models.CharField(max_length=20, null=True, blank=True)
    inv_date = models.DateField(null=True, blank=True)
    total_value = models.FloatField(null=True, blank=True)
    inv_typ = models.CharField(max_length=3, null=True, blank=True)
    txval = models.FloatField(null=True, blank=True)
    camt = models.FloatField(null=True, blank=True)
    samt = models.FloatField(null=True, blank=True)
    iamt = models.FloatField(null=True, blank=True)
    rate = models.FloatField(null=True, blank=True)
    report5 = models.BooleanField(default=False)



    # class Meta:
    #     unique_together = ('company_id', 'gst_no','inv_no','total_value',)

class GSTPurchaseValues(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    customer_billing_name = models.CharField(max_length=90,null=True,blank=True)
    gst_no = models.CharField(max_length=90,null=True,blank=True)
    inv_no = models.CharField(max_length=20, null=True, blank=True)
    inv_date = models.DateField(null=True, blank=True)
    total_value = models.FloatField(null=True, blank=True)
    inv_typ = models.CharField(max_length=3, null=True, blank=True)
    txval = models.FloatField(null=True, blank=True)
    camt = models.FloatField(null=True, blank=True)
    samt = models.FloatField(null=True, blank=True)
    iamt = models.FloatField(null=True, blank=True)
    rate = models.FloatField(null=True, blank=True)
    report5 = models.BooleanField(default=False)


class SalesReport(models.Model):
    imag = models.FileField(null=True,blank=True, upload_to='pi_history_file/')

class ScheduleMail(models.Model):
    schedule_by = models.ForeignKey(SiteUser , on_delete=models.CASCADE)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    mis_name = models.CharField(max_length=40,null=True,blank=True)
    days = models.CharField(max_length=50,null=True,blank=True)
    is_daily = models.BooleanField(default=False)
    from_email = models.CharField(max_length=90,)

    class Meta:
        unique_together = ('company_id', 'mis_name','days',)


class CrucialNumbers(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    todays_sale = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    monthly_cumulative = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    yearly_cumulative = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    auto_timedate = models.DateTimeField(default=timezone.now(), null=True, blank=True)


class CrucialNumbersBank(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    bank_name = models.CharField(max_length=90,null=True,blank=True)
    cr_amt = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    dr_amt = models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    auto_timedate = models.DateTimeField(default=datetime.now(), null=True, blank=True)


class TrialBalanceMapping(models.Model):
    trial_balance = models.ForeignKey(TrialBalance, blank=True, null=True, on_delete=models.CASCADE)
    parent_group = models.ForeignKey(ParentGroup, related_name="parent_group_for_tbm", blank=True, null=True, on_delete=models.CASCADE)
    groups = models.ManyToManyField(Group, related_name="group_for_tbm", blank=True)

    custom_parent_group = models.ForeignKey(ParentGroup, related_name="custom_parent_group_for_tbm", blank=True, null=True, on_delete=models.CASCADE)
    custom_group = models.ForeignKey(Group, related_name="custom_group_for_tbm", blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)


class AppVersion(models.Model):
    latest_version = models.CharField(max_length=10)
    blocked_versions = models.CharField(max_length=150)
    latest_software_path = models.CharField(max_length=50)
    download_link = models.URLField(max_length=90)
    total_downloads_till_date = models.IntegerField(default=0)
    total_downloads_current_version = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ConfigurationBackup(models.Model):
    user_name = models.CharField(max_length=90)
    user_mobile = models.CharField(max_length=10,unique=True)
    user_password = models.CharField(max_length=30)
    user_id = models.CharField(max_length=10)
    tally_path = models.CharField(max_length=150)
    schedule_time_mins = models.CharField(max_length=5)
    schedule_time_hrs = models.CharField(max_length=5)
    port_number = models.CharField(max_length=4)
