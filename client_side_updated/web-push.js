'use strict';

UP_CONFIG.WEB_PUSH = {
    REG_API: UP_CONFIG.API_BASE + "v1/device/web/",
    APPLICATION_SERVER_PUBLIC_KEY: "BLzlmw0-kG03Nxq2h2_GhtuT3LIIc7RDtDKYVFgAXYPRteJDzFVpMFNxHbhwU-xse_mltxe_lvPtDmjuP35U1DI",
};

var webpush = (function() {
    var registrationApi = UP_CONFIG.WEB_PUSH.REG_API;
    var applicationServerPublicKey = UP_CONFIG.WEB_PUSH.APPLICATION_SERVER_PUBLIC_KEY;

    var isSubscribed = false;
    var swRegistration = null;
    var debug = true;


    function urlB64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i=0; i<rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        };
        return outputArray;
    };

    function sendSubscriptionToBackEnd(subscription) {
        var authorization_header;

        if (UP_CONFIG.AUTH_USER) {
            authorization_header = UP_CONFIG.AUTH_USER;
        } else if (UP_CONFIG.AUTH_BUSINESS) {
            authorization_header = UP_CONFIG.AUTH_BUSINESS;
        } else {
            debug && console.log("Something is wrong");
            return;
        };

        return fetch(registrationApi, {
            method: "POST",
            mode: 'cors',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": authorization_header,
                "Access-Control-Request-Method": "POST", 
                "Access-Control-Request-Headers": "X-PINGOTHER, Content-Type"
            },
            body: JSON.stringify({"subscription_info": subscription})
        })
        .then(function(response) {
            if(!response.ok) {

                debug && console.log("Bad response from server");
                throw new Error("Not Able to Subscribe in Backend, hence aborting in client");

            } else if (authorization_header == UP_CONFIG.AUTH_USER) {

                UP.localStorage.setItem('web_push_user_assigned', true);

            }
        });
    };

    function updateSubscriptionOnServer(subscription) {
        if (subscription) {
            sendSubscriptionToBackEnd(subscription);
        };
    };

    function subscribeUser() {
        var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
        .then(function(subscription) {
            debug && console.log('User is subscribed\n') && console.log(JOSN.stringify(subscription));
            updateSubscriptionOnServer(subscription);
            isSubscribed = true;
        })
        .catch(function(error) {
            debug && console.log('Failed to subscribe the user', error);
        });
    };

    function initialise() {
        // Set the subscription.
        swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                debug && console.log("User is subscribed");
                assignUserWithSubscriptionOnLogin(null, {event: "onboarding_check"});
            } else {
                debug && console.log("User is NOT subscribed");
                // Subscribe User
                subscribeUser();
            };
        });
    };

    function assignUserWithSubscriptionOnLogin(me, data) {
        if (data.event && (data.event == 'login' || data.event == 'onboarding_check')) {
            debug && console.log(UP.localStorage.getItem('web_push_user_assigned'));
            debug && console.log(data.event);

            if (UP.localStorage.getItem('web_push_user_assigned')) {
                // User already assigned
                return;
            } else if (!UP_CONFIG.AUTH_USER) {
                // No User auth Present
                return;
            } else {
                debug && console.log("Assigning user with subscription");
                // Assign User
                swRegistration.pushManager.getSubscription()
                .then(function(subscription) {
                    updateSubscriptionOnServer(subscription);
                })
                .catch(function(error) {
                    debug && console.log("Failed to assign user", error);
                });

            };
        };
    };

    if ('serviceWorker' in navigator && 'PushManager' in window) {
        debug && console.log('ServiceWorker and Push is supported');

        navigator.serviceWorker.register('/service_worker.js', {"Cache-control": "no-cache", "max-age": 0})
        .then(function(swReg) {
            debug && console.log('Service Worker is registered', swReg);

            swRegistration = swReg;
            initialise();
        })
        .catch(function(error) {
            debug && console.log('Service Worker Error', error);
        });
    } else {
        debug && console.warn('Push messaging is not supported');
    };

    return {
        assignUserWithSubscriptionOnLogin: assignUserWithSubscriptionOnLogin
    };

})();

// Subscribe to PubSub auth_event login event,
// to check if user is recongised or not
PubSub.subscribe('auth_event', webpush.assignUserWithSubscriptionOnLogin);
