"use client";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faBook, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import ChatInterface from './ChatInterface';
import JournalTab from './JournalTab';
import ResourcesTab from './ResourcesTab';

type Tab = 'chat' | 'journal' | 'resources';

const TabbedInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="tab-container">
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <FontAwesomeIcon icon={faComments} />
          <span>AI Chat</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'journal' ? 'active' : ''}`}
          onClick={() => setActiveTab('journal')}
        >
          <FontAwesomeIcon icon={faBook} />
          <span>Journal</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          <FontAwesomeIcon icon={faLightbulb} />
          <span>Resources</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'journal' && <JournalTab />}
        {activeTab === 'resources' && <ResourcesTab />}
      </div>

      <style jsx>{`
        .tab-container {
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          min-height: 650px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .tabs-header {
          display: flex;
          background: linear-gradient(to bottom, #f8f9fa 0%, #f0f2f5 100%);
          padding: 8px;
          gap: 8px;
          border-bottom: 2px solid #e9ecef;
        }

        .tab-btn {
          flex: 1;
          padding: 14px 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-light);
          transition: var(--transition-smooth);
          border-radius: var(--radius-sm);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .tab-btn:hover {
          color: var(--primary-dark);
          background: rgba(255, 255, 255, 0.5);
        }

        .tab-btn.active {
          background: var(--white);
          color: var(--primary-dark);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .tab-btn.active :global(svg) {
          color: var(--accent-orange);
        }

        .tab-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .tab-container {
            min-height: 500px;
          }

          .tabs-header {
            flex-wrap: wrap;
          }

          .tab-btn {
            font-size: 0.85rem;
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default TabbedInterface;
