from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import CollegeProfile

class CollegeSignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user

class CollegeProfileForm(forms.ModelForm):
    class Meta:
        model = CollegeProfile
        fields = ('college_name', 'college_code', 'address', 'contact_number',
                 'website', 'established_year', 'principal_name', 'principal_email',
                 'total_students', 'total_faculty')
        widgets = {
            'address': forms.Textarea(attrs={'rows': 3}),
            'established_year': forms.NumberInput(attrs={'min': 1800, 'max': 2100}),
            'total_students': forms.NumberInput(attrs={'min': 0}),
            'total_faculty': forms.NumberInput(attrs={'min': 0}),
        }

    def clean_college_code(self):
        code = self.cleaned_data.get('college_code')
        if code:
            # Check if college code exists for other profiles
            exists = CollegeProfile.objects.filter(college_code=code).exclude(user=self.instance.user).exists()
            if exists:
                raise forms.ValidationError('This college code is already in use.')
        return code 