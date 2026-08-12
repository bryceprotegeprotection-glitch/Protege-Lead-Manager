## Settings + Firebase/FCM integration

This branch adds a Settings UI that uses Firestore for Sales Reps and Categories and integrates with Firebase Cloud Messaging (FCM) for notifications.

Files added/updated
- settings.html — Settings UI (now loads settings-firebase.js)
- settings.css — UI styles
- settings-firebase.js — Firestore + FCM client code (placeholders present)
- firebase-messaging-sw.js — service worker for background FCM handling (must be at repo root)
- manifest.json — PWA manifest
- server/send-notif-server.js — example server helper using firebase-admin (no credentials included)
- README_SETTINGS.md — short setup and testing notes

Important setup steps
1. Update firebaseConfig and VAPID key
   - Open `settings-firebase.js` and `firebase-messaging-sw.js` and replace the firebaseConfig object with your project's config.
   - Replace `VAPID_KEY` in `settings-firebase.js` with your Web Push VAPID public key (Firebase Console → Project settings → Cloud Messaging).

2. Deploy or preview
   - Local testing: `python3 -m http.server 8000` and open http://localhost:8000/settings.html (localhost is a secure context for testing).
   - Production: ensure `firebase-messaging-sw.js` is served at the site root (e.g. https://your-site/firebase-messaging-sw.js). GitHub Pages, Netlify, or Vercel with root file are OK.

3. Saving tokens
   - The client saves FCM tokens to the `fcm_tokens` collection in Firestore. In production, associate tokens with user IDs and clean up stale tokens on failed sends.

4. Sending messages
   - Use Firebase Console Cloud Messaging for quick tests.
   - Or use server/send-notif-server.js with `firebase-admin` and a service account JSON to send messages programmatically. Do not commit service account files to git.

Security
- Do not commit credentials or service account JSON to this repository. Use environment variables or secrets management on your server.

If you want, I can now open a Pull Request from `feature/settings-firebase-fcm` into your default branch with these changes and testing notes.
