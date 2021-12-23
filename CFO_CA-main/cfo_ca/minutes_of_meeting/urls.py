from django.urls import include, path
from minutes_of_meeting import views

urlpatterns = [
    path('meetings/', views.MeetingList.as_view()),
    path('meeting/<int:pk>/', views.MeetingView.as_view()),

    path('meeting-threads/', views.MeetingThreadList.as_view()),
    path('meeting-thread/<int:pk>/', views.MeetingThreadView.as_view()),

    path('perticulars/', views.PerticularList.as_view()),
    path('perticular/<int:perticular_id>/', views.PerticularView.as_view()),

    # path('attendances/<int:meeting_id>/', views.AttendanceList.as_view()),
    # path('attendance/<int:attendance_id>/', views.AttendanceView.as_view()),

    path('tasks/<int:thread_id>/', views.TaskView.as_view()),
    path('recurring-meeting/', views.RecurringMeetingView.as_view()),
]
