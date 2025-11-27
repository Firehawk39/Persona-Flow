"use client";
import React, { useEffect, useState } from 'react';

type NotificationProps = {
  message: string;
  onClose: () => void;
};

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${isVisible ? 'slide-in' : 'slide-out'}`}>
      {message}
      
      <style jsx>{`
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--primary-green);
          color: white;
          padding: 15px 20px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          font-weight: 500;
        }
        
        .slide-in {
          animation: slideIn 0.3s ease forwards;
        }
        
        .slide-out {
          animation: slideOut 0.3s ease forwards;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Hook to manage notifications
export const useNotification = () => {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const NotificationComponent = notification ? (
    <Notification message={notification} onClose={() => setNotification(null)} />
  ) : null;

  return { showNotification, NotificationComponent };
};

export default Notification;
