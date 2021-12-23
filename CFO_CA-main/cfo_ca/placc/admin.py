from django.contrib import admin

from .models import *

class MappingAdmin(admin.ModelAdmin):
    list_display = ('id', 'description','debit','credit','final','tally_mapping_primary','tally_mapping_parent',
                  'new_mapping',
                  'notes_mapping',
                  'report_mapping')
    # list_filter = ('bprofile_user_id','category_id')
    search_fields = ('description',)


class Mapping_Company_tally_notesAdmin(admin.ModelAdmin):
    list_display = ('id', 'Company_Name','Notes_Mapping','Tally_Mapping','amt',)
    # list_filter = ('bprofile_user_id','category_id')
    search_fields = ('Tally_Mapping',)

class Mapping_Company_notes_reportAdmin(admin.ModelAdmin):
    list_display = ('id', 'Company_Name','Report_Mapping','Notes_Mapping','amt',)
    # list_filter = ('bprofile_user_id','category_id')
    search_fields = ('Notes_Mapping',)

# admin.site.register(PLACC,MappingAdmin)
admin.site.register(Company)
admin.site.register(Budget)
# admin.site.register(Mapping_Company_tally_notes,Mapping_Company_tally_notesAdmin)
# admin.site.register(core_mapping)
# admin.site.register(NOTES)
# admin.site.register(REPORTS)
# admin.site.register(Tally_mapping)
admin.site.register(AgeingReport)
admin.site.register(CreditorsAgeingReport)
# admin.site.register(Mapping_Company_notes_report,Mapping_Company_notes_reportAdmin)

