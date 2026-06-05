import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_cvlVi_9PeWmZcDLwaR8Sdyh6i8QwTeg",
  authDomain: "porto-digital-a6b6d.firebaseapp.com",
  projectId: "porto-digital-a6b6d",
  storageBucket: "porto-digital-a6b6d.firebasestorage.app",
  messagingSenderId: "780884903425",
  appId: "1:780884903425:web:66324a35d6a92e9dd4a200"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);