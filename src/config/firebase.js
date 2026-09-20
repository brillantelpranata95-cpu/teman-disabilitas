import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

// Firebase web config — project: teman-disabilitas
// API key web bersifat publik (tertanam di bundle client) dan dilindungi Firestore Rules.
const firebaseConfig = {
  apiKey: "AIzaSyCTH1vbanrVgTKz30dujW3BzTOsAgJGxYU",
  authDomain: "teman-disabilitas.firebaseapp.com",
  projectId: "teman-disabilitas",
  storageBucket: "teman-disabilitas.firebasestorage.app",
  messagingSenderId: "1030126341881",
  appId: "1:1030126341881:web:f7b0c05675ef3968e2dc28",
  measurementId: "G-YZ3829XVCE",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics — hanya di browser yang mendukung (aman diabaikan jika gagal)
isSupported()
  .then((ok) => { if (ok) getAnalytics(app); })
  .catch(() => {});

setPersistence(auth, browserLocalPersistence).catch(console.error);

// Cache offline IndexedDB — aplikasi tetap terbaca saat koneksi lemah
enableIndexedDbPersistence(db).catch((e) => {
  if (e.code !== "failed-precondition" && e.code !== "unimplemented") {
    console.warn("Firestore persistence:", e.code);
  }
});
