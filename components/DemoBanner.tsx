'use client';

export default function DemoBanner() {
  const isDemoMode = process.env.NEXT_PUBLIC_APP_MODE === 'demo';
  
  if (!isDemoMode) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '14px 20px',
      textAlign: 'center',
      fontSize: '14px',
      zIndex: 9998,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      borderTop: '1px solid rgba(255,255,255,0.2)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: '600', fontSize: '15px' }}>
          🎯 <strong>Demo Mode</strong>
        </span>
        <span style={{ opacity: 0.95 }}>
          You're exploring a showcase version with mock data.
        </span>
        <a 
          href="https://github.com/yourusername/personaflow" 
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            padding: '6px 16px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            border: '1px solid rgba(255,255,255,0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          }}
        >
          View Source Code →
        </a>
      </div>
    </div>
  );
}
