from django.urls import path, include
from tally.views import CustomGroupList, CustomGroupView, TrialBalanceList, TrialBalanceView, SyncLedgerData, \
    GroupWithSubGroupsView

urlpatterns = [
    path('cgroup/<str:group_id>/', CustomGroupView.as_view()),
    path('cgroups/', CustomGroupList.as_view()),
    path("trialbalancelist/", TrialBalanceList.as_view()),
    path("trialbalance/<str:tbm_id>/", TrialBalanceView.as_view()),

    path("syncdata/", SyncLedgerData.as_view()),
    path("groupswithsubgroups/", GroupWithSubGroupsView.as_view()),
]