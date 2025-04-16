import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, ListGroup, Alert } from 'react-bootstrap';
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
      // *** Assumption: GET endpoint to fetch the user's *current* budget ***
      const response = await axios.get<{ budget: BudgetData }>(`/api/budgets/user/${userId}`); 
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

  const handleSaveBudget = async () => {
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
      items: items.map(({ id, label, value }) => ({ label, value })) // Send only necessary item data
    };

    try {
      let response;
      if (budgetId) {
        // *** Assumption: PUT endpoint to update existing budget by ID ***
        console.log(`Updating budget ${budgetId}...`, budgetPayload);
        response = await axios.put(`/api/budgets/${budgetId}`, budgetPayload);
        console.log('Budget updated:', response.data);
        alert('Budget updated successfully!');
      } else {
        // *** Assumption: POST endpoint to create new budget ***
        console.log('Creating new budget...', budgetPayload);
        response = await axios.post('/api/budgets', budgetPayload);
        console.log('Budget created:', response.data);
        // Store the new budget ID after creation
        if (response.data && response.data.budget && response.data.budget.id) {
             setBudgetId(response.data.budget.id);
        }
        alert('Budget saved successfully!');
      }
      // Optionally refetch data after save to ensure consistency
      // fetchBudgetData(); 
    } catch (err: any) {
      console.error("Error saving budget:", err);
      setError("Failed to save budget. " + (err.response?.data?.message || err.message));
       alert("Failed to save budget. " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
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
              onClick={fetchBudgetData} // Re-fetches current budget for now
              title="Reload Saved Budget / View History (Placeholder)"
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
    </Container>
  );
};

export default Budget;