// ProtectedRoute.jsx
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase"; // your Firebase config

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // while Firebase checks
  }

  if (!user) {
    console.log("here");
    return <Navigate to="/admin" replace />; // redirect to login if not signed in
  }

  return children; // show the protected page
}

export default ProtectedRoute;
