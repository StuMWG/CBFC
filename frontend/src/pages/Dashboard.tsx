//import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <Navbar />
      <div className="dashboard-grid">
        <div className="dashboard-item" onClick={() => navigate("/Budget")}>
          <h2>Budget</h2>
        </div>
        <div className="dashboard-item" onClick={() => navigate("/Budget")}>
          <h2>Budget</h2>
        </div>
        <div className="dashboard-item" onClick={() => navigate("/Reports")}>
          <h2>Reportsdontclickthisdoesntgoanywhere</h2>
        </div>
      </div>
    </>
  );
};

export default Registration;