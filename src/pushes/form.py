from django import forms

from .models import Notification, Browser, Websites


class NotificationForm(forms.ModelForm):
    content = forms.CharField(widget=forms.Textarea(attrs={'cols': 10, 'rows': 2}))

    class Meta:
        model = Notification
        fields = [
            "title",
            "content",
            "website",
        ]
