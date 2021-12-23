from decimal import Decimal
from django.utils import timezone
from django.db import models

from import_app.models import Company

Mapping_data = (
    ('Accrued interest on NSC','Accrued interest on NSC'),
('Accumalated Depreciation','Accumalated Depreciation'),
('Advance Income Tax','Advance Income Tax'),
('Advance Wealth Tax','Advance Wealth Tax'),
('Loan Receivables - Short Term','Loan Receivables - Short Term'),
('Bank Charges','Bank Charges'),
('Bank Current Account','Bank Current Account'),
('Business Promotion','Business Promotion'),
('Communication','Communication'),
('Contribution to Provident and other fund','Contribution to Provident and other fund'),
('Depreciation','Depreciation'),
('Electricity & Water Charges','Electricity & Water Charges'),
('Debit Balances written off','Debit Balances written off'),
('Exchange difference','Exchange difference'),
('Fixed Assets','Fixed Assets'),
('Fixed Deposits with Bank','Fixed Deposits with Bank'),
('Gifts and donations (CSR Expd)','Gifts and donations (CSR Expd)'),
('Good Debtors','Good Debtors'),
('Interest Income','Interest Income'),
('Legal & Professional','Legal & Professional'),
('Loss on sale of Fixed Assets','Loss on sale of Fixed Assets'),
('Membership and subscriptions','Membership and subscriptions'),
('Advances to suppliers','Advances to suppliers'),
('Petty Cash','Petty Cash'),
('Prepaid Expenses','Prepaid Expenses'),
('Printing and stationery','Printing and stationery'),
('Professional Exps- Inter co','Professional Exps- Inter co'),
('Provision for doubtful debts/advances written back','Provision for doubtful debts/advances written back'),
('Professional tax payable','Professional tax payable'),
('Provision for Gratuity','Provision for Gratuity'),
('Provision for income tax','Provision for income tax'),
('Provision for doubtful debts & advances - Exp.','Provision for doubtful debts & advances - Exp.'),
('Rates & Taxes','Rates & Taxes'),
('Rent','Rent'),
('Repair & Maintainance','Repair & Maintainance'),
('Provision for Leave salary','Provision for Leave salary'),
('Excess provisions written back/ Misc inc','Excess provisions written back/ Misc inc'),
('Sales tax receivable','Sales tax receivable'),
('Security Deposits','Security Deposits'),
('Service Tax Payables','Service Tax Payables'),
('Staff training and recruitment','Staff training and recruitment'),
('Staff Welfare Expenses','Staff Welfare Expenses'),
('Share Capital','Share Capital'),
('Tax Current Year Income Tax','Tax Current Year Income Tax'),
('TDS Payable','TDS Payable'),
('TDS Receivable','TDS Receivable'),
('Inter Branch','Inter Branch'),
('Travelling and coveyance','Travelling and coveyance'),
('VAT Receivables','VAT Receivables'),
('Vehicle Running & Maintainance','Vehicle Running & Maintainance'),
('Wealth Tax Payable','Wealth Tax Payable'),
('Insurance','Insurance'),
('General Expenses','General Expenses'),
('GST Receivable','GST Receivable'),
('GST Payable','GST Payable'),
('Payable to employees','Payable to employees'),
('Payable for expenses','Payable for expenses'),
('Reserve & Surplus','Reserve & Surplus'),
('Salaries & Wages','Salaries & Wages'))


Notes_data = (('data 1','data 1'),
('data 2','data 2'),
('data 3','data 3'),
('data 4','data 4'))


mapping_data = (('Notes','Notes'),
('Report','Report'))

class Tally_mapping(models.Model):  # for default tally mapping
    # Company_Name = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=120, null=True, blank=True, unique=True)

    def __str__(self):
        return self.name

