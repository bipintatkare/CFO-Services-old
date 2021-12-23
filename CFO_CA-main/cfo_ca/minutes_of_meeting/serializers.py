from rest_framework import serializers
from minutes_of_meeting.models import Meeting, MeetingThread, Perticular, MeetingUser, MeetingPerticular, \
    RecurringMeeting
from import_app.models import Company
from import_app.serializers import CompanyListSerializer
from user.models import SiteUser
from user.serializers import SiteUserListSerializer
from django.conf import settings

class MeetingThreadSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(
        required=True, allow_blank=False, max_length=70
    )
    summary = serializers.CharField(
        required=True, allow_blank=False, max_length=70
    )
    organizer = serializers.PrimaryKeyRelatedField(
        queryset=SiteUser.objects.all())

    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all()
    )

    organizer_name = serializers.SerializerMethodField('get_organizer_name')
    company_name = serializers.SerializerMethodField('get_company_name')
    task_status = serializers.SerializerMethodField('get_task_status')
    
    def get_company_name(self, mThread):
        if mThread.company:
            return f'{mThread.company.company_name}'
        else:
            return None

    def get_organizer_name(self, mThread):
        return f'{mThread.organizer.first_name} {mThread.organizer.last_name}'

    def get_task_status(self, mThread):
        qs1 = MeetingPerticular.objects.filter(meeting__meeting_thread=mThread.id)
        qs2 = qs1.filter(perticular__is_completed=True)
        return f"{qs2.count()} of out {qs1.count()}"

    created_at = serializers.DateTimeField(format="%d/%m/%Y", required=False)

    class Meta:
        model = MeetingThread
        fields = ('id', 'title', 'summary', 'organizer', 'company',
                  'created_at', 'organizer_name')

    def create(self, validated_data):
        return MeetingThread.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.summary = validated_data.get('summary', instance.summary)
        instance.organizer = validated_data.get(
            'organizer', instance.organizer)
        instance.company = validated_data.get('company', instance.company)
        instance.save()
        return instance



class PerticularSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(
        required=True, allow_blank=False, max_length=70
    )
    organizer = serializers.PrimaryKeyRelatedField(
        queryset=SiteUser.objects.all())
    organizer_name = serializers.SerializerMethodField('get_organizer_name')
    organizer_email = serializers.SerializerMethodField('get_organizer_email')

    def get_organizer_name(self, perticular):
        return f'{perticular.organizer.first_name} {perticular.organizer.last_name}'
    
    def get_organizer_email(self, perticular):
        return f'{perticular.organizer.email}'

    completion_date = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")
    remark = serializers.CharField(
        required=True, allow_blank=False, max_length=70
    )

    is_completed = serializers.BooleanField()

    meeting = serializers.SerializerMethodField('get_meeting')

    def get_meeting(self, objPerticular):
        try:
            meeting = objPerticular.meeting_set.get()
            context = {
                "title": meeting.title,
                "id": meeting.id
            }
            return context
        except:
            return {}

    class Meta:
        model = Perticular
        fields = ('id', 'title', 'organizer', 'completion_date', 'organizer_email',
                  'remark', 'is_completed', 'organizer_name', 'meeting')

class MeetingUserSerializer(serializers.ModelSerializer):
    attendee = SiteUserListSerializer(many=False)
    class Meta:
        model = MeetingUser
        fields = '__all__'


class MeetingPerticularSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingPerticular
        fields = '__all__'

class RecurringMeetingSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecurringMeeting
        fields = '__all__'

class MeetingSerializer(serializers.ModelSerializer):
    meeting_thread = MeetingThreadSerializer()
    perticular = PerticularSerializer(many=True)
    attendee = MeetingUserSerializer(many=True)
    m_date = serializers.DateTimeField(format="%d/%m/%Y")
    created_at = serializers.DateTimeField(format="%d/%m/%Y")


    thread_name = serializers.SerializerMethodField('get_thread_name')
    def get_thread_name(self, objMeeting):
        if objMeeting.meeting_thread:
            return f'{objMeeting.meeting_thread.title}'
        else:
            return None

    class Meta:
        model = Meeting
        fields = '__all__'