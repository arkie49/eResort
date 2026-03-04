const firebaseConfig = {
  apiKey: "AIzaSyBlCSR4v8ENLdUCbVaroN9cQy3kDueG_u8",
  authDomain: "eresort-7500a.firebaseapp.com",
  databaseURL: "https://eresort-7500a-default-rtdb.firebaseio.com",
  projectId: "eresort-7500a",
  storageBucket: "eresort-7500a.firebasestorage.app",
  messagingSenderId: "809058826064",
  appId: "1:809058826064:web:34b143426633ddb2259e55",
  measurementId: "G-Z0QSZ68S2P"
};

if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    window.firebaseDb = db;
    console.log('Firebase initialized (Realtime Database compat).');
  } catch (err) {
    console.warn('Firebase init error:', err);
  }
} else {
  console.warn('Firebase SDK not loaded. Add Firebase scripts to your HTML.');
}
