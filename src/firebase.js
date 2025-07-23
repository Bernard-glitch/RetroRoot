// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBKua4yKbNDleOMjxzNvS3pqeyZsTnusN8",
    authDomain: "retroroot-10727.firebaseapp.com",
    projectId: "retroroot-10727",
    storageBucket: "retroroot-10727.firebasestorage.app",
    messagingSenderId: "834727175752",
    appId: "1:834727175752:web:69914e50f782f4a7e39a7d",
    measurementId: "G-8XV058G67S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);