// Import the functions you need from the SDKs you need
import firebase from "firebase";
import "firebase/auth";
import "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyArzJHx8QMAx4rJAgGgIxV0G44qPkDNmmI",
  // authDomain: "scholar-up1.firebaseapp.com",
  // projectId: "scholar-up1",
  // storageBucket: "scholar-up1.appspot.com",
  // messagingSenderId: "1012802440689",
  // appId: "1:1012802440689:web:8de0e7e1bd569171cb4850",
  apiKey: "AIzaSyCodbsbZMDrEYSG-MqcUr_ammCSqB9TUBQ",
  authDomain: "gatekeeper-799f3.firebaseapp.com",
  projectId: "gatekeeper-799f3",
  storageBucket: "gatekeeper-799f3.appspot.com",
  messagingSenderId: "229357170301",
  appId: "1:229357170301:web:f152a36c81a9e251354b14",

  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();
const db = app.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export { db, storage, auth, provider };
