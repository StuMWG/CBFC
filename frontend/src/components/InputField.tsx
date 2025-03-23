import React from "react";
import { Form } from "react-bootstrap";

interface TextFieldProps {
  label: string;
  type?: "text" | "username"| "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  fullWidth = false,
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={fullWidth ? "w-100" : ""}
      />
    </Form.Group>
  );
};

export default TextField;