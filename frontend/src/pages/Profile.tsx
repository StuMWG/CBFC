import React, { useState, useEffect } from "react";
// import Navbar from "../components/Navbar"; // Removed import
import { Card, Container } from "react-bootstrap";
import profilePic from "../assets/profilepictureexample.png"; //placeholder

// Removed static user object
// const user = {
//     username: "Jimmy Bowling", //placeholder
//     profilePic,
//   };

const Profile: React.FC = () => {
    // State to hold the username
    const [username, setUsername] = useState<string>("Jimmy Bowling"); // Default placeholder

    useEffect(() => {
        // Try to get user data from localStorage
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                if (userData && userData.username) {
                    setUsername(userData.username); // Set the actual username
                }
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                // Keep the default placeholder if parsing fails
            }
        } else {
            // If no user in localStorage, ensure placeholder is set (redundant here but good practice)
            setUsername("Jimmy Bowling"); 
        }
    }, []); // Empty dependency array means this runs once on mount

    return (
      // Wrap with Container for better layout consistency
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}> {/* Adjust 56px based on actual Navbar height */} 
        {/* Removed fullscreen-container div, using Container now */} 
        <Card className="shadow-lg p-4 text-center" style={{ width: "22rem" }}> {/* Centered text */}
          <Card.Img 
            variant="top" 
            src={profilePic} // Using the imported placeholder pic for now
            alt="Profile" 
            className="rounded-circle mx-auto mb-3" // Make image circular and centered
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          <Card.Body>
            <Card.Title as="h2">{username}</Card.Title> {/* Display state username */}
            {/* Add other profile details here later */}
          </Card.Body>
        </Card>
      </Container>
    );
};
  

export default Profile;