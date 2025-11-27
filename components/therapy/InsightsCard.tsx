"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faChartBar, faSmile } from '@fortawesome/free-solid-svg-icons';

const InsightsCard: React.FC = () => {
  return (
    <div className="insights-grid">
      <div className="stat-item">
        <div className="stat-icon">🔥</div>
        <div className="stat-info">
          <div className="stat-value">7</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon">
          <FontAwesomeIcon icon={faChartBar} />
        </div>
        <div className="stat-info">
          <div className="stat-value">12</div>
          <div className="stat-label">Sessions</div>
        </div>
      </div>

      <div className="stat-item full-width">
        <div className="stat-icon">
          <FontAwesomeIcon icon={faSmile} />
        </div>
        <div className="stat-info">
          <div className="stat-value">Good</div>
          <div className="stat-label">Average Mood</div>
        </div>
      </div>

      <style jsx>{`
        .insights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .stat-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: var(--transition-smooth);
          border: 1px solid transparent;
        }

        .stat-item.full-width {
          grid-column: span 2;
          flex-direction: row;
          justify-content: center;
          gap: 15px;
        }

        .stat-item:hover {
          background: var(--white);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 1.8rem;
          margin-bottom: 8px;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--white);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          color: var(--accent-orange);
        }

        .stat-item.full-width .stat-icon {
          margin-bottom: 0;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-item.full-width .stat-info {
          align-items: flex-start;
          text-align: left;
        }

        .stat-value {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-weight: 700;
          font-size: 1.4rem;
          color: var(--text-dark);
          line-height: 1.2;
        }

        .stat-label {
          font-family: var(--font-jost), 'Jost', sans-serif;
          color: var(--text-light);
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default InsightsCard;
