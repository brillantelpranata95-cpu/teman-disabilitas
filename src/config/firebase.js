import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIv0U01jISDeR6t3Q4JsfZrDhfpJVfkGg",
  authDomain: "perisai-kesejahteraan-temon.firebaseapp.com",
  projectId: "perisai-kesejahteraan-temon",
  storageBucket: "perisai-kesejahteraan-temon.firebasestorage.app",
  messagingSenderId: "620158920266",
  appId: "1:620158920266:web:6661e593c45a1714b7a8b3",
  measurementId: "G-EP3E247FBR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
