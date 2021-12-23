from rest_framework import serializers

from tally.models import Group, CustomGroup, TrialBalance
from import_app.models import Ledgers
from import_app.serializers import CompanyListSerializer

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"
        depth = 2

class CustomGroupSerializer(serializers.ModelSerializer):
    ledger = serializers.SerializerMethodField('get_ledger')
    total_amount = serializers.SerializerMethodField('get_total_amount')

    def get_total_amount(self, instance):
        return sum(Ledgers.objects.filter(under_custom__name=instance.name).values_list('closing_balance', flat=True))

    def get_ledger(self, instance):
        return Ledgers.objects.filter(under_custom__name=instance.name).values()

    class Meta:
        model = CustomGroup
        fields = [ "name", "balance_sheet_type", "company", "under", 'id', 'ledger', 'total_amount']
        depth = 2
 
# class LedgerSerializer(serializers.ModelSerializer):
#     # group = CustomGroupSerializer()
#     class Meta:
#         model = Ledger
#         fields = "__all__"
#         depth = 2


class TrialBalanceSerializer(serializers.ModelSerializer):
    # ledger = LedgerSerializer()
    custom_group = CustomGroupSerializer()
    company = CompanyListSerializer()
    class Meta:
        model = TrialBalance
        fields = "__all__"
        depth = 2


class GroupWithSubGroupsSerializer(serializers.ModelSerializer):
    sub_groups = serializers.SerializerMethodField('get_sub_groups')
    def get_sub_groups(self, instance):
        return CustomGroup.objects.filter(under__name=instance.name).values()

    class Meta:
        model = CustomGroup
        fields = "__all__"
        depth = 2