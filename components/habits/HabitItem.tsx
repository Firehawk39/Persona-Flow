"use client";
import React from 'react';

type HabitItemProps = {
  id: number;
  name: string;
  icon: string;
  streak: number;
  completed: boolean;
  onToggle: (id: number) => void;
};

const HabitItem: React.FC<HabitItemProps> = ({ id, name, icon, streak, completed, onToggle }) => {
  return (
    <div className="habit-item">
      <div className="habit-info">
        <div className="habit-icon">{icon}</div>
        <div className="habit-details">
          <h4 className="habit-name">{name}</h4>
          <span className="habit-streak">🔥 {streak} days</span>
        </div>
      </div>
      <div className="habit-check">
        <input
          type="checkbox"
          id={`habit-${id}`}
          className="habit-checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
        />
        <label htmlFor={`habit-${id}`}></label>
      </div>

      <style jsx>{`
        .habit-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background: white;
          border-radius: var(--radius-md);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: var(--transition-smooth);
          box-shadow: var(--shadow-sm);
        }

        .habit-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
          border-color: var(--primary-green);
        }

        .habit-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .habit-icon {
          width: 48px;
          height: 48px;
          background: var(--bg-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .habit-details {
          display: flex;
          flex-direction: column;
        }

        .habit-name {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-weight: 600;
          color: var(--text-dark);
          margin: 0;
          font-size: 1.1rem;
        }

        .habit-streak {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-top: 0.25rem;
        }

        .habit-check {
          position: relative;
          width: 32px;
          height: 32px;
        }

        .habit-checkbox {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .habit-check label {
          position: absolute;
          top: 0;
          left: 0;
          width: 32px;
          height: 32px;
          background: var(--bg-soft);
          border-radius: 50%;
          cursor: pointer;
          transition: var(--transition-smooth);
          border: 2px solid transparent;
        }

        .habit-check label:after {
          content: '';
          position: absolute;
          display: none;
          left: 10px;
          top: 6px;
          width: 8px;
          height: 14px;
          border: solid white;
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
        }

        .habit-checkbox:checked + label {
          background: var(--primary-green);
          box-shadow: 0 4px 10px rgba(116, 168, 74, 0.3);
        }

        .habit-checkbox:checked + label:after {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default HabitItem;
