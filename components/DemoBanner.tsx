'use client';
import { getDemoConfig } from '@/lib/demo-mode';

export default function DemoBanner() {
  const config = getDemoConfig();

  if (!config.showDemoBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '12px 20px',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: 9999,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <span style={{ fontSize: '20px' }}>🎭</span>
      <span>
        <strong>Demo Mode</strong> - Feel free to explore! Changes won't be saved. 
        <span style={{ 
          marginLeft: '8px', 
          padding: '4px 8px', 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          For Recruiters & Visitors
        </span>
      </span>
    </div>
  );
}
