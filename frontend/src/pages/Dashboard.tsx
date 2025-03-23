//import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import CustomButton from "../components/Button";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";
import React, { useEffect } from "react";


const Registration: React.FC = () => {

  useEffect(() => {
    document.title = "Dashboard - CBFC";
  }, []);

  const navigate = useNavigate();

  const handleBudget = () => {
    navigate("/Budget");
  };

  return (
    <>
      <Navbar/>
      <div className="fullscreen-container">
        <Card className="shadow-lg p-4" style={{ width: "22rem" }}>
          <h2 className="text-center mb-4">Budget</h2>
          <CustomButton label="Budget" type="button" onClick={handleBudget} fullWidth />
        </Card>
      </div>
      </>
  );
};

export default Registration;