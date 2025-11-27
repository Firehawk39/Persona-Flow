"use client";
import React, { ReactNode } from 'react';

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
};

const Card: React.FC<CardProps> = ({ title, children, className = '', icon }) => {
  return (
    <div className={`therapy-card ${className}`}>
      {title && (
        <h3 className="card-title">
          {icon && <span className="card-icon">{icon}</span>}
          {title}
        </h3>
      )}
      {children}
      
      <style jsx>{`
        .therapy-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 30px;
          box-shadow: var(--shadow-card);
          margin-bottom: 30px;
          transition: var(--transition-smooth);
          border: 1px solid rgba(0, 0, 0, 0.04);
        }
        
        .therapy-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }
        
        .card-title {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 25px;
          color: var(--text-dark);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .card-icon {
          color: var(--accent-orange);
          font-size: 1.3rem;
          display: flex;
          align-items: center;
        }
        
        @media (max-width: 768px) {
          .therapy-card {
            padding: 25px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Card;
