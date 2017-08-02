'use strict';

if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js').then(function() {
    return navigator.serviceWorker.ready;
  }).then(function(reg) {
    console.log('Service Worker is ready :^)', reg);
    reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
      console.log(sub);
      var ndata = {
        endpoint: sub.endpoint.split("/").slice(-1)[0],
        website: window.location.origin.split("/").slice(-1)[0],
      }
      console.log(ndata)
      $.ajaxSetup({
        headers: {
          'X-CSRF-Token': $('meta[name="_token"]').attr('content')
        }
      })
      $.ajax({
        url:'http://127.0.0.1:8000/store-id/',
        type: 'POST',
        data: ndata,
        datatype: 'jsonp',
        success: function(data) {
          console.log(data);
        }
      })
    });
  }).catch(function(error) {
    console.log('Service Worker error :^(', error);
  });
}
