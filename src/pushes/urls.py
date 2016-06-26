from django.conf.urls import url
from .views import (
    notification_send,
    id_store,
    fetch,
)

urlpatterns = [
    url(r'^$', notification_send, name='send'),
    url(r'^store-id/$', id_store, name='idStore'),
    url(r'^fetch/(?P<reg_id>[a-zA-Z0-9:_.-]*)/$', fetch, name='fetch'),
]
