import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Card} from "react-bootstrap";
import CustomButton from "../components/Button";
import TextField from "../components/InputField";
import "../styles/Login.css";
import axios from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        identifier: identifier,
        password: password,
      });
  
      if (response.data && response.data.message === "Login successful") {
        console.log("Login successful:", response.data.user);
        navigate("/dashboard");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials.");
      } else {
        console.error("Login error:", error);
        alert("Server error. Please try again later.");
      }
    }
  }; 

  const handleRegistration = () => {
    navigate("/registration");
  };

  const handleForgotPassword = () => {
    navigate("/forgotpassword")
  };

  return (
    <div className="fullscreen-container">
      <Card className="shadow-lg p-4 text-left" style={{ width: "22rem" }}>
        <h2 className="title">Login</h2>
        <div className="line"></div>
        <TextField label="Email or Username" placeholder="Enter your email or username" type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} fullWidth/>
        <TextField label="Password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth/>
        <CustomButton label="Login" type="button" onClick={handleLogin} fullWidth />
        <div className="mt-3">
          <CustomButton label="Forgot password?" type="button" onClick={handleForgotPassword} variant="link"/>
          <CustomButton label="Don't have an account?" type="button" onClick={handleRegistration} variant="link" />
        </div>
      </Card>
    </div>
  );
};

export default Login;