import React from "react";
// import Navbar from "../components/Navbar"; // Removed import
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";

const Settings: React.FC = () => {
  return (
    <>
      {/* <Navbar /> */ /* Removed instance */}
      <Container fluid className="mt-4 px-4">
        <Row>
          <Col lg={3} md={4} className="pe-lg-4">
            <Card>
              <Card.Header>Settings Menu</Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  <ListGroup.Item action href="#profile">Profile</ListGroup.Item>
                  <ListGroup.Item action href="#account">Account</ListGroup.Item>
                  <ListGroup.Item action href="#notifications">Notifications</ListGroup.Item>
                  <ListGroup.Item action href="#appearance">Appearance</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={9} md={8} className="ps-lg-4">
            <h1 className="mb-4">Settings</h1>
            <div id="profile" className="mb-5">
              <h2>Profile Settings</h2>
              <p>Placeholder for profile settings form...</p>
            </div>
            <div id="account" className="mb-5">
              <h2>Account Settings</h2>
              <p>Placeholder for account settings form...</p>
            </div>
            <div id="notifications" className="mb-5">
              <h2>Notification Settings</h2>
              <p>Placeholder for notification settings form...</p>
            </div>
            <div id="appearance" className="mb-5">
              <h2>Appearance Settings</h2>
              <p>Placeholder for appearance settings form...</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Settings;