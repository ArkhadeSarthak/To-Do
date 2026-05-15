import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCT8kWLPnj_k0o2lvX6lq0AAmCfAb8735w",
  authDomain: "to-do-list-sarthak.firebaseapp.com",
  projectId: "to-do-list-sarthak",
  storageBucket: "to-do-list-sarthak.firebasestorage.app",
  messagingSenderId: "965731224593",
  appId: "1:965731224593:web:d314e01c954c138b6ab5b0",
  measurementId: "G-7Q9Y53R9KM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
