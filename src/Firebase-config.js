// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAm1H7xCXCB-CI_x5mMppdTzItrrki4yYg",
  authDomain: "chat-app-3e26c.firebaseapp.com",
  projectId: "chat-app-3e26c",
  storageBucket: "chat-app-3e26c.appspot.com",
  messagingSenderId: "233306745931",
  appId: "1:233306745931:web:7f340671410ec268b5b1ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)