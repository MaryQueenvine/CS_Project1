// src/pages/TriageChatbotPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import Header from '../pages/Header'; // ✅ Reused header
import './TriageChatbotPage.css';

const TriageChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const flaggedKeywords = ['suicide', 'self-harm', 'kill myself', 'depressed'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputMsg.trim()) return;

    const userMessage = {
      sender: 'user',
      text: inputMsg,
      timestamp: new Date().toISOString()
    };

    const detectedKeywords = flaggedKeywords.filter(keyword =>
      inputMsg.toLowerCase().includes(keyword)
    );

    const flagged = detectedKeywords.length > 0;
    const updatedMessages = [...messages, userMessage];

    if (flagged) {
      updatedMessages.push({
        sender: 'bot',
        text: 'We noticed your message may indicate distress. A therapist will review this.',
        flagged: true,
        keywords: detectedKeywords,
        timestamp: new Date().toISOString()
      });

      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const existingAlerts = JSON.parse(localStorage.getItem('emergencyAlerts')) || [];
      existingAlerts.push({
        studentEmail: currentUser.email || 'anonymous@student.com',
        timestamp: new Date().toISOString(),
        message: inputMsg,
        keywords: detectedKeywords
      });
      localStorage.setItem('emergencyAlerts', JSON.stringify(existingAlerts));
    } else {
      setIsTyping(true);
      setTimeout(() => {
        updatedMessages.push({
          sender: 'bot',
          text: 'Thank you for sharing. Would you like to talk more about this?',
          timestamp: new Date().toISOString()
        });
        setMessages(updatedMessages);
        setIsTyping(false);
      }, 1200);
    }

    setMessages(flagged ? updatedMessages : [...updatedMessages]);
    setInputMsg('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('triageChatHistory');
  };

  return (
    <>
      <Header />
      <main className="triage-chatbot-container">
        <div className="chatbot-header">
          <h2>Triage Chatbot</h2>
          <p>Start by telling us how you're feeling today.</p>
          <button className="clear-chat-btn" onClick={clearChat}>Clear Chat</button>
        </div>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button className="close-error" onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'} 
                          ${msg.flagged ? 'flagged-message' : ''}`}
            >
              <div className={`message-content ${msg.flagged ? 'error-message' : ''}`}>
                <p>{msg.text}</p>
                {msg.flagged && (
                  <span className="flagged-indicator">Flagged</span>
                )}
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message bot-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <textarea
            className="message-input"
            rows="2"
            placeholder="Type your message here..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-button" onClick={handleSend} disabled={!inputMsg.trim()}>
            Send
          </button>
        </div>

        <div className="disclaimer">
          <strong>Note:</strong> This chatbot is not a substitute for medical advice. If you’re in crisis, please seek professional help immediately.
        </div>
      </main>
    </>
  );
};

export default TriageChatbotPage;
