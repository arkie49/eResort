import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { getDatabase, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
let analytics = null;

if (window.location.protocol !== 'file:') {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn('Firebase analytics initialization skipped:', err);
  }
} else {
  console.warn('Firebase analytics disabled for file:// pages.');
}

const database = getDatabase(app);

window.firebaseConfig = firebaseConfig;
window.firebaseApp = app;
window.firebaseDatabase = database;
window.firebaseTimestamp = serverTimestamp;
window.firebaseAnalytics = analytics;

console.log('Firebase initialized (Realtime Database modular).');

export { app, analytics, database, serverTimestamp as firebaseTimestamp };
