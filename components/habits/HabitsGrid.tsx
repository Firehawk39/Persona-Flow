"use client";
import React, { useState, useEffect } from 'react';
import HabitItem from './HabitItem';
import useLocalStorage from '../../hooks/useLocalStorage';

type Habit = {
  id: number;
  name: string;
  icon: string;
  streak: number;
  completed: boolean;
};

type HabitsGridProps = {
  onHabitsChange: (habits: Habit[]) => void;
};

const HabitsGrid: React.FC<HabitsGridProps> = ({ onHabitsChange }) => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', [
    { id: 1, name: 'Drink Water', icon: '💧', streak: 5, completed: false },
    { id: 2, name: 'Morning Run', icon: '🏃', streak: 2, completed: false },
    { id: 3, name: 'Read 30 Mins', icon: '📚', streak: 12, completed: false },
  ]);

  const [lastVisit, setLastVisit] = useLocalStorage('lastVisit', '');

  // Check if it's a new day and reset completed status
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastVisit !== today) {
      const resetHabits = habits.map((h) => ({ ...h, completed: false }));
      setHabits(resetHabits);
      setLastVisit(today);
    }
  }, []);

  // Notify parent of habits changes
  useEffect(() => {
    onHabitsChange(habits);
  }, [habits, onHabitsChange]);

  const handleToggle = (id: number) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const isCompleted = !habit.completed;
        return {
          ...habit,
          completed: isCompleted,
          streak: isCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
  };

  const addHabit = (name: string, icon: string) => {
    const newHabit: Habit = {
      id: Date.now(),
      name,
      icon,
      streak: 0,
      completed: false,
    };
    setHabits([...habits, newHabit]);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="habits-section">
      <div className="habits-header">
        <h2 className="section-title">My Habits</h2>
        <span className="date-display">{currentDate}</span>
      </div>

      <div className="habits-grid">
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            id={habit.id}
            name={habit.name}
            icon={habit.icon}
            streak={habit.streak}
            completed={habit.completed}
            onToggle={handleToggle}
          />
        ))}
      </div>

      <style jsx>{`
        .habits-section {
          width: 100%;
        }

        .habits-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .section-title {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-dark);
          margin: 0;
        }

        .date-display {
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          color: var(--text-light);
          font-weight: 500;
        }

        .habits-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .habits-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

// Export both the component and the addHabit function type
export default HabitsGrid;
export type { Habit };
