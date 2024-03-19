// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCQswz8kOGRXTw4jFDoSa0SyDZJc2DwfnA",
  authDomain: "dushboard-a322b.firebaseapp.com",
  databaseURL: "https://dushboard-a322b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dushboard-a322b",
  storageBucket: "dushboard-a322b.appspot.com",
  messagingSenderId: "272229917863",
  appId: "1:272229917863:web:bb4ed64724c13252566782",
  measurementId: "G-3TMMMJK045"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(app);
export const db = getFirestore(app);
