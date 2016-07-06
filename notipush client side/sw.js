'use strict';
console.log('Started', self);
var some;
var title;
var content;
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {
  console.log('Push message', event);
  self.registration.pushManager.getSubscription().then(function(subscription) {
    if (subscription) {
      var id = subscription.endpoint.split("/").slice(-1)[0];
      some=id;
    }
    console.log(some)

  // var invocation = createCrossDomainRequest();
  // var id = some;
  // console.log(id);
  
  // var url = 'https://notipush-tohidur.rhcloud.com/fetch/'+id;
  // function createCrossDomainRequest(url, handler) {
  //   var request;
  //   request = new XMLHttpRequest();
  //   return request;
  // }

  // function callOtherDomain() {
  //   if (invocation) {
  //       invocation.open('GET', url, true);
  //       invocation.onreadystatechange = handler;
  //       invocation.send();
  //   }
  //   else {
  //     var text = "No Invocation TookPlace At All";
  //     var textNode = document.createTextNode(text);
  //     var textDiv = document.getElementById("textDiv");
  //     textDiv.appendChild(textNode);
  //   }
  // }

  // function handler(evtXHR) {
  //   if (invocation.readyState == 4)
  //   {
  //     if (invocation.status == 200) {
  //          var response = invocation.responseText;
  //          console.log(JSON.parse(response)); 
  //     }
  //     else {
  //       alert("Invocation Errors Occured");
  //     }
  //   }
  // }
    
  // var test = callOtherDomain();
  // console.log(test);

  fetch('http://127.0.0.1:8000/fetch/'+some, {
      method: 'get',
      mode: 'cors',
      headers: {
        'Content-Type': 'jsonp',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Request-Method': 'GET, POST',
      },
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
      console.log(data);
      self.registration.showNotification('Notipush', {
        body: 'Keep your user updated',
        icon: 'images/icon.png',
      });
    })
  });
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag ', event.notification.tag);
  event.notification.close();
  var url = 'https://notipush-tohidur.rhcloud.com';
  event.waitUntil(
    clients.matchAll({
        type: 'window'
    })
    .then(function(windowClients) {
        for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            if (client.url === url && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
    })
  );
});
