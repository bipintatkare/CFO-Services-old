"""cfo_ca URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from import_app.views import sales_report_mail, sales_report_mail_image, sales_report_mail_show,testing_views
from django.conf.urls.static import static
from . import settings
from rest_framework import permissions


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/testing_data/",testing_views),
    path('api/v1/rf/', include('rest_framework.urls')),
    path('api/v1/', include('import_app.urls')),
    path('flutter_api/v1/', include('flutter_api.urls')),
    path('sales_report_mail/<str:company_id>', sales_report_mail.as_view()),
    path('sales_report_mail_image', sales_report_mail_image.as_view()),
    path('sales_report_mail_show', sales_report_mail_show.as_view()),
    path('mom/', include('minutes_of_meeting.urls')),
    path('reporting/', include('reporting.urls')),
    path('tl/', include('tally.urls')),
]

urlpatterns = urlpatterns + \
    static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns = urlpatterns + \
    static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns = urlpatterns + [
    path('', include('user.urls')),
    path('', include('placc.urls')),
]
