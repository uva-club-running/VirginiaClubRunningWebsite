import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Join from "./Components/Join/Join"
import Meets from "./Components/Meets/Meets"
import Community from "./Components/Community/Community"
import Philanthropy from "./Components/Philanthropy/Philanthropy"
import Records from "./Components/Records/Records"
import Contact from "./Components/Contact/Contact"
import Admin from "./Components/Admin/Admin";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Components/Admin/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/training" element={<Join />} />
      <Route path="/meets" element={<Meets />} />
      <Route path="/community" element={<Community />} />
      <Route path="/philanthropy" element={<Philanthropy />} />
      <Route path="/records" element={<Records />} />
      <Route path="/contact" element={<Contact />} />
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
