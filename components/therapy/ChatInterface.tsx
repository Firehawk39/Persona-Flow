"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

type Message = {
  text: string;
  sender: 'user' | 'ai';
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm here to support you. How are you feeling today?", sender: 'ai' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiResponses = [
    "I understand. Can you tell me more about that?",
    "That's a valid feeling. How long have you been experiencing this?",
    "Thank you for sharing. What do you think might help in this situation?",
    "I hear you. Remember, it's okay to feel this way.",
    "That sounds challenging. What support do you have available?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage: Message = { text: randomResponse, sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-bubble">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-group">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="chat-send-btn" onClick={handleSend}>
          <span>Send</span>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-messages {
          height: 480px;
          overflow-y: auto;
          margin-bottom: 20px;
          padding: 20px;
          background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
          border-radius: var(--radius-md);
          border: 1px solid #e9ecef;
        }

        .message {
          margin-bottom: 20px;
          display: flex;
          gap: 12px;
          animation: slideIn 0.3s ease-out;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-bubble {
          max-width: 75%;
          padding: 14px 18px;
          border-radius: 18px;
          line-height: 1.6;
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          font-size: 0.95rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .message.ai .message-bubble {
          background: linear-gradient(135deg, var(--primary-green) 0%, #68984a 100%);
          color: white;
          border-bottom-left-radius: 4px;
        }

        .message.user .message-bubble {
          background: linear-gradient(135deg, #ffffff 0%, #f0f2f5 100%);
          color: var(--text-dark);
          border: 1px solid #e9ecef;
          border-bottom-right-radius: 4px;
        }

        .chat-input-group {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          padding: 14px 18px;
          border: 2px solid #e9ecef;
          border-radius: 25px;
          outline: none;
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          font-size: 0.95rem;
          transition: var(--transition-smooth);
        }

        .chat-input:focus {
          border-color: var(--primary-green);
          box-shadow: 0 0 0 3px rgba(116, 168, 74, 0.1);
        }

        .chat-send-btn {
          padding: 14px 28px;
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%);
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          transition: var(--transition-smooth);
          box-shadow: 0 4px 12px rgba(116, 168, 74, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-send-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(116, 168, 74, 0.4);
        }

        .chat-send-btn:active {
          transform: translateY(0);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .chat-messages {
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
