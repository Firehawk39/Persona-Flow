"use client";
import React, { useState } from 'react';

type AddHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, icon: string) => void;
};

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim() && habitIcon.trim()) {
      onAdd(habitName, habitIcon);
      setHabitName('');
      setHabitIcon('');
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>
          &times;
        </span>
        <h2>Add New Habit</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="habitName">Habit Name</label>
            <input
              type="text"
              id="habitName"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              required
              placeholder="e.g., Meditate"
            />
          </div>
          <div className="form-group">
            <label htmlFor="habitIcon">Icon (Emoji)</label>
            <input
              type="text"
              id="habitIcon"
              value={habitIcon}
              onChange={(e) => setHabitIcon(e.target.value)}
              required
              placeholder="e.g., 🧘"
              maxLength={2}
            />
          </div>
          <button type="submit" className="submit-btn">
            Create Habit
          </button>
        </form>
      </div>

      <style jsx>{`
        .modal {
          display: flex;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: var(--radius-lg);
          width: 90%;
          max-width: 400px;
          position: relative;
          box-shadow: var(--shadow-card);
        }

        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1.5rem;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-light);
          transition: var(--transition-smooth);
        }

        .close-modal:hover {
          color: var(--text-dark);
        }

        h2 {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-weight: 500;
          color: var(--text-dark);
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--radius-sm);
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          transition: var(--transition-smooth);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary-green);
          box-shadow: 0 0 0 3px rgba(116, 168, 74, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          background: var(--primary-green);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .submit-btn:hover {
          background: #62913d;
        }
      `}</style>
    </div>
  );
};

export default AddHabitModal;
