// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAt2_hrmHt2LWqkUsE_k9_EVkFgH3TVw2s",
  authDomain: "inventory-management-90804.firebaseapp.com",
  projectId: "inventory-management-90804",
  storageBucket: "inventory-management-90804.appspot.com",
  messagingSenderId: "820787287811",
  appId: "1:820787287811:web:17b98d483a23c48310bb36",
  measurementId: "G-EHM32PRHEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
