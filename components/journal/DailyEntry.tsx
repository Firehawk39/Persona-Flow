"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faClock } from '@fortawesome/free-solid-svg-icons';
import { useNotification } from '../shared/Notification';

const DailyEntry: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [entryText, setEntryText] = useState('');
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    if (entryText.trim()) {
      // Save to localStorage
      const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      entries.push({
        date: new Date().toISOString(),
        text: entryText,
      });
      localStorage.setItem('journalEntries', JSON.stringify(entries));

      showNotification('Journal entry saved successfully!');
      setEntryText('');
    }
  };

  return (
    <>
      {NotificationComponent}
      <div className="daily-entry">
        <div className="entry-header">
          <div className="date-info">
            <FontAwesomeIcon icon={faCalendarDay} />
            <span>{currentDate}</span>
          </div>
          <div className="time-info">
            <FontAwesomeIcon icon={faClock} />
            <span>{currentTime}</span>
          </div>
        </div>

        <textarea
          className="journal-textarea"
          placeholder="What's on your mind today? This is a safe space to express yourself..."
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
        />

        <button className="save-btn" onClick={handleSave}>
          Save Entry
        </button>
      </div>

      <style jsx>{`
        .daily-entry {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .date-info,
        .time-info {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          font-size: 1rem;
        }

        .date-info {
          color: var(--text-dark);
          font-weight: 500;
        }

        .time-info {
          color: var(--text-light);
        }

        .date-info :global(svg),
        .time-info :global(svg) {
          color: var(--accent-orange);
        }

        .journal-textarea {
          flex: 1;
          min-height: 400px;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: var(--radius-md);
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          font-size: 1rem;
          line-height: 1.8;
          resize: vertical;
          transition: var(--transition-smooth);
        }

        .journal-textarea:focus {
          outline: none;
          border-color: var(--primary-green);
          box-shadow: 0 0 0 3px rgba(116, 168, 74, 0.1);
        }

        .save-btn {
          margin-top: 20px;
          padding: 14px 32px;
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          box-shadow: 0 4px 12px rgba(116, 168, 74, 0.3);
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(116, 168, 74, 0.4);
        }

        @media (max-width: 768px) {
          .entry-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .journal-textarea {
            min-height: 300px;
          }
        }
      `}</style>
    </>
  );
};

export default DailyEntry;
