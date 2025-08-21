// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXuAZUoNYkUWvnQcxocEKdVrPpl65MV_Y",
  authDomain: "portfolio-designer-bb7ec.firebaseapp.com",
  projectId: "portfolio-designer-bb7ec",
  storageBucket: "portfolio-designer-bb7ec.firebasestorage.app",
  messagingSenderId: "579185929693",
  appId: "1:579185929693:web:ec32109d0b60ba4bdc9a34"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Only connect to emulators in development
if (import.meta.env.MODE === 'development' || window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}

export { auth, db, storage };