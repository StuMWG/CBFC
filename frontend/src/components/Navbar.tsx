import React from "react";
import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cblogo.png"; // Adjust path to your logo image
import profilePic from "../assets/profilepictureexample.png"; // Adjust path to profile image

const CBFCNavbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm px-4">
      <Navbar.Brand onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
        <img src={logo} alt="Logo" height="40" className="me-2" />
        <span className="fw-bold">CBFC</span>
      </Navbar.Brand>

      {/* Right Side - Profile Dropdown */}
      <Nav className="ms-auto">
        <Dropdown align="end">
          <Dropdown.Toggle as="div" className="d-flex align-items-center" style={{ cursor: "pointer" }}>
            <Image src={profilePic} roundedCircle width={40} height={40} className="border" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate("/profile")}>Profile</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/settings")}>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => navigate("/")}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default CBFCNavbar;