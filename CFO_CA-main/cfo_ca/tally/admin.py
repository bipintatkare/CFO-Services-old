from django.contrib import admin
from .models import Group, CustomGroup, Ledger, TrialBalance

# admin.site.register(Company)
# admin.site.register(CompanyPerson)

class GroupAdmin(admin.ModelAdmin):

    list_display = ('id', 'name', 'under','balance_sheet_type','group_type','company_name',
                    'closing_balance_cr','closing_balance_dr',)
    search_fields = ('name',)
    list_filter = ('company',)

    def company_name(self, instance):
        return instance.company.company_name

class CustomGroupAdmin(admin.ModelAdmin):

    list_display = ('id', 'name', 'under','balance_sheet_type','group_type','company_name',
                    'closing_balance_cr','closing_balance_dr',)
    search_fields = ('name',)
    list_filter = ('company',)

    def company_name(self, instance):
        return instance.company.company_name

admin.site.register(Group,GroupAdmin)
admin.site.register(CustomGroup,CustomGroupAdmin)
# admin.site.register(Ledger)
# admin.site.register(TrialBalance)
