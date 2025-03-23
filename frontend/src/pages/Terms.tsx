
import { Card } from "react-bootstrap";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";

const Terms: React.FC = () => {

    return (
     <>
      <Navbar/>
        <div className="fullscreen-container">
            <Card className="shadow-lg p-4" style={{ width: "66rem" }}>
            <h2 className="text-center mb-4">Terms and Conditions</h2>
            <p className="fs-6">Around here, we only have one rule:</p>
          <p className="fs-6"></p>
          <p className="fs-6">Don't have too much fun ;)</p>
            </Card>
        </div>
      </>
      );
  };
  
  export default Terms;