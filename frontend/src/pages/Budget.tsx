import React, { useEffect } from "react";
import Navbar from "../components/Navbar"


const Budget: React.FC = () => {

  useEffect(() => {
    document.title = "Budget - CBFC";
  }, []);

  return (
    <>
      <Navbar/>
        <div>
          <h1>Budget</h1>
        </div>
    </>
  );
};

export default Budget;