// firebase-messaging-sw.js (must be at site root)
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Paste the same firebaseConfig used in settings-firebase.js
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notification = payload.notification || {};
  const title = notification.title || 'Lead Manager';
  const options = {
    body: notification.body || '',
    icon: '/icons/icon-192.png',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});
