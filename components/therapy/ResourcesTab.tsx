"use client";
import React from 'react';

const resources = [
  {
    title: 'Mindfulness Meditation Guide',
    description: 'Learn the basics of mindfulness meditation and how to incorporate it into your daily routine.',
    link: '#',
  },
  {
    title: 'Breathing Exercises',
    description: 'Simple breathing techniques to help manage stress and anxiety in the moment.',
    link: '#',
  },
  {
    title: 'Sleep Hygiene Tips',
    description: 'Improve your sleep quality with evidence-based strategies for better rest.',
    link: '#',
  },
  {
    title: 'Cognitive Behavioral Techniques',
    description: 'Practical CBT strategies to challenge negative thought patterns.',
    link: '#',
  },
  {
    title: 'Crisis Helplines',
    description: 'Important contact information for mental health crisis support.',
    link: '#',
  },
];

const ResourcesTab: React.FC = () => {
  return (
    <div className="resources-tab">
      <div className="resources-list">
        {resources.map((resource, index) => (
          <div key={index} className="resource-card">
            <h4 className="resource-title">{resource.title}</h4>
            <p className="resource-description">{resource.description}</p>
            <a href={resource.link} className="resource-link">
              Learn More →
            </a>
          </div>
        ))}
      </div>

      <style jsx>{`
        .resources-tab {
          height: 100%;
        }

        .resources-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .resource-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: var(--transition-smooth);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .resource-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          border-color: var(--accent-orange);
        }

        .resource-title {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 10px;
        }

        .resource-description {
          font-family: var(--font-roboto), 'Roboto', sans-serif;
          font-size: 0.95rem;
          color: var(--text-light);
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .resource-link {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent-orange);
          text-decoration: none;
          transition: var(--transition-smooth);
          display: inline-block;
        }

        .resource-link:hover {
          color: var(--primary-dark);
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};

export default ResourcesTab;
