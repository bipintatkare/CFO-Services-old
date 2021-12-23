from django.db import models
from django.utils import timezone
from user.models import SiteUser
from import_app.models import Ledgers as ImportAppLedger, Company

BALANCE_SHEET_CHOICES = (
    ("Assets", "Assets"), 
    ("Liabilities", "Liabilities"), 
    ("Expense", "Expense"),
    ("Income", "Income"),
)

GROUP_TYPE = (
    ("BS", "Balance Sheet"),
    ("P&L", "Profit & Loss"),
)


# class Company(models.Model):
#     name = models.CharField(max_length=90)
#     persons = models.ManyToManyField(SiteUser, related_name="persons_for_company", through="CompanyPerson")
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#
#     def __str__(self):
#         return self.name
#
# class CompanyPerson(models.Model):
#     person = models.ForeignKey(SiteUser, related_name="person_for_company", on_delete=models.CASCADE)
#     company = models.ForeignKey(Company, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#
#     class Meta:
#         unique_together = ('person', 'company')
#
#     def __str__(self):
#         return "{}".format(self.id)

class Group(models.Model):
    company = models.ForeignKey(Company,on_delete=models.CASCADE , related_name='company_group')
    name = models.CharField(max_length=90, default='primary')
    under = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    closing_balance_cr = models.DecimalField(max_digits=20, decimal_places=4, null=True, blank=True,default=0.0)  # This yr balance
    closing_balance_dr = models.DecimalField(max_digits=20, decimal_places=4, null=True, blank=True,default=0.0)  # This yr balance
    opening_balance_cr = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #previous yr balance
    opening_balance_dr = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #previous yr balance

    balance_sheet_type = models.CharField(max_length=20, choices=BALANCE_SHEET_CHOICES, blank=True, null=True)
    group_type = models.CharField(max_length=20, choices=GROUP_TYPE, blank=True, null=True)
    class Meta:
        unique_together = ('name', 'company')

    def __str__(self):
        return self.name


class CustomGroup(models.Model):
    company = models.ForeignKey(Company,on_delete=models.CASCADE)
    name = models.CharField(max_length=90, default='primary')
    under = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    closing_balance_cr = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #This yr balance
    closing_balance_dr = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #This yr balance
    opening_balance_cr = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #previous yr balance
    opening_balance_dr = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #previous yr balance

    balance_sheet_type = models.CharField(max_length=20, choices=BALANCE_SHEET_CHOICES, blank=True, null=True)
    group_type = models.CharField(max_length=20, choices=GROUP_TYPE, blank=True, null=True)

    class Meta:
        unique_together = ('name', 'company')

    def __str__(self):
        return self.name


class Ledger(models.Model):
    name = models.CharField(max_length=90, null=True, blank=True)
    company= models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    group = models.ForeignKey(CustomGroup, on_delete=models.CASCADE)
    creation_date = models.CharField(max_length=10, null=True, blank=True)
    alteration_date = models.CharField(max_length=10, null=True, blank=True)
    altered_by = models.CharField(max_length=50, null=True, blank=True)
    phone = models.CharField(max_length=90, null=True, blank=True)
    email = models.CharField(max_length=95, null=True, blank=True)
    is_cost_center_on = models.BooleanField(default=False)
    mailing_name = models.CharField(max_length=20,null=True,blank=True)
    gst = models.CharField(max_length=15,null=True,blank=True)
    opening_balance = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #previous yr balance
    credit_limit = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0)
    closing_balance = models.DecimalField(max_digits=20, decimal_places=4,null=True,blank=True ,default=0.0) #This yr balance
    budget = models.BigIntegerField(null=True,blank=True)

    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        unique_together = ("name", "company", "group")
    
    def __str__(self):
        return self.name

class TrialBalance(models.Model):
    company = models.ForeignKey(Company, related_name="tb_for_company", on_delete=models.CASCADE, null=True, blank=True)
    ledger = models.ForeignKey(ImportAppLedger, on_delete=models.CASCADE)
    custom_group = models.ForeignKey(CustomGroup, on_delete=models.CASCADE)
    auto_timedate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    def __str__(self):
        return str(self.id)
