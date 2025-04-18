import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8VTlWQ4VOcXK0ZHGcQPfYFtnO4O3oIUs",
  authDomain: "calculus-8d469.firebaseapp.com",
  projectId: "calculus-8d469",
  storageBucket: "calculus-8d469.firebasestorage.app",
  messagingSenderId: "160811520756",
  appId: "1:160811520756:web:cf37e42b41d4df4ac184a1",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
