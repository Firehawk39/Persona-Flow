"use client";
import React from 'react';

const CalendarPlaceholder: React.FC = () => {
  return (
    <div className="calendar-placeholder">
      <div className="placeholder-content">
        <div className="placeholder-icon">📅</div>
        <h4 className="placeholder-title">Calendar View</h4>
        <p className="placeholder-text">Coming Soon</p>
      </div>

      <style jsx>{`
        .calendar-placeholder {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: var(--radius-md);
          padding: 40px 20px;
          text-align: center;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .placeholder-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .placeholder-title {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 8px;
        }

        .placeholder-text {
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          font-size: 0.9rem;
          color: var(--text-light);
        }
      `}</style>
    </div>
  );
};

export default CalendarPlaceholder;
