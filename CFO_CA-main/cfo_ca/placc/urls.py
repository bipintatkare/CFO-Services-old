from django.contrib import admin
from django.urls import path,include

from .views import pl, select_dropdown, dashtest
from .views import pl, select_dropdown, mapdataprimary, mapdataparent, drag

urlpatterns = [
    # path('', home,name='home'),
    path('pl/', pl,name='pl'),
    path('select_dropdown/', select_dropdown,name='select_dropdown'),
    path('dashtest/', dashtest,name='dashtest'),
    path('drag/', drag,name='drag'),
    path('mapdataprimary/<str:id>', mapdataprimary,name='mapdataprimary'),
    path('mapdataparent/<str:id>', mapdataparent,name='mapdataparent'),
]
