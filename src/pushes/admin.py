from django.contrib import admin

from pushes.models import Notification, Browser, Websites
# Register your models here.

admin.site.register(Notification)
admin.site.register(Browser)
admin.site.register(Websites)
