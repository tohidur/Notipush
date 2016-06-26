from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from .models import Notification
from .form import NotificationForm
import json
import urllib
import urllib2
from django.views.decorators.csrf import csrf_exempt
from .models import Notification, Browser, Websites
# Create your views here.


@csrf_exempt
def id_store(request):
    if request.POST:
        reg_id = request.POST.get('endpoint')
        website = request.POST.get('website')
        qs = Browser.objects.filter(reg_id=reg_id)
        if not qs.exists():
            Browser.objects.create(
                reg_id=reg_id,
                website=website
            )
        response = HttpResponse(json.dumps({"key": ""}))
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "*"
        return response


def notification_send(request):
    form = NotificationForm(request.POST or None)
    if form.is_valid():
        user = request.user
        title = request.POST.get('title')
        content = request.POST.get('content')
        website = request.POST.get('website')
        Notification.objects.create(
            user=user,
            title=title,
            content=content,
            website=website,
        )
        browsers = Browser.objects.filter(website=website)
        if browsers:
            for browser in browsers:
                reg_id = browser.reg_id
                json_data = {"collapse_key" : "Food-Promo", "data" : {
                        "Category" : "FOOD",
                        "Type": "VEG",
                    }, "registration_ids": [reg_id],
                }
                url = 'https://android.googleapis.com/gcm/send'
                api_key = "AIzaSyBrqXvekcNU3MxY24el5Y34rk6ubvJHKOI"
                my_key = "key=" + api_key
                data = json.dumps(json_data)
                headers = {'Content-Type': 'application/json', 'Authorization': my_key}
                req = urllib2.Request(url, data, headers)
                f = urllib2.urlopen(req).read().decode("utf-8")


    # url = 'https://android.googleapis.com/gcm/send'
    # values ={"notification": {
    # 	'title':'The title',
    # 	'content': 'The content',
    # 	},
    # 	'to':'dpKEROWVgTQ:APA91bGxTcEOfI2A7-Ldr3FJBMQQZ1g-xy093rLDa3iHlyXS9HY3Rasfsrj9qiA3kyDC4jcVYle08zFqKq2LZNle4hK9idhOIjVu8EERtV_ZMmM53vEHzDGKTF6Q9-HcD6MDxqFNGnS9',
    # }
    # req = urllib2.Request(url, json.dumps(values))
    # response = urllib2.urlopen(req)
    # print response



    # gcm = GCM("AIzaSyBrqXvekcNU3MxY24el5Y34rk6ubvJHKOI")
    # data = json.dumps({"notification": {
    # 	'title':'The title',
    # 	'content': 'The content',
    # 	}
    # })
    # reg_id = 'dpKEROWVgTQ:APA91bGxTcEOfI2A7-Ldr3FJBMQQZ1g-xy093rLDa3iHlyXS9HY3Rasfsrj9qiA3kyDC4jcVYle08zFqKq2LZNle4hK9idhOIjVu8EERtV_ZMmM53vEHzDGKTF6Q9-HcD6MDxqFNGnS9'
    # response = gcm.json_request(registration_ids=reg_id, data=data)
    # print(response)



    # url = 'https://android.googleapis.com/gcm/send'
    # 	data ={ "notification": {
    # 	"title": "Portugal vs. Denmark",
    # 	"text": "5 to 1"
    # 		},
    # 	"to":'dpKEROWVgTQ:APA91bGxTcEOfI2A7-Ldr3FJBMQQZ1g-xy093rLDa3iHlyXS9HY3Rasfsrj9qiA3kyDC4jcVYle08zFqKq2LZNle4hK9idhOIjVu8EERtV_ZMmM53vEHzDGKTF6Q9-HcD6MDxqFNGnS9'
    # 	}
    # 	headers = {'Authorization': "AIzaSyBrqXvekcNU3MxY24el5Y34rk6ubvJHKOI",'Content-Type': 'application/json'}
    # 	response=requests.post( url, data, headers)
    # 	print(response)

    context = {
        "form": form,
    }
    return render(request, "notification_send.html", context)


def fetch(request, reg_id):
    browser = Browser.objects.filter(reg_id=reg_id)
    data = browser.get_notification
    notification = json.dumps({
        'title': data.title,
        'content': data.content,
    })
    print data
    response = HttpResponse(notification)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "*"
    return response
