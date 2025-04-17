import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import '../styles/FinancialChatbot.css';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

const FinancialChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add initial greeting
  useEffect(() => {
    setMessages([
      {
        type: 'bot',
        content: 'Hi! I\'m your financial assistant. I can help you with budgeting, saving tips, and general financial advice. How can I help you today?'
      }
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post(
        'http://localhost:5000/api/chatbot/chat',
        { question: userMessage },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.response) {
        setTimeout(() => {
          setMessages(prev => [...prev, { type: 'bot', content: response.data.response }]);
          setIsLoading(false);
        }, 500);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error getting response:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.message === 'Authentication token not found') {
        errorMessage = 'Please log in to use the chatbot.';
      }

      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: errorMessage
      }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        {!isOpen ? (
          <Button 
            variant="primary" 
            className="chatbot-toggle-button"
            onClick={() => setIsOpen(true)}
          >
            Chat with Assistant
          </Button>
        ) : (
          <Card className="chatbot-card">
            <Card.Header className="chatbot-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Financial Assistant</h5>
                  <small className="text-muted">Ask general financial questions</small>
                </div>
                <Button 
                  variant="link" 
                  className="p-0" 
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="chatbot-body">
              <div className="messages-container">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
                  >
                    {message.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="message bot-message">
                    <Spinner animation="border" size="sm" /> Thinking...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <Form onSubmit={handleSubmit} className="chatbot-form">
                <Form.Group className="d-flex">
                  <Form.Control
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a financial question..."
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isLoading || !input.trim()}
                    className="ms-2"
                  >
                    Send
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer className="chatbot-footer">
              <small className="text-muted">
                *This is an AI assistant providing general financial information. 
                Please consult with a qualified financial advisor for personalized advice.
              </small>
            </Card.Footer>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FinancialChatbot; 