// send-notif-server.js
// Example Node script using firebase-admin to send notifications to tokens stored in Firestore
// Do NOT commit your serviceAccountKey.json to git. Place it on your server and load via env or file path.

// npm i firebase-admin
const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');

// Initialize admin with service account JSON (not included)
// admin.initializeApp({ credential: admin.credential.cert(require('./serviceAccountKey.json')) });

// If running on a GCP environment with ADC you can use default credentials
// admin.initializeApp();

async function sendToToken(token, title, body, data = {}) {
  const message = {
    token,
    notification: { title, body },
    data
  };
  try {
    const resp = await admin.messaging().send(message);
    console.log('Sent:', resp);
  } catch (err) {
    console.error('Error sending message', err);
  }
}

module.exports = { sendToToken };
