// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt2_hrmHt2LWqkUsE_k9_EVkFgH3TVw2s",
  authDomain: "inventory-management-90804.firebaseapp.com",
  projectId: "inventory-management-90804",
  storageBucket: "inventory-management-90804.firebasestorage.app",
  messagingSenderId: "820787287811",
  appId: "1:820787287811:web:17b98d483a23c48310bb36",
  measurementId: "G-EHM32PRHEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
