import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Registration from "./pages/Registration.tsx";
import Budget from "./pages/Budget.tsx";
import Settings from "./pages/Settings.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Profile from "./pages/Profile.tsx";
import Terms from "./pages/Terms"
import "./App.css";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/terms" element={<Terms/>}/>
      </Routes>
    </Router>
  );
};

export default App;

