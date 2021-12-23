from django.http import Http404
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
import json
from datetime import datetime, timedelta
from import_app.models import Company,GSTR1_gst,GSTSalesValues
from reporting.models import  MISReportScheduleEmail, ScheduleConstant, Report, Note, CustomGroup, \
    NoteCustomGroup, ReportNote, ScriptMaster
from reporting.tasks import schedule, crucial_numbers_mail
from minutes_of_meeting.tasks import task_reminder, notify_meeting_close, meeting_reminder
from reporting.serializers import MISReportScheduleEmailSerializer, ReportSerializer, NoteSerializer, \
    ScriptMasterSerializer
class ReportView2(APIView):
    def get(self, request):
        cron = "15 14 * * *" #request.data.get('croninput', '10 02 SAT * *')
        company_id = "" #request.data.get('company_id', 1)
        mis_name = "crucial_numbers" #request.data.get('mis_name', "crucial_numbers_mail" )
        is_daily = True # request.data.get('is_daily', False)
        from_email =  "gaurav@farintsol.com" # request.data.get('from_email', "gaurav@farintsol.com")

        company = Company.objects.get(id=5)
        # print(croninput, company_id, mis_name, is_daily)
        print("In ReportView2")
        se = MISReportScheduleEmail(
            cron = cron,
            company_id = company,
            mis_name = mis_name,
            is_daily = is_daily,
            from_email = from_email
        )
        se.save()

        # FIXME: CALLING FUNCTION DIRECTLY FOR TESTING, AFTER FIXING
        # FOLLOWING CODE WILL BE REMOVED
        # context ={
        #     'mis_report_mail_id' : 7
        # }
        # crucial_numbers_mail_task(**context)

        return Response("Task started", status=status.HTTP_201_CREATED)

class MISReportScheduleEmailView(APIView):
    def get(self, request):
        mis_objects = MISReportScheduleEmail.objects.all()
        serializer = MISReportScheduleEmailSerializer(mis_objects, many=True)
        return Response(serializer.data)

class GSTDiffrenceView(APIView):
    def get(self, request):
        gstr1=GSTR1_gst.objects.all()
        gstsalsevalues=GSTSalesValues.objects.all()
        print(gstr1)
        print(gstsalsevalues)

class TrialBalanceReportView(APIView):
    def get(self, request):
        reports = Report.objects.all()
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)

class NoteList(ListAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class ReportList(ListAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

class ScriptMasterList(ListAPIView):
    queryset = ScriptMaster.objects.all()
    serializer_class = ScriptMasterSerializer

class NoteView(APIView):
    def get_object(self, note_id):
        try:
            return Note.objects.get(id=note_id)
        except Note.DoesNotExist:
            raise Http404

    def get(self, request, note_id):
        note = self.get_object(note_id)
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    def post(self, request, note_id=None):
        try:
            note = Note.objects.create(name=request.data["name"], company_id=request.data["company_id"])
            for group_id in request.data['custom_group_ids']:
                group = CustomGroup.objects.get(id=group_id)
                ncg = NoteCustomGroup.objects.create(note=note, custom_group=group)
            serializer = NoteSerializer(note)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response({"message": "Somthing went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, note_id):
        print(request.data)
        note = self.get_object(note_id)
        if "name" in request.data:
            note.name = request.data["name"]

        if "company_id" in request.data:
            note.company_id = request.data["company_id"]

        if "custom_group_ids" in request.data and request.data['custom_group_ids']:
            current_custom_group_ids = note.custom_groups.all().values_list("id", flat=True)
            new_custom_group_ids = request.data["custom_group_ids"]
            ids_to_add = [cg_id for cg_id in new_custom_group_ids if cg_id not in current_custom_group_ids]
            
            # Add new
            for group_id in ids_to_add:
                NoteCustomGroup.objects.create(note=note, custom_group_id=group_id)
            
            # Remove existing
            if current_custom_group_ids:
                ids_to_remove = [cg_id for cg_id in current_custom_group_ids if cg_id not in new_custom_group_ids]
                NoteCustomGroup.objects.filter(note=note, custom_group_id__in=ids_to_remove).delete()
        else:
            print("No ids")

        note.save()
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    def delete(self, request, note_id):
        note = self.get_object(note_id)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ReportView(APIView):
    def get_object(self, report_id):
        try:
            return Report.objects.get(id=report_id)
        except Note.DoesNotExist:
            raise Http404

    def get(self, request, report_id):
        report = self.get_object(report_id)
        serializer = ReportSerializer(report)
        return Response(serializer.data)

    def post(self, request, report_id=None):
        report = Report.objects.create(name=request.data["name"], company_id=request.data["company_id"])
        for note_id in request.data["note_ids"]:
            note = Note.objects.get(id=note_id)
            rn = ReportNote.objects.create(report=report, note=note)
        serializer = ReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, report_id):
        print(request.data)
        report = self.get_object(report_id)
        if "name" in request.data:
            report.name = request.data["name"]

        if "company_id" in request.data:
            report.company_id = request.data["company_id"]

        if "note_ids" in request.data and request.data['note_ids']:
            current_report_note_ids = report.notes.all().values_list("id", flat=True)
            new_report_note_ids = request.data["note_ids"]
            ids_to_add = [rn_id for rn_id in new_report_note_ids if rn_id not in current_report_note_ids]
            
            # Add new
            for note_id in ids_to_add:
                ReportNote.objects.create(report=report, note_id=note_id)
            
            # Remove existing
            if current_report_note_ids:
                ids_to_remove = [rn_id for rn_id in current_report_note_ids if rn_id not in new_report_note_ids]
                ReportNote.objects.filter(report=report, note_id__in=ids_to_remove).delete()
        else:
            print("No ids")

        report.save()
        serializer = ReportSerializer(report)
        return Response(serializer.data)

    def delete(self, request, report_id):
        report = self.get_object(report_id)
        report.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
class Test(APIView):
    def get(self,request):
        context =  {
            "instance_id": 51,
        }

        meeting_reminder.apply_async(args=[], kwargs=context)
        return Response()
