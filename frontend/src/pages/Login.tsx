import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import CustomButton from "../components/Button";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Redirect to Dashboard
    navigate("/dashboard");
  };

  const handleRegistration = () => {
    // Redirect to Registration
    navigate("/registration");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "25rem", padding: "20px" }}>
        <h2 className="text-center">Login</h2>
        {/* Login Form Here */}
        <CustomButton label="Login" type="button" onClick={handleLogin} fullWidth />
      </Card>
      <Card style={{ width: "25rem", padding: "20px" }}>
        <h2 className="text-center">Registration</h2>
        {/* Registration Form Here */}
        <CustomButton label="Register" type="button" onClick={handleRegistration} fullWidth />
      </Card>
    </Container>
  );
};

export default Login;
