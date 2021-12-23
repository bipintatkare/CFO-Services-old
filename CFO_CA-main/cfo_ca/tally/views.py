from django.shortcuts import render
from tally.models import Group, CustomGroup, TrialBalance, Ledger
from tally.serializers import GroupSerializer, CustomGroupSerializer, TrialBalanceSerializer, \
    GroupWithSubGroupsSerializer
from rest_framework.generics import ListAPIView
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.http import Http404
from import_app.models import Ledgers as NewLedger
from tally.utils import get_custom_group

class CustomGroupList(APIView):
    def get(self, request):
        queryset = CustomGroup.objects.all()
        serializer = CustomGroupSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        try:
            group = CustomGroup.objects.create(name=data["name"], balance_sheet_type=data["balance_sheet_type"], company_id=data["company"], under_id=data["under"])
            serializer = CustomGroupSerializer(group, many=False)
            return Response(serializer.data)
        except:
            return Response({"message": "Something went wrong"})
        

class CustomGroupView(APIView):
    def get_object(self, pk):
        try:
            return CustomGroup.objects.get(pk=pk)
        except Group.DoesNotExist:
            raise Http404

    def get(self, request, group_id):
        group_obj = self.get_object(group_id)
        serializer = CustomGroupSerializer(group_obj)
        return Response(serializer.data)

    def post(self, request, group_id=None):
        group = CustomGroup.objects.create(name=request.data["name"], company_id=request.data["company_id"])       
        if 'under' in request.data:
            under = CustomGroup.objects.get(id=request.data["under"])
            group.under = under
        
        group.save()
        serializer = CustomGroupSerializer(group)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, group_id):
        group = self.get_object(group_id)
        if 'under' in request.data:
            # print(request.data["primary"])
            u_group = CustomGroup.objects.get(id=request.data["under"])
            group.under = u_group
    
        if 'name' in request.data:
            name = request.data['name']
            group.name = name
        
        group.save()
        serializer = CustomGroupSerializer(group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def delete(self, request, group_id):
        group_obj = self.get_object(group_id)
        group_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TrialBalanceList(APIView):
    def post(self, request):
        data = request.data
        print(data['selected_companies'])
        print(data)
        trial_balance_qs = TrialBalance.objects.filter(company_id__in=data['selected_companies'])
        serializer = TrialBalanceSerializer(trial_balance_qs, many=True)
        return Response(serializer.data)

class TrialBalanceView(APIView):
    def get_object(self, pk):
        try:
            return TrialBalance.objects.get(pk=pk)
        except TrialBalance.DoesNotExist:
            raise Http404

    def get(self, request, tbm_id):
        trial_bal = self.get_object(tbm_id)
        serializer = TrialBalanceSerializer(trial_bal)
        return Response(serializer.data)

    def post(self, request, tbm_id=None):
        data = request.data
        try:
            trial_bal = TrialBalance.objects.create(ledger_id=data['ledger'], custom_group_id=data["custom_group"])
            serializer = TrialBalanceSerializer(trial_bal)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response({"message": "Something went wrong"})

    def put(self, request, tbm_id):
        trial_bal = self.get_object(pk=tbm_id)
        data = request.data
        custom_group = trial_bal.custom_group
        
        # Parent Group
        if ("custom_parent_group" in data):
            parent_group = CustomGroup.objects.get(id=data["custom_parent_group"])
            trial_bal.custom_group = parent_group
            trial_bal.save()

        # Sub Groups 
        if ("custom_groups" in data):
            parent_group = trial_bal.custom_group
            for cg_id in data['custom_groups']:
                group = CustomGroup.objects.get(id=cg_id)
                group.under = parent_group
                group.save()
 
        if "ledger" in data:
            trial_bal.ledger = Ledger.objects.get(id=data["ledger"])
        
        trial_bal.save()
        serializer = TrialBalanceSerializer(trial_bal)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, tbm_id):
        trial_bal = self.get_object(tbm_id)
        trial_bal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SyncLedgerData(APIView):
    def get(self, request): 
        print(">>>>>>>>>>>>> All Ledgers data synced : ")
        for ledger in NewLedger.objects.all():
            parent_group = get_custom_group(name=ledger.parent_str, company_id=ledger.company_id_id)
            primary_group = get_custom_group(name=ledger.primary_group_str, company_id=ledger.company_id_id, under_id=parent_group.id)
            print(parent_group, primary_group)
        print("Complated!")
        return Response(status.HTTP_204_NO_CONTENT)


class GroupWithSubGroupsView(ListAPIView):
    queryset = CustomGroup.objects.exclude(under__isnull=False)
    serializer_class = GroupWithSubGroupsSerializer