/**
 * Design Tokens for PersonaFlow
 * Centralized design system values for consistency across the application
 */

export const colors = {
  primary: '#f97316',
  primaryDark: '#ea580c',
  primaryLight: '#fb923c',
  
  text: {
    primary: '#4a4a4a',
    secondary: '#8b8b8b',
    light: '#ffffff',
  },
  
  background: {
    glass: 'rgba(255, 255, 255, 0.1)',
    glassHover: 'rgba(255, 255, 255, 0.15)',
    glassStrong: 'rgba(255, 255, 255, 0.08)',
  },
  
  border: {
    glass: 'rgba(255, 255, 255, 0.3)',
    glassHover: 'rgba(255, 255, 255, 0.5)',
  },
  
  mood: {
    happy: { bg: '#fbbf24', text: '#78350f' },
    sad: { bg: '#3b82f6', text: '#1e3a8a' },
    angry: { bg: '#ef4444', text: '#7f1d1d' },
    anxious: { bg: '#9b59d6', text: '#4a148c' },
  },
} as const;

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export const typography = {
  fontSize: {
    xs: '13px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '42px',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.6',
    loose: '1.8',
  },
} as const;

export const animation = {
  duration: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 2px 8px rgba(0,0,0,0.1)',
  md: '0 4px 12px rgba(0,0,0,0.1)',
  lg: '0 8px 24px rgba(0,0,0,0.1)',
  xl: '0 24px 48px rgba(0,0,0,0.05)',
  glow: '0 0 20px rgba(249, 115, 22, 0.3)',
} as const;

export const breakpoints = {
  mobile: '640px',
  tablet: '1024px',
  desktop: '1280px',
} as const;

// Helper function to create glass-morphism styles
export const glassStyle = (opacity: number = 0.1) => ({
  background: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${colors.border.glass}`,
  boxShadow: shadows.md,
});

// Helper function for transitions
export const transition = (property: string = 'all', duration: keyof typeof animation.duration = 'normal') => 
  `${property} ${animation.duration[duration]} ${animation.easing.default}`;
