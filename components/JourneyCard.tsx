"use client";
import React from 'react';
import Link from 'next/link';

type JourneyCardProps = {
  href: string;
  title: string;
  description: string;
};

const JourneyCard: React.FC<JourneyCardProps> = ({ href, title, description }) => {
  return (
    <Link href={href} className="journey-card">
      <h3 className="journey-card-title">{title}</h3>
      <p className="journey-card-description">{description}</p>
      
      <style jsx>{`
        .journey-card {
          position: relative;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px 24px;
          text-decoration: none;
          color: inherit;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
          display: block;
        }
        
        .journey-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, rgba(255, 140, 0, 0.6), rgba(255, 94, 0, 0.6));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .journey-card:hover::before {
          transform: scaleX(1);
        }
        
        .journey-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.35);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .journey-card-title {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: var(--text-dark);
          margin: 0 0 12px 0;
          letter-spacing: 0.5px;
        }
        
        .journey-card-description {
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          font-size: 14px;
          color: #585858;
          line-height: 1.6;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .journey-card {
            padding: 24px 20px;
          }
        }
      `}</style>
    </Link>
  );
};

export default JourneyCard;