class PLACC(models.Model):
    company_name=models.CharField(max_length=120,null=True,blank=True )
    description = models.CharField(max_length=80)
    debit=models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    credit=models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    final=models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #closingbalance
    tally_mapping_primary = models.CharField(max_length=50, null=True,blank=True) #auto_mapping
    tally_mapping_parent = models.CharField(max_length=50, null=True,blank=True) #auto_mapping
    new_mapping = models.ForeignKey(Tally_mapping, on_delete=models.CASCADE, null=True,blank=True)
    #models.CharField(max_length=50, choices=Mapping_data, null=True,blank=True)  #manual_mapping
    notes_mapping = models.CharField(max_length=50, choices=Mapping_data, null=True,blank=True)  #notes_mapping
    report_mapping = models.CharField(max_length=50, choices=Mapping_data, null=True,blank=True)  #report_mapping
    auto_timedate   = models.DateTimeField(default=timezone.now,null=True, blank=True)
    auto_update_mapping_timedate   = models.DateTimeField(default=timezone.now, null=True, blank=True)
    is_mapped = models.BooleanField(default=False, null=True, blank=True)
    budget = models.FloatField(default=0.0, null=True, blank=True)

    def __str__(self):
        return self.description

    class Meta:
        ordering = ['description']


class Budget(models.Model):
    sales = models.FloatField(default=0.0, null=True, blank=True)
    gross = models.FloatField(default=0.0, null=True, blank=True)
    nett = models.FloatField(default=0.0, null=True, blank=True)


class AgeingReport(models.Model):
    company_id = models.ForeignKey(Company,on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=120)
    amount=models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    days = models.IntegerField(null=True,blank=True)
    bill_date = models.DateField(null=True,blank=True)
    bill_ref = models.CharField(max_length=50,null=True,blank=True)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)


    @property
    def is_thirty_days(self):
        return True if self.days<=30 else False

    @property
    def is_thirty_sixty(self):
        return True if self.days>=30 and self.days <= 60 else False

    @property
    def is_sixty_ninety(self):
        return True if self.days >= 60 and self.days <= 90 else False

    @property
    def is_ninety_above(self):
        return True if self.days >= 90 else False


    def __str__(self):
        return self.customer_name

    class Meta:
        ordering = ['customer_name']


class CreditorsAgeingReport(models.Model):
    company_id = models.ForeignKey(Company,on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=120)
    amount=models.DecimalField(max_digits=20, decimal_places=2,null=True,blank=True ,default=0.0)
    days = models.IntegerField(null=True,blank=True)
    bill_date = models.DateField(null=True,blank=True)
    bill_ref = models.CharField(max_length=50,null=True,blank=True)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)


    @property
    def is_thirty_days(self):
        return True if self.days<=30 else False

    @property
    def is_thirty_sixty(self):
        return True if self.days>=30 and self.days <= 60 else False

    @property
    def is_sixty_ninety(self):
        return True if self.days >= 60 and self.days <= 90 else False

    @property
    def is_ninety_above(self):
        return True if self.days >= 90 else False


    def __str__(self):
        return self.customer_name

    class Meta:
        ordering = ['customer_name']



class Company(models.Model):
    Company_Name = models.CharField(max_length=120)

    def __str__(self):
        return self.Company_Name




class NOTES(models.Model):  # for notes,report field entry
    # Company_Name = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=120, null=True, blank=True)

    def __str__(self):
        return self.name


class REPORTS(models.Model):  # for notes,report field entry
    # Company_Name = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=120, null=True, blank=True)

    def __str__(self):
        return self.name


class Mapping_Company_tally_notes(models.Model): #for tally default mapping and notes
    Company_Name = models.ForeignKey(Company, on_delete=models.CASCADE)
    Tally_Mapping = models.ForeignKey(Tally_mapping, on_delete=models.CASCADE, null=True,blank=True) # models.CharField(max_length=80, null=True,blank=True)
    Notes_Mapping = models.ForeignKey(NOTES, on_delete=models.CASCADE, null=True,blank=True)
    amt = models.FloatField(default=0.0,blank=True,null=True)



    def __str__(self):
        return str(self.pk)



class Mapping_Company_notes_report(models.Model):  #for Notes mapping and Report
    Company_Name = models.ForeignKey(Company, on_delete=models.CASCADE)
    Notes_Mapping = models.ForeignKey(NOTES, on_delete=models.CASCADE)
    Report_Mapping = models.ForeignKey(REPORTS, on_delete=models.CASCADE)
    amt = models.FloatField(default=0.0,blank=True,null=True)

    def __str__(self):
        return str(self.pk)


# class core_mapping(models.Model):    #for notes,report field entry
#     Company_Name = models.ForeignKey(Company, on_delete=models.CASCADE)
#     field = models.CharField(max_length=120, null=True,blank=True)
#     value = models.CharField(max_length=120, null=True,blank=True)
#
#     def __str__(self):
#         return self.value








