import React from "react";
import Navbar from "../components/Navbar"
import { Card } from "react-bootstrap";
import profilePic from "../assets/profilepictureexample.png"; //placeholder

const user = {
    username: "Jimmy Bowling", //placeholder
    profilePic,
  };

const Profile: React.FC = () => {
    return (
      <>
        <Navbar />
        <div className="fullscreen-container">
          <Card className="shadow-lg p-4 text-left" style={{ width: "22rem" }}>
            <img src={user.profilePic} alt="Profile" className="profile-pic" />
            <h2 className="username">{user.username}</h2>
          </Card>
        </div>
      </>
    );
};
  

export default Profile;