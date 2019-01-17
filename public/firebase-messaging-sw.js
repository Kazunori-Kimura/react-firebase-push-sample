/*
   JavaScript クライアントでメッセージを受信する  |  Firebase
   https://firebase.google.com/docs/cloud-messaging/js/receive?hl=ja
 */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.7.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.3/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '651317443326'
});

// バックグラウンドメッセージを処理できるようにFirebase Messagingのインスタンスを取得します。
// この一文がないとブラウザがアクティブなときでもPush通知を受信できません。
const messaging = firebase.messaging();

// サーバー側にPOSTするデータに `notification` が含まれている場合は
// `setBackgroundMessageHandler` は呼ばれない。
// `notification` をサーバー側で設定しない場合はここで通知のtitle, bodyを組み立てることになる。
// => Firebase Cloud Messaging（FCM）でより簡単にWebブラウザにPush通知を送るサンプル - DRYな備忘録
//    http://otiai10.hatenablog.com/entry/2017/06/22/023025
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
