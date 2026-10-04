import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MockInterview from "./pages/MockInterview";
import CodingArena from "./pages/CodingArena";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}

        <Route path="/login" element={<Login />} />

        {/* Register */}

        <Route path="/register" element={<Register />} />

        {/* Dashboard */}

        <Route path="/dashboard" element={<Dashboard />} />

        {/* Temporary pages */}

        <Route path="/mock-interview" element={<MockInterview />} />

        <Route path="/coding" element={<CodingArena />} />

        <Route path="/resume" element={<ResumeAnalyzer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
