import React from "react";
import { Button } from "react-bootstrap";

interface CustomButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  variant?: string;
  onClick?: () => void;
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, type = "button", variant = "primary", onClick, fullWidth = false }) => {
  return (
    <Button variant={variant} type={type} onClick={onClick} className={fullWidth ? "w-100" : ""}>
      {label}
    </Button>
  );
};

export default CustomButton;
