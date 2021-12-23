from django.urls import include, path
from .views import ReportView, MISReportScheduleEmailView,GSTDiffrenceView, Test, \
    TrialBalanceReportView, NoteView, NoteList, ReportList, ScriptMasterList, ReportView2


urlpatterns = [
    path('report1/', ReportView2.as_view()),
    path('mis-schedule-mails/', MISReportScheduleEmailView.as_view()),
    path('gst-summary/', GSTDiffrenceView.as_view()),
    path('tb-report/', TrialBalanceReportView.as_view()),
    path('notes/', NoteList.as_view()),
    path('reports/', ReportList.as_view()),
    path('note/<str:note_id>/', NoteView.as_view()),
    path('report/<str:report_id>/', ReportView.as_view()),

    path("script-master/", ScriptMasterList.as_view()),
    path('test/', Test.as_view()),
]