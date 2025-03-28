// firebase.config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7na3OrjLeivY_fFcVWDiwbAkahg4RIv4",
  authDomain: "restorant-d296e.firebaseapp.com",
  projectId: "restorant-d296e",
  storageBucket: "restorant-d296e.firebasestorage.app",
  messagingSenderId: "386477847911",
  appId: "1:386477847911:web:874353ea511577d0dc6bc2",
  measurementId: "G-MHJG3NZ50H",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Authentication nesnesini başlat

// Export necessary modules
export { auth, RecaptchaVerifier, signInWithPhoneNumber };
