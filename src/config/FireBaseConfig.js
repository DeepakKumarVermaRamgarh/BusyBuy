import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration with your app's credentials
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export Firebase authentication and Firestore database objects
export const auth = getAuth(app); // Firebase authentication object
export const db = getFirestore(app); // Firestore database object
// Export Firestore collections for products, user carts, user orders, and users
export const productCollection = collection(db, "products");
export const cartCollection = collection(db, "userCart");
export const orderCollection = collection(db, "userOrder");
export const userCollection = collection(db, "users");
