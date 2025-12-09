'use client';

export default function ModeIndicator() {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  if (!isDemoMode) return null; // Hide in personal mode
  
  return (
    <div style={{
      position: 'fixed',
      top: 80,
      right: 20,
      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '25px',
      fontSize: '13px',
      fontWeight: '700',
      zIndex: 9999,
      boxShadow: '0 8px 24px rgba(249, 115, 22, 0.4)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'fadeIn 0.5s ease-out',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    }}>
      <span style={{ fontSize: '16px' }}>🎯</span>
      Demo Mode
    </div>
  );
}
