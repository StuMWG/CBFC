import React, {useState , useEffect } from "react";
import { Card } from "react-bootstrap";
import CustomButton from "../components/Button";
import TextField from "../components/InputField";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  const handleForgotPassword = () => {navigate("/");} //placeholder
  const handleRegistration = () => {navigate("/registration");}
  
  useEffect(() => {
      document.title = "Password Reset - CBFC";
    }, []);
    
    return (
        <div className="fullscreen-container">
          <Card className="shadow-lg p-4 text-left" style={{ width: "22rem" }}>
            <h2 className="title">Forgot Password?</h2>
            <div className="line"></div>
            <div className="warming-message" style={{marginTop: "5px", marginBottom: "5px"}}>
              That's okay. We will send a reset link to the email associated with your account.
            </div>
            <TextField label="Username" placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth/>
            <CustomButton label="Submit" type="button" onClick={handleForgotPassword} fullWidth />
            <div className="mt-3">
              <CustomButton label="Don't have an account?" type="button" onClick={handleRegistration} variant="link" />
            </div>
          </Card>
        </div>
      );
};

export default ForgotPassword;