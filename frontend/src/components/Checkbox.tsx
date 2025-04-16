import React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <div className="form-check d-flex justify-content-left align-items-center"
    style={{padding: "0.5rem", margin: "0.5rem 0.5rem", borderRadius: "0.25rem", marginTop: "-.5rem", marginBottom: "0.5rem",}}>
      <input
        type="checkbox"
        className="form-check-input"
        checked={checked}
        onChange={onChange}
        style={{ margin: "0 0.5rem 0 0", }}
      />
      <label className="form-check-label mb-0">{label}</label>
    </div>
  );
};

export default Checkbox;