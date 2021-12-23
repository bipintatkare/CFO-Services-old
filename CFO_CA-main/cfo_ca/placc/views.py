import json

from django.db.models import Sum
from django.http import QueryDict, HttpResponse
from django.shortcuts import render, redirect
from django.db.models import Q
from .forms import PlaccForm
from .models import PLACC, Tally_mapping, Company, Mapping_Company_notes_report, NOTES, REPORTS, \
    Mapping_Company_tally_notes


def pl(request):
    list = PLACC.objects.filter(~Q(final=None),~Q(final=0.0)).order_by('id')
    list_ids = PLACC.objects.filter(Q(final=None),Q(final=0.0)).order_by('id')
    mapped_count = PLACC.objects.filter(is_mapped=True).count()
    unmapped_count = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),~Q(is_mapped=True)).count()
    list_ids = PLACC.objects.filter(Q(final=None),Q(final=0.0000)).order_by('id')
    # id=PLACC.objects.all()[0:1].get()
    id = PLACC.objects.first()
    tally_ids=Tally_mapping.objects.all()  #.values_list('name')
    print(list)
    for i in list_ids:
        print(id.pk)
        # PLACC.objects.get(id=i.pk).delete()





    form = PlaccForm(request.POST or None)
    if request.method =='POST':
        mapping = request.POST.get('description')
        map = request.POST
        dd=str(map)
        xx=dd[11:-2]
        val=xx.split("'description': ", 1)[1]
        res = val.strip('][').replace("'", "").split(', ')
        print(res)
        start = id.pk
        for item in res:
            print(item)
            if not item==1:
                PLACC.objects.filter(id=start).update(tally_mapping_primary=item)
            start=start+1


        return redirect('/hhh')
    # print(tally_ids)
    # print(tally_ids)
    # print(tally_ids)
    context={
        'list':list,
        'form':form,
        'tally_ids':tally_ids,
        'mapped_count':mapped_count,
        'unmapped_count':unmapped_count
    }

    return render(request, "pl.html", context)

def profitloss(request):
    list = PLACC.objects.all()[:20]
    form = PlaccForm(request.POST or None)
    if request.method =='POST':
        # print(request.POST)
        mapping = request.POST.get('description')
        mapping = request.POST



        return redirect('/hhh')
    context={
        'list':list,
        'form':form
    }

    return render(request, "pl.html", context)

def travel(request):
    list = PLACC.objects.filter(description='Travelling and coveyance').aggregate(Sum('final'))['final_sum']
    print(list)

    context={
        'list':list,

    }

    return render(request, "pl.html", context)


def dashtest(request):
    return render(request, "dashtest.html")

def select_dropdown(request):
    data_rec = request.GET.get('item_id')
    data_first=data_rec.split('---')[0]
    data_last=data_rec.split('---')[1]
    item=PLACC.objects.get(id=data_first)
    item.tally_mapping_primary=data_last
    item.save(update_fields=['tally_mapping_primary',])

    return HttpResponse('<h1>response</h1>')


def mapdataprimary(request,id):
    item = PLACC.objects.get(id=id).tally_mapping_primary
    list_data = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),tally_mapping_primary=item)

    context={
        'list_data':list_data,
        'item':item
    }


    return render(request, "mapdataprimary.html", context)

def drag(request):
    list_notes = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), ~Q(notes_mapping=None)).values_list(
        'notes_mapping')
    final_list = []
    for item in list_notes:
        if item not in final_list:
            final_list.append(item)

    sum_list = []
    for item in final_list:
        print(item[0])
        sum_list.append(PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), notes_mapping=item[0]))

    sum_data = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), ~Q(notes_mapping=None)).values(
        'notes_mapping').annotate(data_sum=Sum('final'))
    this_lis_date = []
    this_lis_sum = []
    for i in sum_data:
        x = i
        this_lis_date.append(x['notes_mapping'])
        this_lis_sum.append(x['data_sum'])

    list_of_final = zip(this_lis_date, this_lis_sum)
    list_of_final_t = zip(this_lis_date, this_lis_sum, sum_list)
    print('list_of_final')
    print('list_of_final')
    print(list_of_final)
    context = {
        'sum_data': sum_data,
        'sum_list': sum_list,
        'list_of_final': list_of_final,
        'list_of_final_t': list_of_final_t,

    }


    return render(request, "drag.html",context)

