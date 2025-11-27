"use client";
import React from 'react';

const journalEntries = [
  {
    date: 'November 24, 2025',
    text: 'Today was a good day. I practiced mindfulness for 15 minutes and felt more centered throughout the day.',
  },
  {
    date: 'November 23, 2025',
    text: 'Feeling grateful for the small moments of peace. The breathing exercises really helped with my anxiety.',
  },
  {
    date: 'November 22, 2025',
    text: 'Had a challenging day but managed to stay positive. Looking forward to tomorrow.',
  },
];

const JournalTab: React.FC = () => {
  return (
    <div className="journal-tab">
      <div className="journal-entries">
        {journalEntries.map((entry, index) => (
          <div key={index} className="journal-entry">
            <div className="entry-date">{entry.date}</div>
            <div className="entry-text">{entry.text}</div>
          </div>
        ))}
      </div>

      <button className="new-entry-btn">
        + New Journal Entry
      </button>

      <style jsx>{`
        .journal-tab {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .journal-entries {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 20px;
        }

        .journal-entry {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          padding: 20px;
          border-radius: var(--radius-md);
          border-left: 4px solid var(--accent-orange);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: var(--transition-smooth);
        }

        .journal-entry:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .entry-date {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent-orange);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .entry-text {
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          color: var(--text-dark);
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .new-entry-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          margin-top: 15px;
          transition: var(--transition-smooth);
          box-shadow: 0 4px 12px rgba(116, 168, 74, 0.3);
        }

        .new-entry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(116, 168, 74, 0.4);
        }
      `}</style>
    </div>
  );
};

export default JournalTab;
