from __future__ import unicode_literals
from django.db import models
from django.conf import settings
# Create your models here.


class Notification(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
	website = models.CharField(max_length=150)
	title = models.CharField(max_length=120)
	content = models.TextField()
	update = models.DateTimeField(auto_now=True, auto_now_add=False)
	timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

	def __unicode__(self):
		return self.title

	def __str__(self):
		return self.title


class Browser(models.Model):
	reg_id = models.TextField(unique=True)
	website = models.CharField(max_length=150)
	timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

	def __unicode__(self):
		return self.website

	@property
	def get_notification(self):
		website = self.website
		notification = Notification.objects.get(website=website)
		return notification

class Websites(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
	address = models.CharField(max_length=150)

	def __unicode__(self):
		return self.user
