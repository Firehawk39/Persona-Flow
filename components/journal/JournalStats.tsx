"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faBook, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const JournalStats: React.FC = () => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <FontAwesomeIcon icon={faFire} />
        </div>
        <div className="stat-info">
          <div className="stat-value">7</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <FontAwesomeIcon icon={faBook} />
        </div>
        <div className="stat-info">
          <div className="stat-value">24</div>
          <div className="stat-label">Total Entries</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
        <div className="stat-info">
          <div className="stat-value">3,247</div>
          <div className="stat-label">Words Written</div>
        </div>
      </div>

      <style jsx>{`
        .stats-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: var(--radius-md);
          transition: var(--transition-smooth);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          background: var(--white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: var(--accent-orange);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .stat-info {
          flex: 1;
        }

        .stat-value {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1;
          margin-bottom: 5px;
        }

        .stat-label {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default JournalStats;
