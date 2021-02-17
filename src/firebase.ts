import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_F_API_KEY,
  authDomain: import.meta.env.VITE_F_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_F_DATABASE_URL,
  projectId: import.meta.env.VITE_F_PROJECT_ID,
  storageBucket: import.meta.env.VITE_F_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_F_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_F_APP_ID,
  measurementId: import.meta.env.VITE_F_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

const analytics = firebase.analytics();
const db = firebase.firestore();
const auth = firebase.auth();

const googleAuth = new firebase.auth.GoogleAuthProvider();

const usersCollection = db.collection("users");

export { firebase, analytics, db, auth, googleAuth, usersCollection };
