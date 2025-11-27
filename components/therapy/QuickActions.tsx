"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpa, faMusic, faBook, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNotification } from '../shared/Notification';

const actions = [
  { icon: faSpa, text: 'Meditation', color: '#9b59b6' },
  { icon: faMusic, text: 'Relaxing Music', color: '#3498db' },
  { icon: faBook, text: 'Journal Entry', color: '#e67e22' },
  { icon: faHeart, text: 'Affirmations', color: '#e74c3c' },
];

const QuickActions: React.FC = () => {
  const { showNotification, NotificationComponent } = useNotification();

  const handleActionClick = (text: string) => {
    showNotification(`${text} feature coming soon!`);
  };

  return (
    <>
      {NotificationComponent}
      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <div
            key={index}
            className="action-btn"
            onClick={() => handleActionClick(action.text)}
          >
            <div className="action-icon" style={{ color: action.color }}>
              <FontAwesomeIcon icon={action.icon} />
            </div>
            <span className="action-text">{action.text}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .quick-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .action-btn {
          background: var(--white);
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 25px 15px;
          border-radius: var(--radius-md);
          text-align: center;
          cursor: pointer;
          transition: var(--transition-smooth);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, var(--accent-orange-light) 0%, #fff 100%);
          opacity: 0;
          transition: var(--transition-smooth);
          z-index: 0;
        }

        .action-btn:hover::before {
          opacity: 1;
        }

        .action-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          border-color: rgba(255, 140, 0, 0.3);
        }

        .action-icon {
          font-size: 2.2rem;
          margin-bottom: 15px;
          display: inline-block;
          position: relative;
          z-index: 1;
          transition: var(--transition-smooth);
          filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.05));
        }

        .action-btn:hover .action-icon {
          transform: scale(1.15) rotate(3deg);
        }

        .action-text {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-dark);
          position: relative;
          z-index: 1;
          transition: var(--transition-smooth);
        }

        .action-btn:hover .action-text {
          color: var(--accent-orange);
        }

        @media (max-width: 768px) {
          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default QuickActions;
