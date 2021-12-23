from __future__ import absolute_import
from celery import shared_task
from django.core.mail import EmailMessage, send_mail
from django.template.loader import get_template, render_to_string
from django.utils.html import strip_tags
from django.conf import settings


@shared_task(name="send_user_credentials")
def send_user_credentials(*args, **user):
    subject = f"Welcome {user['first_name']} {user['last_name']}!"
    context = {
        'name': f"{user['first_name']} {user['last_name']}",
        'username': user['email'],
        'password': user['raw_password'],
        'login_url': f"{settings.CFOSERVER_BASE_URL}/login/",
        "linkedin_icon_url": f"{settings.CFOSERVER_BASE_URL}/static/img/linkedin2x.png",
        "cfo_logo_url":  f"{settings.CFOSERVER_BASE_URL}/static/img/cfo-logo.png"

    }
    html_content = get_template('send_credential_email.html')
    html = html_content.render(context)
    mail = EmailMessage(
        subject,
        html,
        settings.EMAIL_HOST_USER,
        [user['email']]
    )
    mail.content_subtype = 'html'
    mail.send()


@shared_task(name="forget_password")
def forget_password(*args, **user):
    print(user)
    subject = f"Welcome {user['first_name']} {user['last_name']}"
    context = {
        'username': f"{user['first_name']} {user['last_name']}",
        'reset_password_link': f"{settings.CFOSERVER_BASE_URL}/change-password/{user['id']}/",
        "linkedin_icon_url": f"{settings.CFOSERVER_BASE_URL}/static/img/linkedin2x.png",
        "cfo_logo_url":  f"{settings.CFOSERVER_BASE_URL}/static/img/cfo-logo.png"
    }
    html_content = get_template('forget_password.html')
    html = html_content.render(context)
    mail = EmailMessage(
        subject,
        html,
        settings.EMAIL_HOST_USER,
        [user['email']]
    )
    mail.content_subtype = 'html'
    mail.send()
