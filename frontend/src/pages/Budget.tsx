import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, ListGroup, Alert, Modal, Button as BootstrapButton } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FaTrash, FaSave, FaHistory } from 'react-icons/fa'; // Import icons
import axios from 'axios'; // Import axios

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface BudgetItemData { // Interface for API data (might differ slightly)
  id: string; // Assuming backend uses string IDs (like UUIDs) or number
  label: string;
  value: number;
}

interface BudgetItem extends BudgetItemData {
  _id?: string; // Optional internal ID if needed, or just use id
}

interface BudgetData {
  id: string; 
  user_id: string;
  title: string;
  total_amount: number;
  items: BudgetItemData[];
  created_at?: string;
  updated_at?: string;
}

interface BudgetHistoryModalProps {
  show: boolean;
  onHide: () => void;
  budgets: BudgetData[];
  onSelectBudget: (budget: BudgetData) => void;
  onDeleteBudget: (budgetId: string) => void;
}

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const BudgetHistoryModal: React.FC<BudgetHistoryModalProps> = ({ show, onHide, budgets, onSelectBudget, onDeleteBudget }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Budget History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {budgets.length === 0 ? (
          <p>No previous budgets found.</p>
        ) : (
          <div className="list-group">
            {budgets.map((budget) => (
              <div key={budget.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{budget.title}</h5>
                  <small className="text-muted">
                    Created: {new Date(budget.created_at || Date.now()).toLocaleDateString()}
                  </small>
                </div>
                <div>
                  <BootstrapButton
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onSelectBudget(budget)}
                  >
                    Load
                  </BootstrapButton>
                  <BootstrapButton
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteBudget(budget.id)}
                  >
                    Delete
                  </BootstrapButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onHide, onConfirm, title, message }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Budget: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [budgetId, setBudgetId] = useState<string | null>(null); // Store ID of loaded/saved budget
  const [budgetTitle, setBudgetTitle] = useState<string>('Monthly Budget');
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [newItemLabel, setNewItemLabel] = useState<string>('');
  const [newItemValue, setNewItemValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [budgetHistory, setBudgetHistory] = useState<BudgetData[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [duplicateBudget, setDuplicateBudget] = useState<BudgetData | null>(null);
  const [isOverwriting, setIsOverwriting] = useState(false);

  // --- Get User ID ---
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.userId) {
          setUserId(userData.userId);
        } else {
          setError("User ID not found. Please log in again.");
           setIsLoading(false);
        }
      } catch (e) {
        setError("Failed to parse user data.");
         setIsLoading(false);
      }
    } else {
      setError("Not logged in."); // Or handle guest state
       setIsLoading(false);
    }
  }, []);

  // --- API Functions ---
  const fetchBudgetData = useCallback(async () => {
    if (!userId) return; // Don't fetch if no user ID
    
    setIsLoading(true);
    setError(null);
    console.log(`Fetching budget data for user ${userId}...`);
    try {
      // Update the API endpoint URL
      const response = await axios.get<{ budget: BudgetData }>(`http://localhost:5000/api/budgets/user/${userId}`); 
      if (response.data && response.data.budget) {
        const { id, title, total_amount, items: fetchedItems } = response.data.budget;
        setBudgetId(id);
        setBudgetTitle(title);
        setTotalIncome(total_amount);
        setItems(fetchedItems.map(item => ({ ...item }))); // Map to ensure correct interface
        console.log('Budget loaded:', response.data.budget);
      } else {
         // No existing budget found, keep defaults
         console.log('No existing budget found for user.');
         setBudgetId(null); // Ensure no ID is set if no budget exists
      }
    } catch (err: any) { // Use any for generic error handling
       if (err.response && err.response.status === 404) {
         console.log('No existing budget found (404).');
         setBudgetId(null); // No budget exists
       } else {
         console.error("Error fetching budget data:", err);
         setError("Failed to load budget data. " + (err.response?.data?.message || err.message));
       }
    } finally {
      setIsLoading(false);
    }
  }, [userId]); // Dependency on userId

  // Fetch data when userId is available
  useEffect(() => {
    if (userId) {
      fetchBudgetData();
    }
  }, [userId, fetchBudgetData]);

  // Add function to fetch budget history
  const fetchBudgetHistory = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get<{ budgets: BudgetData[] }>(`http://localhost:5000/api/budgets/user/${userId}/history`);
      setBudgetHistory(response.data.budgets);
    } catch (error) {
      console.error("Error fetching budget history:", error);
      setError("Failed to load budget history");
    }
  };

  // Add function to handle budget deletion
  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/budgets/${budgetId}`);
      // If the deleted budget was the current one, reset the form
      if (budgetId === budgetId) {
        setBudgetId(null);
        setBudgetTitle('Monthly Budget');
        setTotalIncome(0);
        setItems([]);
      }
      // Refresh the history
      fetchBudgetHistory();
      alert('Budget deleted successfully');
    } catch (error) {
      console.error("Error deleting budget:", error);
      setError("Failed to delete budget");
    }
  };

  // Update handleSaveBudget to include validation
  const handleSaveBudget = async () => {
    if (!userId) {
      setError("Cannot save budget. User not identified.");
      return;
    }

    // Validate that the budget is not blank
    if (totalIncome <= 0) {
      setError("Total income must be greater than 0");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one budget item");
      return;
    }

    setIsSaving(true);
    setError(null);

    const budgetPayload = {
      user_id: userId,
      title: budgetTitle,
      total_amount: totalIncome,
      items: items.map(({ id, label, value }) => ({ label, value }))
    };

    try {
      // Only check for duplicates if we're not overwriting
      if (!isOverwriting) {
        const response = await axios.get(`http://localhost:5000/api/budgets/user/${userId}/history`);
        const existingBudget = response.data.budgets.find((b: BudgetData) => b.title === budgetTitle);

        if (existingBudget) {
          setDuplicateBudget(existingBudget);
          setShowConfirmationModal(true);
          setIsSaving(false);
          return;
        }
      }

      // Create new budget
      const saveResponse = await axios.post('http://localhost:5000/api/budgets', budgetPayload);
      console.log('Budget created:', saveResponse.data);
      if (saveResponse.data && saveResponse.data.budget && saveResponse.data.budget.id) {
        setBudgetId(saveResponse.data.budget.id);
      }
      alert('Budget saved successfully!');
      fetchBudgetHistory();
    } catch (err: any) {
      console.error("Error saving budget:", err);
      setError("Failed to save budget. " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
      setIsOverwriting(false);
    }
  };

  const handleConfirmOverwrite = async () => {
    if (!userId) {
      setError("Cannot save budget. User not identified.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const budgetPayload = {
      user_id: userId,
      title: budgetTitle,
      total_amount: totalIncome,
      items: items.map(({ id, label, value }) => ({ label, value }))
    };

    try {
      const saveResponse = await axios.post('http://localhost:5000/api/budgets', budgetPayload);
      console.log('Budget updated:', saveResponse.data);
      if (saveResponse.data && saveResponse.data.budget && saveResponse.data.budget.id) {
        setBudgetId(saveResponse.data.budget.id);
      }
      alert('Budget updated successfully!');
      fetchBudgetHistory();
    } catch (err: any) {
      console.error("Error updating budget:", err);
      setError("Failed to update budget. " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
      setShowConfirmationModal(false);
    }
  };

  // Update the View History button click handler
  const handleViewHistory = async () => {
    await fetchBudgetHistory();
    setShowHistoryModal(true);
  };

  // Add function to handle selecting a budget from history
  const handleSelectBudget = (budget: BudgetData) => {
    setBudgetId(budget.id);
    setBudgetTitle(budget.title);
    setTotalIncome(budget.total_amount);
    setItems(budget.items.map(item => ({ ...item })));
    setShowHistoryModal(false);
  };

  // --- Event Handlers (Modified for potential future item-specific saves) ---
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(newItemValue);
    if (newItemLabel.trim() && !isNaN(value) && value > 0) {
      const newItem: BudgetItem = {
        id: `temp-${Date.now()}`, // Temporary client-side ID 
        label: newItemLabel.trim(),
        value: value,
      };
      setItems([...items, newItem]);
      setNewItemLabel('');
      setNewItemValue('');
      // Note: Item is only saved when "Save Budget" is clicked with current setup
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
     // Note: Item deletion is only persisted when "Save Budget" is clicked
  };

  // --- Calculations (Keep as is) ---
   const totalAllocated = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  const remainingBalance = useMemo(() => {
    return totalIncome - totalAllocated;
  }, [totalIncome, totalAllocated]);

  // --- Chart Data & Options (Keep as is) ---
   const chartData = useMemo(() => {
    return {
      labels: items.map(item => item.label),
      datasets: [
        {
          label: 'Amount Allocated',
          data: items.map(item => item.value),
          backgroundColor: [ 
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
             // Add more colors if needed
          ],
          borderColor: [
             'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
             // Match border colors
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [items]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Budget Allocation Breakdown',
        color: '#FFF',
         font: { size: 16 }
      },
       tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
            }
             const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
             const percentage = ((context.parsed / total) * 100).toFixed(1);
             label += ` (${percentage}%)`;
            return label;
          }
        }
      }
    },
  };

  // --- Render Logic ---
  if (error && !isLoading) {
     return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  }

  if (isLoading) {
     return <Container className="mt-4"><Alert variant="info">Loading Budget...</Alert></Container>;
  }

  return (
    <Container fluid className="mt-4 px-4">
       <Row className="mb-3 align-items-center">
         <Col>
           {/* Allow editing title? Maybe later. For now, display it. */}
           <Form.Control 
             type="text" 
             value={budgetTitle} 
             onChange={(e) => setBudgetTitle(e.target.value)} 
             placeholder="Budget Title" 
             className="h1-input" // Style this class if needed for h1 look
             style={{fontSize: '1.75rem', fontWeight: 500, border: 'none', background: 'transparent', color: 'inherit'}} // Basic inline style
           />
         </Col>
         <Col xs="auto" className="d-flex gap-2">
            {/* Placeholder: View Previous Budgets Button */} 
            <Button 
              variant="outline-secondary" 
              onClick={handleViewHistory}
              title="View Budget History"
            >
               <FaHistory /> View History
            </Button>
           <Button 
             variant="success" 
             onClick={handleSaveBudget} 
             disabled={isSaving}
           >
             <FaSave /> {isSaving ? 'Saving...' : 'Save Budget'}
           </Button>
         </Col>
       </Row>
        {error && <Alert variant="danger">{error}</Alert>}

      {/* Rest of the layout remains largely the same... */}
       <Row className="mb-4"> 
          {/* Income Card */}
          <Col md={6} className="mb-3 mb-md-0">
            <Card>
              <Card.Body>
                <Card.Title>Total Monthly Income</Card.Title>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="Enter total income"
                    value={totalIncome === 0 ? '' : totalIncome.toString()}
                    onChange={(e) => setTotalIncome(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </InputGroup>
              </Card.Body>
            </Card>
          </Col>
          {/* Summary Card */}
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Summary</Card.Title>
                 <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Total Income:</span> 
                    <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalIncome)}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Total Allocated:</span> 
                    <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAllocated)}</strong>
                    </ListGroup.Item>
                  <ListGroup.Item 
                    className={`d-flex justify-content-between ${remainingBalance < 0 ? 'text-danger' : 'text-success'}`}
                  >
                    <span>Remaining Balance:</span> 
                    <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(remainingBalance)}</strong>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

       <Row> 
         {/* Budget Items List and Form */}
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header as="h5">Budget Categories</Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddItem}>
                <Row>
                  <Col sm={6}>
                    <Form.Group controlId="newItemLabel" className="mb-2">
                      <Form.Label>Category Label</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Rent, Groceries"
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={4}>
                     <Form.Group controlId="newItemValue" className="mb-2">
                      <Form.Label>Amount</Form.Label>
                      <InputGroup>
                         <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          placeholder="Amount"
                          value={newItemValue}
                          onChange={(e) => setNewItemValue(e.target.value)}
                          min="0.01"
                          step="0.01"
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col sm={2} className="d-flex align-items-end mb-2">
                     <Button type="submit" variant="primary" className="w-100">Add</Button>
                  </Col>
                </Row>
              </Form>
              <hr />
              {items.length === 0 ? (
                <Alert variant="info">No budget items added yet.</Alert>
              ) : (
                <ListGroup>
                  {items.map(item => (
                    <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{item.label}:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.value)}
                      </div>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item.id)} title="Delete Item">
                         <FaTrash />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Chart */}
        <Col md={6} className="mb-4">
          <Card>
             <Card.Header as="h5">Allocation Chart</Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>{/* Ensure body has height */}
              {items.length > 0 ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}> {/* Wrapper for sizing */} 
                    <Pie data={chartData} options={chartOptions} />
                 </div>
              ) : (
                 <Alert variant="light" className="text-center">Add budget items to see the chart.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmOverwrite}
        title="Budget Already Exists"
        message={`A budget with the title "${budgetTitle}" already exists. Would you like to overwrite it?`}
      />
      
      <BudgetHistoryModal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        budgets={budgetHistory}
        onSelectBudget={handleSelectBudget}
        onDeleteBudget={handleDeleteBudget}
      />
    </Container>
  );
};

export default Budget;