def mapdataparent(request,id):
    item = PLACC.objects.get(id=id).tally_mapping_parent
    list_data = PLACC.objects.filter(~Q(final=None),~Q(final=0.0),tally_mapping_parent=item)
    list_ids = PLACC.objects.filter(Q(final=None), Q(final=0.0000)).order_by('id')
    # id=PLACC.objects.all()[0:1].get()
    id = PLACC.objects.first()
    tally_ids = Tally_mapping.objects.all()  # .values_list('name')
    print(list)
    for i in list_ids:
        print(id.pk)
        PLACC.objects.get(id=i.pk).delete()

    tally_rec_mapping=PLACC.objects.all().values_list('tally_mapping_primary')
    default_mapping_list = Tally_mapping.objects.all().values_list('name')  #PLACC.objects.all().values_list('tally_mapping')
    default_mapping_final_list = []
    objects = []
    # company_name_fk = Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED')
    # company_name_pk = Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED').pk
    print(default_mapping_list)
    for data in tally_rec_mapping:
        if data not in default_mapping_list:
            # default_mapping_final_list.append(data)
            objects.append(Tally_mapping(name=str(data)[2:-3],))

    count=Tally_mapping.objects.all().count()

    if count<40:
        try:
            Tally_mapping.objects.bulk_create(objects)
        except:
            pass

    map_list_report=Mapping_Company_notes_report.objects.all()

    notes_list = NOTES.objects.all()
    reports_list = REPORTS.objects.all()


    map_list=Mapping_Company_tally_notes.objects.all()
    default_mapping_list = Tally_mapping.objects.all()


    # if request.method == 'POST' and 'tally_mapping' in request.POST:
    #     tally = request.POST.get('tally_mapping')
    #     note = request.POST.get('note_mapping')
    #
    #     if Mapping_Company_tally_notes.objects.filter(Q(Tally_Mapping=Tally_mapping.objects.get(name=tally))).count() > 0:
    #         item=Mapping_Company_tally_notes.objects.get(Tally_Mapping=Tally_mapping.objects.get(name=tally))
    #         # item.Company_Name=Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED')
    #         # item.Tally_Mapping=tally
    #         item.Notes_Mapping=NOTES.objects.get(name=note)
    #         item.save(update_fields=['Notes_Mapping', ])
    #     else:
    #         item = Mapping_Company_tally_notes()
    #         item.Company_Name=Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED')
    #         item.Tally_Mapping=Tally_mapping.objects.get(name=tally)
    #         item.Notes_Mapping = NOTES.objects.get(name=note)
    #         item.save()
    #
    #     map_list_report = Mapping_Company_notes_report.objects.all()
    #
    #     notes_list = NOTES.objects.all()
    #     reports_list = REPORTS.objects.all()
    #     map_list = Mapping_Company_tally_notes.objects.all()
    #     default_mapping_list = Tally_mapping.objects.all()
    #
    #     context = {
    #         'notes_list': notes_list,
    #         'reports_list': reports_list,
    #         'map_list': map_list,
    #         'map_list_report': map_list_report,
    #         'default_mapping_list': default_mapping_list,
    #     }
    #
    #     return render(request, "mappingcomp.html", context)

    if request.method == 'POST' and 'report' in request.POST:
        note = request.POST.get('note')
        report = request.POST.get('report')
        of_which = request.POST.get('of_which')
        # list_data = PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), tally_mapping_parent=of_which)
        PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), tally_mapping_parent=of_which).update(tally_mapping_primary=note)
        PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), tally_mapping_parent=of_which).update(tally_mapping_parent=report)
        PLACC.objects.filter(~Q(final=None), ~Q(final=0.0), tally_mapping_parent=of_which).update(is_mapped=True)
        print("sucesss")

        # list_ids = PLACC.objects.filter(Q(final=None), Q(final=0.0000)).order_by('id')
        # # id=PLACC.objects.all()[0:1].get()
        # id = PLACC.objects.first()
        # tally_ids = Tally_mapping.objects.all()  # .values_list('name')
        # print(list)
        # for i in list_ids:
        #     print(id.pk)
        #     PLACC.objects.get(id=i.pk).delete()

        # if request.method == 'POST' and 'report_mapping' in request.POST:
        #     report = request.POST.get('report_mapping')
        #     note = request.POST.get('note_mapping')
        #     if Mapping_Company_notes_report.objects.filter(Q(Notes_Mapping=NOTES.objects.get(name=note))).count() > 0:
        #         item = Mapping_Company_notes_report.objects.get(Notes_Mapping=NOTES.objects.get(name=note))
        #         # item.Company_Name = Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED')
        #         item.Report_Mapping = REPORTS.objects.get(name=report)
        #         # item.Notes_Mapping = NOTES.objects.get(name=note)
        #         item.save(update_fields=['Report_Mapping', ])
        #     else:
        #         item=Mapping_Company_notes_report()
        #         item.Company_Name=Company.objects.get(Company_Name='NOBLE RESOURCES AND TRADING INDIA PRIVATE LIMITED')
        #         item.Report_Mapping=REPORTS.objects.get(name=report)
        #         item.Notes_Mapping=NOTES.objects.get(name=note)
        #         item.save()
        #
        #     map_list_report = Mapping_Company_notes_report.objects.all()
        #
        #     notes_list = NOTES.objects.all()
        #     reports_list = REPORTS.objects.all()
        #     map_list = Mapping_Company_tally_notes.objects.all()
        #     default_mapping_list = Tally_mapping.objects.all()
        #     context = {
        #         'notes_list': notes_list,
        #         'reports_list': reports_list,
        #         'map_list': map_list,
        #         'map_list_report': map_list_report,
        #         'default_mapping_list': default_mapping_list,
        #     }
        #
        #     return render(request, "mappingcomp.html", context)

        # if request.method == 'POST':
        #     mapping = request.POST.get('description')
        #     map = request.POST
        #     dd = str(map)
        #     xx = dd[11:-2]
        #     val = xx.split("'description': ", 1)[1]
        #     res = val.strip('][').replace("'", "").split(', ')
        #     print(res)
        #     start = id.pk
        #     for item in res:
        #         print(item)
        #         if not item == 1:
        #             PLACC.objects.filter(id=start).update(tally_mapping_primary=item)
        #         start = start + 1
        #
        #     return redirect('/hhh')
        # print(tally_ids)
        # print(tally_ids)
        # print(tally_ids)

        context = {
            'list': list,
            'tally_ids': tally_ids
        }

        return redirect('/pl/')


    context={
        'notes_list': notes_list,
        'reports_list': reports_list,
        'map_list': map_list,
        'map_list_report': map_list_report,
        'default_mapping_list': default_mapping_list,
        'list_data':list_data,
        'item':item,
        'tally_ids':tally_ids
    }
    return render(request, "mapdataparent.html", context)
