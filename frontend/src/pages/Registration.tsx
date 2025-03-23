import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import CustomButton from "../components/Button";
import TextField from "../components/InputField";
import "../styles/Registration.css";
import Checkbox from "../components/Checkbox";

const Registration: React.FC = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVerify, verifyPassword] = useState<string>("");
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  const [isWarningVisible, setIsWarningVisible] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!isTermsAccepted) {
      setIsWarningVisible(true);
      return; 
    }
    navigate("/dashboard") 
    
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleTAC = () => {
    window.open("/terms", "_blank");
  }

  return (
    <div className="fullscreen-container">
        <Card className="shadow-lg p-4 text-left" style={{ width: "22rem" }}>
          <h2 className="title">Register</h2>
          <div className="line"></div>
        <TextField 
          label="Username" 
          placeholder="Username" 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} fullWidth/>
        <TextField 
          label="Email" 
          placeholder="Email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} fullWidth/>
        <TextField 
          label="Password" 
          placeholder="Password" 
          type="password" 
          value={password} onChange={(e) => setPassword(e.target.value)} fullWidth/>
        <TextField 
          label="Verify Password" 
          placeholder="Verify password" 
          type="password" 
          value={passwordVerify} onChange={(e) => verifyPassword(e.target.value)} fullWidth/>
        <Checkbox
          label="I agree to the terms and conditions"
          checked={isTermsAccepted}
          onChange={(e) => setIsTermsAccepted(e.target.checked)}
        />
        <CustomButton label="Learn more." type="button" onClick={handleTAC} variant="link"/>
        {isWarningVisible && !isTermsAccepted && (
          <div className="warning-message" style={{ color: "red", marginTop: "5px", fontSize: 10, marginBottom: "5px"}}>
            The terms and conditions must be accepted.
          </div>
        )}
        <CustomButton label="Create your account" type="submit" onClick={handleSubmit} fullWidth />
        <CustomButton label="Have an account already?" type="button" onClick={handleBack} variant="link" />
      </Card>
    </div>
    );
};

export default Registration;