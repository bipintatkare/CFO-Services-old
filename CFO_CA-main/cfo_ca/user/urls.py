from django.contrib import admin
from django.urls import path, include, re_path

from .views import home, UsersList, mis, darftp, fdfbo, ffsftp, lbob, pcftp, plaws, login, register, plandbl, notes, mapping, mappingcomp, notemapping, plandbl_test, notes_test, darftp_test

from .views import LoginView, SignupView, LogoutView, ProfileView, PasswordResetView, \
    test_mail, download, UsersByUser, SiteUserView

urlpatterns = [
    path('', home, name='home'),
    # path('api/v1/auth/',include('rest_framework.urls')),
    path('api/v1/site_users_list', UsersList.as_view()),
    path('api/v1/site_user_list/<str:user_id>/', UsersByUser.as_view()), #All users under <user_id>
    path('api/v1/site_user/<str:user_id>/', SiteUserView.as_view()),
    path('api/v1/login', LoginView.as_view()),
    path('api/v1/sign-up', SignupView.as_view()),
    path('api/v1/logout', LogoutView.as_view()),
    path('api/v1/profile', ProfileView.as_view()),
    path('api/v1/reset-password/<str:param>/', PasswordResetView.as_view()),
    # path('api/v1/test_mail', test_mail),
    path('api/v1/download-application/', download, name='download-application'),

    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('mis/', mis, name='mis'),
    path('darftp/', darftp_test, name='darftp'),
    path('darftp_test/', darftp, name='darftp'),
    path('fdfbo/', fdfbo, name='fdfbo'),
    path('ffsftp/', ffsftp, name='ffsftp'),
    path('lbob/', lbob, name='lbob'),
    path('pcftp/', pcftp, name='pcftp'),
    path('plaws/', plaws, name='plaws'),
    path('plandbl/', plandbl, name='plandbl'),
    path('plandbl_test/', plandbl_test, name='plandbl_test'),
    path('notes/', notes, name='notes'),
    path('notes_test/', notes_test, name='notes_test'),
    path('notemapping/', notemapping, name='notemapping'),
    path('mapping/', mapping, name='mapping'),
    path('mappingcomp/', mappingcomp, name='mappingcomp'),
]

urlpatterns += [

    re_path(r'^(?:.*)/?$', home),
]
