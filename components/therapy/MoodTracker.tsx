"use client";
import React, { useState } from 'react';
import { useNotification } from '../shared/Notification';

type Mood = 'great' | 'good' | 'okay' | 'sad' | 'stressed';

const moods: { emoji: string; label: string; value: Mood }[] = [
  { emoji: '😊', label: 'Great', value: 'great' },
  { emoji: '🙂', label: 'Good', value: 'good' },
  { emoji: '😐', label: 'Okay', value: 'okay' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😰', label: 'Stressed', value: 'stressed' },
];

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const { showNotification, NotificationComponent } = useNotification();

  const handleMoodSelect = (mood: Mood, label: string) => {
    setSelectedMood(mood);
    showNotification(`Mood logged: ${label}`);
  };

  return (
    <>
      {NotificationComponent}
      <div className="mood-grid">
        {moods.map((mood) => (
          <div
            key={mood.value}
            className={`mood-item ${selectedMood === mood.value ? 'active' : ''}`}
            onClick={() => handleMoodSelect(mood.value, mood.label)}
          >
            <div className="mood-emoji">{mood.emoji}</div>
            <span className="mood-label">{mood.label}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .mood-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .mood-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: var(--transition-smooth);
          padding: 10px;
          border-radius: var(--radius-sm);
          backface-visibility: hidden;
        }

        .mood-emoji {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          width: 65px;
          height: 65px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-bottom: 12px;
          transition: var(--transition-smooth);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transform-origin: center center;
          will-change: transform;
        }

        .mood-item:hover {
          transform: translateY(-5px);
        }

        .mood-item:hover .mood-emoji,
        .mood-item.active .mood-emoji {
          background: linear-gradient(135deg, var(--accent-orange-light) 0%, #ffe4cc 100%);
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(255, 140, 0, 0.25);
        }

        .mood-label {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-light);
          transition: var(--transition-smooth);
          text-align: center;
        }

        .mood-item:hover .mood-label,
        .mood-item.active .mood-label {
          color: var(--accent-orange);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .mood-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }
        }

        @media (max-width: 544px) {
          .mood-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .mood-emoji {
            width: 55px;
            height: 55px;
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default MoodTracker;
