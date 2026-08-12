// settings-firebase.js (ES Module)
// Firebase config has been filled from user-provided values. Replace VAPID_KEY with your Web Push public key if you have it.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging.js';

const firebaseConfig = {
  apiKey: "AIzaSyD-qcfqf5l8NZh-StuSqJ_ZdKCZnJEDwiE",
  authDomain: "protege-lead-manager.firebaseapp.com",
  projectId: "protege-lead-manager",
  storageBucket: "protege-lead-manager.firebasestorage.app",
  messagingSenderId: "782878602512",
  appId: "1:782878602512:web:c40a058d114db0522e2195"
};

const VAPID_KEY = 'REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY'; // from Firebase Console -> Project Settings -> Cloud Messaging

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

// Collections
const repsCol = collection(db, 'reps');
const catsCol = collection(db, 'categories');

function el(id){ return document.getElementById(id) }

function escapeHtml(s){ return (s||'').toString().replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])) }

function renderReps(docs){
  const list = el('rep-list'); list.innerHTML = '';
  docs.forEach(d => {
    const r = d.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${escapeHtml(r.name)}</strong>
        <div class="item-meta">${escapeHtml(r.email||'')}</div>
      </div>
      <div class="actions">
        <button data-id="${d.id}" class="del-rep">Delete</button>
      </div>`;
    list.appendChild(li);
  });
}
function renderCats(docs){
  const list = el('cat-list'); list.innerHTML = '';
  docs.forEach(d => {
    const c = d.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <div><strong>${escapeHtml(c.name)}</strong></div>
      <div class="actions">
        <button data-id="${d.id}" class="del-cat">Delete</button>
      </div>`;
    list.appendChild(li);
  });
}

// Initialize listeners and UI
document.addEventListener('DOMContentLoaded', () => {
  const repsQuery = query(repsCol, orderBy('createdAt','desc'));
  const catsQuery = query(catsCol, orderBy('createdAt','desc'));
  onSnapshot(repsQuery, snapshot => renderReps(snapshot.docs));
  onSnapshot(catsQuery, snapshot => renderCats(snapshot.docs));

  el('rep-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name = el('rep-name').value.trim();
    const email = el('rep-email').value.trim();
    if (!name) return;
    await addDoc(repsCol, { name, email, createdAt: serverTimestamp() });
    el('rep-name').value=''; el('rep-email').value='';
  });

  el('cat-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name = el('cat-name').value.trim();
    if (!name) return;
    await addDoc(catsCol, { name, createdAt: serverTimestamp() });
    el('cat-name').value='';
  });

  document.body.addEventListener('click', async e => {
    if (e.target.matches('.del-rep')) {
      const id = e.target.dataset.id;
      await deleteDoc(doc(db, 'reps', id));
    }
    if (e.target.matches('.del-cat')) {
      const id = e.target.dataset.id;
      await deleteDoc(doc(db, 'categories', id));
    }
  });

  el('clear-data').addEventListener('click', async () => {
    if (!confirm('Clear demo data from UI only? This will NOT delete Firestore data.')) return;
    // Clear local demo storage if present
    localStorage.removeItem('lm_reps_v1'); localStorage.removeItem('lm_cats_v1');
    // Re-render (Firestore will push current data)
  });

  el('request-notifs').addEventListener('click', async () => {
    try {
      // Ensure service worker is ready
      const swReg = await navigator.serviceWorker.ready;
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token) {
        console.log('FCM token:', token);
        // Save token to Firestore (associate with user in production)
        await addDoc(collection(db, 'fcm_tokens'), { token, createdAt: serverTimestamp() });
        alert('Notifications enabled (token saved).');
      } else {
        alert('No registration token available. Make sure you allowed notifications.');
      }
    } catch (err) {
      console.error('Error getting token', err);
      alert('Could not get permission to notify: ' + (err.message||err));
    }
  });

  // Foreground messages
  onMessage(messaging, payload => {
    console.log('Message received in foreground:', payload);
    const title = payload.notification?.title || 'Lead Manager';
    const body = payload.notification?.body || JSON.stringify(payload);
    // Show a simple in-page notification
    if (Notification && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icons/icon-192.png' });
    } else {
      alert(`${title}\n\n${body}`);
    }
  });
});
