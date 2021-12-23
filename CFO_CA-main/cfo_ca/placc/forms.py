from django import forms

from .models import PLACC

Mapping_data = (
    ('1',''),
    ('Accrued interest on NSC','Accrued interest on NSC'),
('Accumalated Depreciation','Accumalated Depreciation'),
('Advance Income Tax','Advance Income Tax'),
('Advance Wealth Tax','Advance Wealth Tax'),
('Loan Receivables - Short Term','Loan Receivables - Short Term'),
('Bank Charges','Bank Charges'),
('Bank Current Account','Bank Current Account'),
('Business Promotion','Business Promotion'),
('Communication','Communication'),
('Contribution to Provident and other fund','Contribution to Provident and other fund'),
('Depreciation','Depreciation'),
('Electricity & Water Charges','Electricity & Water Charges'),
('Debit Balances written off','Debit Balances written off'),
('Exchange difference','Exchange difference'),
('Fixed Assets','Fixed Assets'),
('Fixed Deposits with Bank','Fixed Deposits with Bank'),
('Gifts and donations (CSR Expd)','Gifts and donations (CSR Expd)'),
('Good Debtors','Good Debtors'),
('Interest Income','Interest Income'),
('Legal & Professional','Legal & Professional'),
('Loss on sale of Fixed Assets','Loss on sale of Fixed Assets'),
('Membership and subscriptions','Membership and subscriptions'),
('Advances to suppliers','Advances to suppliers'),
('Petty Cash','Petty Cash'),
('Prepaid Expenses','Prepaid Expenses'),
('Printing and stationery','Printing and stationery'),
('Professional Exps- Inter co','Professional Exps- Inter co'),
('Provision for doubtful debts/advances written back','Provision for doubtful debts/advances written back'),
('Professional tax payable','Professional tax payable'),
('Provision for Gratuity','Provision for Gratuity'),
('Provision for income tax','Provision for income tax'),
('Provision for doubtful debts & advances - Exp.','Provision for doubtful debts & advances - Exp.'),
('Rates & Taxes','Rates & Taxes'),
('Rent','Rent'),
('Repair & Maintainance','Repair & Maintainance'),
('Provision for Leave salary','Provision for Leave salary'),
('Excess provisions written back/ Misc inc','Excess provisions written back/ Misc inc'),
('Sales tax receivable','Sales tax receivable'),
('Security Deposits','Security Deposits'),
('Service Tax Payables','Service Tax Payables'),
('Staff training and recruitment','Staff training and recruitment'),
('Staff Welfare Expenses','Staff Welfare Expenses'),
('Share Capital','Share Capital'),
('Tax Current Year Income Tax','Tax Current Year Income Tax'),
('TDS Payable','TDS Payable'),
('TDS Receivable','TDS Receivable'),
('Inter Branch','Inter Branch'),
('Travelling and coveyance','Travelling and coveyance'),
('VAT Receivables','VAT Receivables'),
('Vehicle Running & Maintainance','Vehicle Running & Maintainance'),
('Wealth Tax Payable','Wealth Tax Payable'),
('Insurance','Insurance'),
('General Expenses','General Expenses'),
('GST Receivable','GST Receivable'),
('GST Payable','GST Payable'),
('Payable to employees','Payable to employees'),
('Payable for expenses','Payable for expenses'),
('Reserve & Surplus','Reserve & Surplus'),
('Salaries & Wages','Salaries & Wages'))


Notes_data = (('data 1','data 1'),
('data 2','data 2'),
('data 3','data 3'),
('data 4','data 4'))


mapping_data = (('data 1','data 1'),
('data 2','data 2'),
('data 3','data 3'),
('data 4','data 4'))


class PlaccForm(forms.ModelForm):
    description = forms.CharField(
        widget=forms.Select(choices=Mapping_data,
                            attrs={
                                'type': 'text ',
                                'class': 'form-control',
                                'name': 'mapping',
                            }))
    class Meta:
        model = PLACC
        fields = ('description',
                  'debit',
                  'credit',
                  'final',
                  'tally_mapping_primary',
                  'tally_mapping_parent',
                  'new_mapping',
                  'notes_mapping',
                  'report_mapping',)



# class mappingcompForm(forms.ModelForm):
#     notes = forms.CharField (
#         widget=forms.Select(choices=Notes_data,
#                             attrs={
#                                 'type': 'text ',
#                                 'class': 'form-control',
#                                 'name': 'notes',
#                             }))
#
#
#
#     class Meta:
#         model = mappingcompfield
#         fields = ('notes',)
#
#
# class mappingcompForm(forms.ModelForm):
#     notes = forms.CharField (
#         widget=forms.Select(choices=Notes_data,
#                             attrs={
#                                 'type': 'text ',
#                                 'class': 'form-control',
#                                 'name': 'notes',
#                             }))
#
#
#
#     class Meta:
#         model = mappingcompfield
#         fields = ('notes',)


class mapping_comp(forms.ModelForm):
    Company_Name_FK = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                'name': 'Compay Name',
            }))

    Tally_Mapping = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                'name': 'Tally Mapping',
            }))

    Notes_Mapping = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                'name': 'Notes Mapping',
            }))

    Report_Mapping = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                'name': 'Report Mapping',
            }))




# class Mapping_Data_Form(forms.ModelForm):
#     value = forms.CharField(
#         widget=forms.TextInput(
#             attrs={
#                 'type': 'text',
#                 'class': 'form-control',
#                 'name': 'Report Mapping',
#             }))
#
#     field = forms.CharField (
#         widget=forms.Select(choices=mapping_data,
#                             attrs={
#                                 'type': 'text ',
#                                 'class': 'form-control',
#                                 'name': 'notes',
#                             }))
#
#
#
#     class Meta:
#         model = Mapping_Data
#         fields = ('field',)
