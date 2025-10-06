// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);

const login = async (email, password) => {
  const auth = getAuth();
  try {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  }
};

export default login;
