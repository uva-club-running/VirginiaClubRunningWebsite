import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Admin from "./Components/Admin/admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App
