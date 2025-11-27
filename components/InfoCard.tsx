"use client";
import React from 'react';
import Image from 'next/image';

type InfoCardProps = {
  image: string;
  title: string;
  description: string;
  imageAlt: string;
};

const InfoCard: React.FC<InfoCardProps> = ({ image, title, description, imageAlt }) => {
  return (
    <div className="info-card">
      <div className="info-card-image">
        <Image 
          src={image} 
          alt={imageAlt} 
          width={400} 
          height={300} 
          style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
        />
      </div>
      <div className="info-card-content">
        <h3 className="info-card-title">{title}</h3>
        <p className="info-card-description">{description}</p>
      </div>
      
      <style jsx>{`
        .info-card {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: var(--transition-smooth);
          box-shadow: var(--shadow-card);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .info-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-hover);
        }
        
        .info-card-image {
          width: 100%;
          height: 250px;
          overflow: hidden;
        }
        
        .info-card-content {
          padding: 30px;
        }
        
        .info-card-title {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 15px;
        }
        
        .info-card-description {
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          font-size: 1rem;
          color: var(--text-light);
          line-height: 1.7;
        }
        
        @media (max-width: 768px) {
          .info-card-image {
            height: 200px;
          }
          
          .info-card-content {
            padding: 20px;
          }
          
          .info-card-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default InfoCard;
