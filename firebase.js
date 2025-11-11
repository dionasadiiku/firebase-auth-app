import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyABk0xRkblCLkOvyRKgg0Ih8kPm4z4oUVs",
  authDomain: "detyraindividuale.firebaseapp.com",
  projectId: "detyraindividuale",
  storageBucket: "detyraindividuale.appspot.com",
  messagingSenderId: "167515650721",
  appId: "1:167515650721:web:199b4c266298dc37afcee0",
  measurementId: "G-H96H7Z831B",
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };

