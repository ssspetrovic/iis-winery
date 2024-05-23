from django import forms

class ContractSignForm(forms.Form):
    signature = forms.CharField(max_length=255, lable='Your Signature')