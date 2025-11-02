// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9n4fzVdl1Rrf05-c9CO9afX50xkpYvwQ",
  authDomain: "club-running-at-uva.firebaseapp.com",
  databaseURL: "https://club-running-at-uva-default-rtdb.firebaseio.com",
  projectId: "club-running-at-uva",
  storageBucket: "club-running-at-uva.firebasestorage.app",
  messagingSenderId: "499456961446",
  appId: "1:499456961446:web:75e23a789d22e015cbfd67",
  measurementId: "G-EQCCZD60QT",
};

// ✅ Initialize Firebase once
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Add this line
export const analytics = getAnalytics(app);

// Optional: Login helper function
export const login = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(error.message);
  }
};
