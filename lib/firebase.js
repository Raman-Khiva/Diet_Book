// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbZ3tRfi6LhU8PJ6aMp2r6aMYKNFnr3so",
  authDomain: "meallog-6e309.firebaseapp.com",
  projectId: "meallog-6e309",
  storageBucket: "meallog-6e309.firebasestorage.app",
  messagingSenderId: "468492382471",
  appId: "1:468492382471:web:bc8c8d9c7a3e165394d5a2",
  measurementId: "G-SG26GPW7SW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);






