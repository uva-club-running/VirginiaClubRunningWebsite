import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import {Admin} from "./Components/Admin/admin";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Components/Admin/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
