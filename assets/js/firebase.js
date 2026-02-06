import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBH7R7KIvSpscIB7-butmQ08KCSoIflnKk",
  authDomain: "itqan-212e4.firebaseapp.com",
  projectId: "itqan-212e4",
  storageBucket: "itqan-212e4.firebasestorage.app",
  messagingSenderId: "231957590445",
  appId: "1:231957590445:web:04e712c1c453661435b124",
  measurementId: "G-KGP6HT6RX7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export function initFirebase() { console.log('Firebase initialized'); }
