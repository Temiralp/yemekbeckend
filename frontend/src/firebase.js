// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7na3OrjLeivY_fFcVWDiwbAkahg4RIv4",
  authDomain: "restorant-d296e.firebaseapp.com",
  projectId: "restorant-d296e",
  storageBucket: "restorant-d296e.firebasestorage.app",
  messagingSenderId: "386477847911",
  appId: "1:386477847911:web:874353ea511577d0dc6bc2",
  measurementId: "G-MHJG3NZ50H",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export { signInWithPhoneNumber, RecaptchaVerifier };
