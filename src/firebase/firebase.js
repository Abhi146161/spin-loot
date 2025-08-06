import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiBGnBsKfSTzdnWrxhCSe5gpZ0hSxmLRE",
  authDomain: "spinloot-d1d5c.firebaseapp.com",
  projectId: "spinloot-d1d5c",
  storageBucket: "spinloot-d1d5c.firebasestorage.app",
  messagingSenderId: "98337009728",
  appId: "1:98337009728:web:6010c1b38d55d6afdcafa5",
  measurementId: "G-XNZE8EV7JK",
};

export const app = initializeApp(firebaseConfig); // ✅ export added here
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
