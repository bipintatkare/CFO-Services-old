from django.contrib import admin
from .models import MISReportScheduleEmail,TallyPortalDifference, CeleryScheduleTask, Note, \
    Report, NoteCustomGroup, ReportNote, ScriptMaster


class MISReportScheduleEmailAdmin(admin.ModelAdmin):

    list_display = ('id', 'cron', 'schedule', 'company_id',
                    'mis_name', 'days', 'is_daily','created_at','modified_at')
    search_fields = ('mis_name', 'company_id',)
    list_filter = ('company_id',)

class ScriptMasterAdmin(admin.ModelAdmin):

    list_display = ('script_id', 'user', 'name',
                    'execution_time', 'created_at', 'modified_at',)
    search_fields = ('script_id',)
    list_filter = ('script_id',)

admin.site.register(MISReportScheduleEmail,MISReportScheduleEmailAdmin)
admin.site.register(TallyPortalDifference)
admin.site.register(CeleryScheduleTask)
admin.site.register(Note)
admin.site.register(Report)
admin.site.register(NoteCustomGroup)
admin.site.register(ReportNote)
admin.site.register(ScriptMaster,ScriptMasterAdmin)
