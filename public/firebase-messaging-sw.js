/*
   JavaScript クライアントでメッセージを受信する  |  Firebase
   https://firebase.google.com/docs/cloud-messaging/js/receive?hl=ja
 */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.7.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.3/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '651317443326'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// messaging.onMessage(function(payload) {
//   console.log('Message received. ', payload);
//   // ...
// });


messaging.setBackgroundMessageHandler((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    title: 'push-test-web',
    body: 'push-test-web: Background Message body',
    icon: '/favicon.ico',
    // icon: '/firebase-logo.png',
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
