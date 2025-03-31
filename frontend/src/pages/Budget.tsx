import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, InputGroup, Container } from "react-bootstrap";
import { FaMinus } from "react-icons/fa";
import "../styles/Budget.css"; // optional for custom styles

interface Field {
  id: number;
  label: string;
  value: string;
}

const Budget: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldCounter, setFieldCounter] = useState<number>(1);

  useEffect(() => {
    // Initialize with 8 default fields
    const initialFields: Field[] = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      label: `Label ${i + 1}`,
      value: "",
    }));
    setFields(initialFields);
    setFieldCounter(9);
  }, []);

  const addField = () => {
    const newField: Field = {
      id: fieldCounter,
      label: `Label ${fieldCounter}`,
      value: "",
    };
    setFields((prev) => [...prev, newField]);
    setFieldCounter(fieldCounter + 1);
  };

  const removeField = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleFieldChange = (
    id: number,
    key: "label" | "value",
    newValue: string
  ) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [key]: newValue } : field
      )
    );
  };

  const leftFields = fields.filter((_, index) => index % 2 === 0);
  const rightFields = fields.filter((_, index) => index % 2 !== 0);

  return (
    <div className="fullscreen-container">
    <Container className="p-4">
      {/* Static Amount Input */}
      <Form.Group className="mb-4">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </Form.Group>

      {/* Scrollable Field Columns */}
      <div className="field-scroll-container mb-4">
        <Row>
          <Col>
            {leftFields.map((field) => (
              <Form.Group key={field.id} className="mb-3">
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={field.label}
                    onChange={(e) =>
                      handleFieldChange(field.id, "label", e.target.value)
                    }
                    placeholder="Label"
                    className="me-2"
                  />
                  <Form.Control
                    type="text"
                    value={field.value}
                    onChange={(e) =>
                      handleFieldChange(field.id, "value", e.target.value)
                    }
                    placeholder="Value"
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeField(field.id)}
                  >
                    <FaMinus />
                  </Button>
                </InputGroup>
              </Form.Group>
            ))}
          </Col>

          <Col>
            {rightFields.map((field) => (
              <Form.Group key={field.id} className="mb-3">
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={field.label}
                    onChange={(e) =>
                      handleFieldChange(field.id, "label", e.target.value)
                    }
                    placeholder="Label"
                    className="me-2"
                  />
                  <Form.Control
                    type="text"
                    value={field.value}
                    onChange={(e) =>
                      handleFieldChange(field.id, "value", e.target.value)
                    }
                    placeholder="Value"
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeField(field.id)}
                  >
                    <FaMinus />
                  </Button>
                </InputGroup>
              </Form.Group>
            ))}
          </Col>
        </Row>
      </div>

      {/* Fixed Add Button */}
      <div className="text-center">
        <Button onClick={addField} className="fixed-add-button">
          + Add Field
        </Button>
      </div>
    </Container>
    </div>
  );
};

export default Budget;