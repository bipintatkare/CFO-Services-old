from django.contrib import admin
from .models import *


admin.site.register(ParentGroup)


class GroupAdmin(admin.ModelAdmin):

    list_display = ('id', 'name', 'grand_parent', 'parent',
                    'primary_group', 'this_yr_bal', 'prv_yr_bal', )
    search_fields = ('name',)

class AppVersionAdmin(admin.ModelAdmin):

    list_display = ('id', 'latest_version', 'latest_software_path', 'download_link',
                    'total_downloads_till_date', 'total_downloads_current_version', 'blocked_versions', 'created_at','updated_at')

class CompanyAdmin(admin.ModelAdmin):

    list_display = ('id', 'company_name', 'company_number', 'starting_from',
                    'ending_at', 'company_email', )
    search_fields = ('company_name',)

class CompanyPersonAdmin(admin.ModelAdmin):

    list_display = ('id','company_name', 'person_name', 'created_at',
                    'updated_at', )
    search_fields = ('company',)
    list_filter = ('company',)

    def person_name(self, instance):
        return instance.person.first_name if instance.person.first_name else ""+" "+instance.person.last_name if instance.person.last_name!=None else ""

    def company_name(self, instance):
        return instance.company.company_name



class LedgerAdmin(admin.ModelAdmin):

    list_display = ('id', 'name', 'primary_group_str', 'parent_str',
                    'opening_balance', 'closing_balance', 'company_id',)
    search_fields = ('name', 'primary_group_str', 'parent_str',)
    list_filter = ('company_id',)


class LedgerDailyAdmin(admin.ModelAdmin):

    list_display = ('id', 'ledger_name', 'ledger_primary_group_str',
                    'ledger_date', 'closing_balance', )
    search_fields = ('ledger_date', 'ledger_id__parent_str')
    list_filter = ('ledger_id__company_id',)

    def ledger_name(self, instance):
        return instance.ledger_id.name

    def ledger_primary_group_str(self, instance):
        return instance.ledger_id.primary_group_str


class VoucherItemAdmin(admin.TabularInline):
    model = VoucherItem

    # list_display = ('id', 'voucher_id', 'ledger_name_temp', 'amt','type', )
    # search_fields = ('ledger_name_temp','type')
    

class VoucherAdmin(admin.ModelAdmin):
    inlines = [VoucherItemAdmin, ]
    list_display = ('id', 'company_id', 'type_name',
                    'v_number', 'v_date', 'gst', 'voucher_date', )
    search_fields = ('v_number', 'type_name', 'gst', 'v_number',)


class RuleAdmin(admin.ModelAdmin):
    inlines = [VoucherItemAdmin, ]


class GSTSalesValuesAdmin(admin.ModelAdmin):
    list_display = ('id', 'company_id', 'gst_no', 'inv_no',
                    'inv_date', 'total_value', 'report5', )
    search_fields = ('gst_no', 'inv_no', 'report5',)
    list_filter = ('report5',)


class TrialBalanceMappingAdmin(admin.ModelAdmin):
    list_display = ('id', 'trial_balance', 'parent_group',
                    'custom_parent_group', 'custom_group')
    filter_horizontal = ('groups',)

class CrucialNumbersAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_company', 'todays_sale',
                    'monthly_cumulative', 'yearly_cumulative','auto_timedate',)

    def get_company(self, obj):
        return obj.company_id.company_name

    get_company.short_description = 'Company'

class CrucialNumbersBankAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_company', 'bank_name',
                    'cr_amt', 'dr_amt','auto_timedate',)

    def get_company(self, obj):
        return obj.company_id.company_name

    get_company.short_description = 'Company'

admin.site.register(Company,CompanyAdmin)

admin.site.register(CompanyPerson,CompanyPersonAdmin)

# admin.site.register(Group, GroupAdmin)
admin.site.register(AppVersion, AppVersionAdmin)
admin.site.register(Ledgers, LedgerAdmin)
admin.site.register(voucher_type_parent)
admin.site.register(VoucherItem)
admin.site.register(VoucherBillAllocation)
admin.site.register(voucher_type)
admin.site.register(Vouchers, VoucherAdmin)
admin.site.register(StockInfo)
admin.site.register(SyncHistory)
admin.site.register(CompanyGroup)
admin.site.register(GSTR1)
admin.site.register(GSTR1_invoice)
admin.site.register(GSTR1_gst)
admin.site.register(SalesReport)

admin.site.register(GSTR2)
admin.site.register(GSTR2_invoice)
admin.site.register(GSTR2_gst)
admin.site.register(GSTPurchaseValues)


admin.site.register(ScheduleMail)
admin.site.register(BalanceSheet)
admin.site.register(TrialBalance)
admin.site.register(ConfigurationBackup)
admin.site.register(CrucialNumbersBank,CrucialNumbersBankAdmin)
admin.site.register(CrucialNumbers,CrucialNumbersAdmin)
admin.site.register(GSTSalesValues, GSTSalesValuesAdmin)
admin.site.register(DateWiseLedger, LedgerDailyAdmin)
admin.site.register(TrialBalanceMapping, TrialBalanceMappingAdmin)
