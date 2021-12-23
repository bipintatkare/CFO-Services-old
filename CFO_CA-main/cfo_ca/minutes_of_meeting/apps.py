from django.apps import AppConfig


class MinutesOfMeetingConfig(AppConfig):
    name = 'minutes_of_meeting'

    def ready(self):
        import minutes_of_meeting.signals
