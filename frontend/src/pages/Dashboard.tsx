//import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
// import Navbar from "../components/Navbar"; // Removed import
import React, { useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import FinancialChatbot from '../components/FinancialChatbot';

const Dashboard: React.FC = () => { // Renamed component

  useEffect(() => {
    document.title = "Dashboard - CBFC";
  }, []);

  const navigate = useNavigate();

  // const handleBudget = () => { // This function seems unused now
  //   navigate("/Budget");
  // };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          {/* <Navbar /> */ /* Removed instance */}
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
        </Col>
        <Col md={4}>
          <FinancialChatbot />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; // Updated export