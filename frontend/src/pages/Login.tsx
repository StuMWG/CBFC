import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Card} from "react-bootstrap";
import CustomButton from "../components/Button";
import TextField from "../components/InputField";
import "../styles/Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    navigate("/dashboard");
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
        <TextField label="Username" placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth/>
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