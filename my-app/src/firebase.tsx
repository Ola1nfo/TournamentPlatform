import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBh_A5ZA9n0trs1YVvK9BGm1_qAms-s0C8",
  authDomain: "tournament-platform-8c04c.firebaseapp.com",
  projectId: "tournament-platform-8c04c",
  storageBucket: "tournament-platform-8c04c.firebasestorage.app",
  messagingSenderId: "532802307925",
  appId: "1:532802307925:web:f6b9758b0e8af62f4291dc",
};

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Database
export const db = getFirestore(app);