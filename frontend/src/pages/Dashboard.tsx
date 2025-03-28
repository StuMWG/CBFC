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
      <div className="dashboard-flex-container">
        <div className="side-image-wrapper">
          <img src="/src/assets/stonks.jpg" alt="Left" className="side-image" />
        </div>

        <div className="dashboard-center">
          <div className="dashboard-grid">
            <div className="dashboard-item" onClick={() => navigate("/Budget")}>
              <h2>Budget</h2>
            </div>
            <div className="dashboard-item" onClick={() => navigate("/Reports")}>
              <h2>Reports</h2>
            </div>
            <div className="dashboard-item" onClick={() => navigate("/Nowhere")}>
              <h2>Some Other Third Thing</h2>
            </div>
          </div>
        </div>

        <div className="side-image-wrapper">
          <img src="/src/assets/piechartpie.jpg" alt="Right" className="side-image" />
        </div>
      </div>
    </>
  );
};

export default Registration;