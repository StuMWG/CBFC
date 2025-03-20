//import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import CustomButton from "../components/Button";
import "../styles/Dashboard.css";


const Registration: React.FC = () => {

  const navigate = useNavigate();

  const handleBudget = () => {
    navigate("/Budget");
  };

  const handleSettings = () => { 
    navigate("/Settings");
  }

  return (
    <div className="fullscreen-container">
      <Card className="shadow-lg p-4" style={{ width: "22rem" }}>
        <h2 className="text-center mb-4">Budget</h2>
        <CustomButton label="Budget" type="button" onClick={handleBudget} fullWidth />
        <h2 className="text-center mb-4">Settings</h2>
        <CustomButton label="Budget" type="button" onClick={handleSettings} fullWidth />
      </Card>
    </div>
    );
};

export default Registration;