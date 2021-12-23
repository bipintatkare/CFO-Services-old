from django.conf import settings
from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from reporting.models import MISReportScheduleEmail, Note, Report, NoteCustomGroup, ReportNote, ScriptMaster
from tally.serializers import CustomGroupSerializer

class MISReportScheduleEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = MISReportScheduleEmail
        fields = [
            'company_id',
            'mis_name',
            'days',
            'is_daily',
            'from_email'
        ]


class NoteSerializer(serializers.ModelSerializer):
    custom_groups = CustomGroupSerializer(many=True)
    total_amount = serializers.SerializerMethodField('get_total_amount')

    def get_total_amount(self, instance):
        groups = CustomGroupSerializer(instance.custom_groups.all(), many=True)
        return sum([group["total_amount"] for group in groups.data])

    class Meta:
        model = Note
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True)
    total_amount = serializers.SerializerMethodField('get_total_amount')

    def get_total_amount(self, instance):
        notes = NoteSerializer(instance.notes.all(), many=True)
        return sum([note["total_amount"] for note in notes.data])

    class Meta:
        model = Report
        fields = '__all__'

class NoteCustomGroupSerializer(serializers.ModelSerializer):
    note = NoteSerializer()
    custom_group = CustomGroupSerializer()

    class Meta:
        model = NoteCustomGroup
        fields = '__all__'


class ReportNoteSerializer(serializers.ModelSerializer):
    report = ReportSerializer()
    note = NoteSerializer()

    class Meta:
        model = ReportNote
        fields = '__all__'

class ScriptMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScriptMaster
        fields = "__all__"