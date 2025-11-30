import React from 'react';
import { colors, borderRadius, shadows, animation } from '@/lib/design-tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    border: 'none',
    borderRadius: borderRadius.full,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    transition: `all ${animation.duration.normal} ${animation.easing.default}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled || isLoading ? 0.6 : 1,
    position: 'relative',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, #ff8c42 0%, ${colors.primary} 100%)`,
      color: colors.text.light,
      boxShadow: `0 4px 12px rgba(249, 115, 22, 0.3)`,
    },
    secondary: {
      background: colors.background.glass,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${colors.border.glass}`,
      color: colors.text.primary,
    },
    ghost: {
      background: 'transparent',
      color: colors.text.primary,
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '8px 16px',
      fontSize: '14px',
    },
    md: {
      padding: '14px 32px',
      fontSize: '16px',
    },
    lg: {
      padding: '16px 40px',
      fontSize: '18px',
    },
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    if (variant === 'primary') {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
      e.currentTarget.style.boxShadow = '0 8px 28px rgba(249, 115, 22, 0.5)';
    } else if (variant === 'secondary') {
      e.currentTarget.style.background = colors.background.glassHover;
      e.currentTarget.style.transform = 'scale(1.02)';
    } else {
      e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    if (variant === 'primary') {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
    } else if (variant === 'secondary') {
      e.currentTarget.style.background = colors.background.glass;
    } else {
      e.currentTarget.style.background = 'transparent';
    }
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
      className={className}
      disabled={disabled || isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
          aria-label="Loading"
        />
      )}
      {children}
    </button>
  );
};

// Add keyframes for loading spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
