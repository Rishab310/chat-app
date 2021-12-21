// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6WMgHCnJhxVfnh81v2IKlhol4sCqOE2s",
  authDomain: "chat-app-e4c40.firebaseapp.com",
  projectId: "chat-app-e4c40",
  storageBucket: "chat-app-e4c40.appspot.com",
  messagingSenderId: "950235190590",
  appId: "1:950235190590:web:ce7f91a7d25c92f529c86f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const provider = new GoogleAuthProvider();

export default db;