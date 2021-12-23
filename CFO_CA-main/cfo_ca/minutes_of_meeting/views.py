from minutes_of_meeting.models import (
    MeetingUser,
    Meeting,
    MeetingThread,
    Perticular,
    MeetingPerticular,
    RecurringMeeting,
    MeetingRecurringMeeting
)
from minutes_of_meeting.serializers import (
    MeetingUserSerializer,
    MeetingSerializer,
    MeetingThreadSerializer,
    PerticularSerializer,
    RecurringMeetingSerializer,
)
from minutes_of_meeting.utils import boolean
from django.http import Http404, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
from user.utils import get_or_create_user
from user.models import SiteUser, UserType
from datetime import datetime, timedelta
from django.utils.timezone import make_aware
from import_app.models import CompanyPerson
from django.db.models import Q
from minutes_of_meeting.tasks import notify_meeting_create
from croniter import croniter, croniter_range


class MeetingList(APIView):
    """
    List all meetings, or create a new meeting.
    """

    def get(self, request, format=None):
        meeting_list = Meeting.objects.all()
        serializer = MeetingSerializer(meeting_list, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        # try:
        print(request.data)
        schedule = None
        meeting_thread = None
        attendees = []
        if "meeting_thread" in request.data:
            meeting_thread = MeetingThread.objects.get(
                id=request.data["meeting_thread"]
            )

        # Update meeting-users
        for organizer in request.data["organizer"]:
            user = get_or_create_user(
                organizer["name"], organizer["email"], organizer["mobile"]
            )
            ms = MeetingUser.objects.create(attendee=user, is_organizer=True)
            attendees.append(ms)

        for attendee in request.data["attendee"]:
            user = get_or_create_user(
                attendee["name"], attendee["email"], attendee["mobile"]
            )
            ms = MeetingUser.objects.create(attendee=user, is_organizer=False)
            attendees.append(ms)

        if "reminder" in request.data:
            schedule = request.data["reminder"][0]

        if schedule["is_recurring"]: # Multi meetings for a recurring meeting
            print(">> Creating Recurring Meetings")
            start_time = make_aware(datetime.strptime(schedule["start_time"], "%Y-%m-%d"))
            end_time = make_aware(datetime.strptime(schedule["end_time"], "%Y-%m-%d"))

            recurring_meeting = RecurringMeeting(
                title=request.data['title'],
                cron=schedule["cron"],
                start_time=start_time,
                end_time=end_time
            )
            recurring_meeting.save()

            minute, hour, day_of_week, day_of_month, month = schedule["cron"].split(" ")
            print(f"{minute} {hour} {day_of_month} {month} {day_of_week}")
            for dt in croniter_range(start_time, end_time, f"{minute} {hour} {day_of_month} {month} {day_of_week}"):
                meeting = Meeting(
                    title=request.data['title'],
                    summary=request.data['summary'],
                    meeting_thread=meeting_thread,
                    m_date = dt,
                    status = True,
                    is_recurring = True
                )
                meeting.save()
                meeting.attendee.set(attendees)
                meeting.save()

                serializer = MeetingSerializer(meeting)
                notify_meeting_create.apply_async(args=[], kwargs=serializer.data)
                print(">> MEETING CREATE MAIL SENT")

                mrm = MeetingRecurringMeeting(meeting=meeting, recurring_meeting=recurring_meeting)
                mrm.save()

            return Response({"Message": "Create recurring meetings"})

        else:
            on_datetime = make_aware(datetime.strptime(schedule['on_datetime'], "%Y-%m-%d"))
            meeting = Meeting.objects.create(
                title=request.data["title"],
                summary=request.data["summary"],
                meeting_thread=meeting_thread,
                m_date=on_datetime,
                status=True,
                is_recurring=False
            )
            meeting.save()
            meeting.attendee.set(attendees)
            meeting.save()
            serializer = MeetingSerializer(meeting)
            notify_meeting_create.apply_async(args=[], kwargs=serializer.data)
            print(">> MEETING CREATE MAIL SENT")

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # except:
        #     return Response(
        #         {"error": "Somthing went wrong"}, status=status.HTTP_400_BAD_REQUEST
        #     )


class RecurringMeetingView(APIView):
    def get(self, request, format=None):
        meeting_list = RecurringMeeting.objects.all()
        serializer = RecurringMeetingSerializer(meeting_list, many=True)
        return Response(serializer.data)

    def post(self, request):
        return Response(request.data)


class MeetingView(APIView):
    """
    Retrieve, update or delete a meeting instance.
    """

    def get_object(self, pk):
        try:
            return Meeting.objects.get(pk=pk)
        except Meeting.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        meeting_list = self.get_object(pk)
        serializer = MeetingSerializer(meeting_list)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        meeting = self.get_object(pk)
        perticular_list = []
        attendees = []

        print(request.data)
        try:
            # Update meeting-users
            attendees = []
            if "organizer" in request.data:
                for organizer in request.data["organizer"]:
                    print(organizer)
                    user = get_or_create_user(
                        organizer["name"], organizer["email"], organizer["mobile"]
                    )
                    ms = MeetingUser.objects.create(attendee=user, is_organizer=True)
                    attendees.append(ms)

            if "attendee" in request.data:
                for attendee in request.data["attendee"]:
                    print(attendee)
                    user = get_or_create_user(
                        attendee["name"], attendee["email"], attendee["mobile"]
                    )
                    ms = MeetingUser.objects.create(attendee=user, is_organizer=False)
                    attendees.append(ms)

            if "perticular" in request.data:
                for pert in request.data["perticular"]:
                    title = ""
                    remark = ""
                    if "completion_date" in pert:
                        completion_date = make_aware(
                            datetime.strptime(pert["completion_date"], "%Y-%m-%d")
                        )
                        day_before_completion = completion_date - timedelta(days=1)

                    if "title" in pert:
                        title = pert["title"]

                    if "remark" in pert:
                        remark = pert["remark"]

                    perticular, created = Perticular.objects.get_or_create(
                        title=title,
                        organizer=SiteUser.objects.get(id=pert["organizer"]),
                        completion_date=completion_date,
                        remark=remark,
                        cron=f"00 11 * {day_before_completion.day} {day_before_completion.month}",  # Task reminder 1 day before 11
                    )
                    perticular_list.append(perticular)
                meeting.perticular.set(perticular_list)

            if "meeting_thread" in request.data:
                meeting_thread = MeetingThread.objects.get(
                    id=request.data["meeting_thread"]
                )
                meeting.meeting_thread = meeting_thread

            if "title" in request.data:
                meeting.title = request.data["title"]

            if "summary" in request.data:
                meeting.summary = request.data["summary"]

            if "start_time" in request.data:
                meeting.start_time = make_aware(
                    datetime.strptime(request.data["start_time"], "%Y-%m-%d")
                )

            if "end_time" in request.data:
                meeting.end_time = make_aware(
                    datetime.strptime(request.data["end_time"], "%Y-%m-%d")
                )

            if "status" in request.data:
                meeting.status = request.data["status"]

            if "is_closed" in request.data:
                meeting.is_closed = request.data["is_closed"]

            if "cron" in request.data:
                meeting.cron = request.data["cron"]

            if ("attendee" in request.data) or ("organizer" in request.data):
                meeting.attendee.set(attendees)
            meeting.save()

            return Response(request.data, status=status.HTTP_201_CREATED)
        except:
            return Response(request.data, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        thead = self.get_object(pk)
        thead.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeetingThreadList(APIView):
    """
    List all meeting-threads, or create a new meeting-thread.
    """

    def get(self, request, format=None):
        query_set = MeetingThread.objects.all().order_by("-created_at")
        # if request.user.user_type == UserType.PARTNER:
        #     company_list = CompanyPerson.objects.filter(
        #         person=request.user).values_list('company')
        #     user_filter = Q(organizer=request.user)
        #     company_filter = Q(company__id__in=company_list)
        #     query_set = query_set.filter(user_filter, company_filter)

        serializer = MeetingThreadSerializer(query_set, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        print(request.data)
        serializer = MeetingThreadSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeetingThreadView(APIView):
    """
    Retrieve, update or delete a meeting-thread instance.
    """

    def get_object(self, pk):
        try:
            return MeetingThread.objects.get(pk=pk)
        except Meeting.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        thread_list = self.get_object(pk)
        serializer = MeetingThreadSerializer(thread_list)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        thread_list = self.get_object(pk)
        serializer = MeetingThreadSerializer(
            thread_list, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        meeting = self.get_object(pk)
        meeting.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaskView(APIView):
    def get(self, request, thread_id=None):
        is_completed = request.GET.get("is_completed")
        perticulars = Perticular.objects.all()
        if thread_id:
            # From all meetings that are connected with thread, Retrive all tasks
            meeting_ids = Meeting.objects.filter(meeting_thread=thread_id).values_list(
                "id", flat=True
            )
            perticular_ids = MeetingPerticular.objects.filter(
                meeting__in=meeting_ids
            ).values_list("perticular", flat=True)
            perticulars = perticulars.filter(id__in=perticular_ids)
        if is_completed:
            perticulars = perticulars.filter(is_completed=boolean(is_completed))

        serializer = PerticularSerializer(perticulars, many=True)
        return Response(serializer.data)


class PerticularList(APIView):
    def get(self, request):
        perticular_list = Perticular.objects.all()
        serializer = PerticularSerializer(perticular_list, many=True)
        return Response(serializer.data)


class PerticularView(APIView):
    def get_object(self, pk):
        try:
            return Perticular.objects.get(pk=pk)
        except Meeting.DoesNotExist:
            raise Http404

    def get(self, request, perticular_id):
        perticular = self.get_object(perticular_id)
        serializer = PerticularSerializer(perticular)
        return Response(serializer.data)

    def put(self, request, perticular_id):
        perticular = self.get_object(perticular_id)
        if "completion_date" in request.data:
            request.data["completion_date"] = make_aware(
                datetime.strptime(request.data["completion_date"], "%Y-%m-%d")
            )
            perticular.completion_date = request.data["completion_date"]

        if "title" in request.data:
            perticular.title = request.data["title"]

        if "organizer" in request.data:
            perticular.organizer_id = request.data["organizer"]

        if "is_completed" in request.data:
            perticular.is_completed = request.data["is_completed"]

        if "remark" in request.data:
            perticular.remark = request.data["remark"]

        perticular.save()
        serializer = PerticularSerializer(perticular)
        return Response(serializer.data)

    def post(self, request):
        perticulars = Perticular.objects.create(**request.data)
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, perticular_id):
        perticulars = self.get_object(perticular_id)
        perticulars.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AttendanceList(APIView):
    def get(self, request, meeting_id):
        attendance_list = Attendance.objects.all()
        serializer = AttendanceSerializer(attendance_list, many=True)
        return Response(serializer.data)


class AttendanceView(APIView):
    def get_object(self, pk):
        try:
            return Attendance.objects.get(pk=pk)
        except Meeting.DoesNotExist:
            raise Http404

    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, attendance_id):
        attendance = self.get_object(attendance_id)
        attendance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
