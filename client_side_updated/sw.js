//ServiceWorker

var n_conf = {
    debug: true,
    log: function(msg) {
        n_conf.debug && console.log(msg);
    }
};

self.addEventListener('push', function(event) {
    n_conf.log('[Service Worder] Push received with data: "'+ event.data.text() + '"');

    var data;
    try {
        data = event.data.json();
    } catch(e) {
        n_conf.log('Error Fetching data', e);
        data = {};
    };

    var title = data.title;
    var options = {
        data: {
            url: data.url_redirect || "/"
        },
        ttl: data.ttl || 1800
    };
    data.body && (options.body = data.body);
    data.image && (options.image = data.image);
    data.icon && (options.image = data.icon);

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    n_conf.log('[Service Worker] Notification click Received');

    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

self.addEventListener('install', function(event) {
    if (event.skipWaiting) {
        event.waitUntil(self.skipWaiting());
    }
});
