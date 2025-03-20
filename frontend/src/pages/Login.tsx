import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card} from "react-bootstrap";
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

  return (
    <div className="fullscreen-container">
    <Card className="shadow-lg p-4" style={{ width: "22rem" }}>
      <h2 className="text-center mb-4">Login</h2>
      <TextField label="Username" placeholder="Enter your username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth/>
      <TextField label="Password" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth/>
      <CustomButton label="Login" type="button" onClick={handleLogin} fullWidth />
      <div className="text-center mt-3">
        <CustomButton label="Register" type="button" onClick={handleRegistration} variant="link" />
      </div>
    </Card>
  </div>
  );
};

export default Login;