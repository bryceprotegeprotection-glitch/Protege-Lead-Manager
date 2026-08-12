// firebase-messaging-sw.js (must be at site root)
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Firebase config filled from user-provided values
const firebaseConfig = {
  apiKey: "AIzaSyD-qcfqf5l8NZh-StuSqJ_ZdKCZnJEDwiE",
  authDomain: "protege-lead-manager.firebaseapp.com",
  projectId: "protege-lead-manager",
  storageBucket: "protege-lead-manager.firebasestorage.app",
  messagingSenderId: "782878602512",
  appId: "1:782878602512:web:c40a058d114db0522e2195"
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
