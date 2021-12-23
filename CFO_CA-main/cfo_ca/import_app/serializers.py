from django.conf import settings
from django.db import transaction
from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from import_app.models import Company, TrialBalanceMapping, TrialBalance, Group, ParentGroup, \
    Ledgers, BSItem, BalanceSheet, DateWiseLedger, VoucherItem, Vouchers
from tally.models import CustomGroup
from tally.models import Group as TallyGroup

class CompanyListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = [
            "id",
            "company_name",
            "sync_from_user",
            "sync_timedate",
            "auto_timedate",
        ]


class GSTR1Serializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = [
            "id",
            "company_name",
            "sync_from_user",
            "sync_timedate",
            "auto_timedate",
        ]


class ParentGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentGroup
        fields = ["id", "name"]


class GroupSerializer(serializers.ModelSerializer):
    primary = ParentGroupSerializer(many=False)

    class Meta:
        model = Group
        fields = ["id", "name", "primary"]


class TrialBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrialBalance
        fields = "__all__"

def serialize_ledger(ledger: Ledgers):
    try:
        under = TallyGroup.objects.filter(id=ledger.under_custom_id).values()[0]
    except:
        under = {}

    try:
        custom_under = CustomGroup.objects.filter(id=ledger.under_custom_id).values()[0]
    except:
        custom_under = {}

    try:
        groups = TallyGroup.objects.filter(under__name=ledger.under.name).values()
    except:
        groups = []

    try:
        custom_groups = CustomGroup.objects.filter(under__name=ledger.under_custom.name).values()
    except:
        custom_groups = []

    obj =  {
        'id': ledger.id,
        'company_name': Company.objects.get(id=ledger.company_id_id).company_name,
        'name': ledger.name,
        'under_custom': ledger.under_custom_id,
        'under': under,
        'custom_under': custom_under,
        'groups' : groups,
        'custom_groups' : custom_groups,
        'opening_balance' : ledger.opening_balance,
        'closing_balance' : ledger.closing_balance
    }
    return obj

def serialize_ledger_for_queries(ledger: Ledgers):
    try:
        under = TallyGroup.objects.filter(id=ledger.under_custom_id).values()[0]
    except:
        under = {}
        
    obj =  {
        'id': ledger.id,
        'company_name': Company.objects.get(id=ledger.company_id_id).company_name,
        'name': ledger.name,
        'under': under,
        'opening_balance' : ledger.opening_balance,
        'closing_balance' : ledger.closing_balance
    }
    return obj

    

class DateWiseLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = DateWiseLedger
        fields = ["ledger_id"]
        depth = 1
class TrialBalanceMappingSerializer(serializers.ModelSerializer):
    trial_balance = TrialBalanceSerializer(many=False)
    groups = GroupSerializer(many=True)
    parent_group = ParentGroupSerializer(many=False)
    custom_parent_group = ParentGroupSerializer(many=False)
    custom_group = GroupSerializer(many=False)

    class Meta:
        model = TrialBalanceMapping
        fields = "__all__"

class BalanceSheetSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField('get_custom_groups')
    ledger = serializers.SerializerMethodField('get_ledger')
    parent_group = serializers.SerializerMethodField('get_parent_group')

    def get_custom_groups(self, instance):
        return CustomGroup.objects.filter(under__name=instance.head_name).values()

    def get_ledger(self, instance):
        return Ledgers.objects.filter(parent_str=instance.head_name).values()

    def get_parent_group(self, instance):
        return CustomGroup.objects.filter(name=instance.head_name).values()
    class Meta:
        model = BalanceSheet
        fields = "__all__"

class BSItemSerializer(serializers.ModelSerializer):
    bs = BalanceSheetSerializer()
    class Meta:
        model = BSItem

class VouchersSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField('get_company_name')
    def get_company_name(self, instance):
        return instance.company_id.company_name

    class Meta:
        model =  Vouchers
        fields = "__all__"
class VoucherItemSerializer(serializers.ModelSerializer):
    voucher_id = VouchersSerializer()
    class Meta:
        model = VoucherItem
        fields = "__all__"
