from tally.models import CustomGroup

def get_custom_group(name, company_id, under_id=None):
    try:
        return CustomGroup.objects.get(name=name, company_id=company_id) 
    except CustomGroup.DoesNotExist:
        return CustomGroup.objects.create(name=name, company_id=company_id, under_id=under_id)