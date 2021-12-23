from django.contrib import admin
from minutes_of_meeting.models import MeetingThread, Meeting, Perticular, MeetingUser, MeetingPerticular, \
    MeetingRecurringMeeting, RecurringMeeting


class MeetingThreadAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'organizer', 'company',
                    'summary', 'created_at')


class MeetingAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'summary', 'status', 'meeting_thread',
    'created_at', 'is_closed', 'm_date')
    

class PerticularAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'organizer', 'completion_date', 'remark', 'cron', 'reminder', 'is_completed')


class MeetingUserAdmin(admin.ModelAdmin):
    list_display = ( 'attendee', 'is_organizer', 'is_present')

class RecurringMeetingAdmin(admin.ModelAdmin):
    list_display = ( 'title', 'cron', 'start_time', 'end_time')


admin.site.register(MeetingThread, MeetingThreadAdmin)
admin.site.register(Meeting, MeetingAdmin)
admin.site.register(Perticular, PerticularAdmin)
admin.site.register(MeetingUser, MeetingUserAdmin)
admin.site.register(MeetingPerticular)
admin.site.register(MeetingRecurringMeeting)
admin.site.register(RecurringMeeting, RecurringMeetingAdmin)