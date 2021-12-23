from os import read
from import_app.models import Company, Vouchers, VoucherItem
from rest_framework import serializers



class CompanyListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = "__all__"



class VoucherListSerializer(serializers.ModelSerializer):
    ledger_name = serializers.SerializerMethodField('get_ledger_name_temp')
    amt_credited = serializers.SerializerMethodField('get_amt_credited')
    amt_debited = serializers.SerializerMethodField('get_amt_debited')

    def get_ledger_name_temp(self, instance):
        return [*VoucherItem.objects.filter(voucher_id__id=instance['id']).values('ledger_name_temp','amt')]
    
    def get_amt_debited(self, instance):
        return [*VoucherItem.objects.filter(type='DR',voucher_id__id=instance['id']).values('amt',)]

    def get_amt_credited(self, instance):
        return [*VoucherItem.objects.filter(type='CR',voucher_id__id=instance['id']).values('amt')]

    class Meta:
        model = Vouchers
        fields = "__all__"

class VoucherItemSerializer(serializers.ModelSerializer):
    voucher_id = VoucherListSerializer(read_only=True)

    class Meta:
        model = VoucherItem
        depth = 1
        fields = "__all__"