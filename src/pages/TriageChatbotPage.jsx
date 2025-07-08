import React, { useState, useRef, useEffect } from 'react';
import './TriageChatbotPage.css';

const TriageChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Function to get CSRF token from Django
  const getCsrfToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  };

  // Alternative method to get CSRF token from meta tag
  const getCsrfTokenFromMeta = () => {
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    return csrfMeta ? csrfMeta.getAttribute('content') : '';
  };

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm here to help you with your mental health concerns. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, []);

  const sendMessage = async () => {
    /*const [sessionType, setSessionType] = useState('support'); // or 'triage'
// In your sendMessage function, include session type:
body: JSON.stringify({
  message: inputValue,
  session_type: sessionType
})*/

    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Get CSRF token
      const csrfToken = getCsrfToken() || getCsrfTokenFromMeta();
      
      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add CSRF token if available
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const response = await fetch('/api/chatbot/', {
        method: 'POST',
        headers: headers,
        credentials: 'include', // Include cookies for session-based auth
        body: JSON.stringify({ message: inputValue })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to get response';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      const botMessage = {
        id: messages.length + 2,
        text: data.reply,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        flagged: data.flagged || false,
        mock: data.mock || false
      };

      setMessages(prev => [...prev, botMessage]);

      // Handle flagged messages
      if (data.flagged) {
        console.warn('Message was flagged for mental health concerns');
        // You could add additional UI indicators here
      }

      // Show mock indicator
      if (data.mock) {
        console.log('Using mock response - configure API key for real responses');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
      
      const errorMessage = {
        id: messages.length + 2,
        text: `Sorry, I'm having trouble connecting right now. Error: ${error.message}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm here to help you with your mental health concerns. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setError(null);
  };

  return (
    <div className="triage-chatbot-container">
      <div className="chatbot-header">
        <h2>Mental Health Support Chat</h2>
        <p>Safe space to talk about your feelings</p>
        <button onClick={clearChat} className="clear-chat-btn">
          Clear Chat
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Connection Error:</strong> {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${
              message.isError ? 'error-message' : ''
            } ${message.flagged ? 'flagged-message' : ''}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{message.timestamp}</span>
              {message.mock && (
                <span className="mock-indicator">Mock Response</span>
              )}
              {message.flagged && (
                <span className="flagged-indicator">⚠️ Flagged</span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="message-input"
          rows="2"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="send-button"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div className="disclaimer">
        <p>
          <strong>Important:</strong> This is a support tool, not a replacement for professional help. 
          If you're in crisis, please contact emergency services or a mental health professional.
        </p>
      </div>
    </div>
  );
};

export default TriageChatbotPage;