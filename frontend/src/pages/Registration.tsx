import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import CustomButton from "../components/Button";
import TextField from "../components/InputField";
import "../styles/Registration.css";

const Registration: React.FC = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVerify, verifyPassword] = useState<string>("");

  const handleSubmit = () => {
    navigate("/");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="fullscreen-container">
      <Card className="shadow-lg p-4" style={{ width: "22rem" }}>
        <h2 className="text-center mb-4">Register</h2>
        <TextField label="Username" placeholder="Enter a username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth/>
        <TextField label="Email" placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth/>
        <TextField label="Password" placeholder="Enter a password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth/>
        <TextField label="Verify Password" placeholder="Enter password" type="password" value={passwordVerify} onChange={(e) => verifyPassword(e.target.value)} fullWidth/>
        <CustomButton label="Submit" type="submit" onClick={handleSubmit} fullWidth />
        <CustomButton label="Back" type="button" onClick={handleBack} variant="link" />
      </Card>
    </div>
    );
};

export default Registration;