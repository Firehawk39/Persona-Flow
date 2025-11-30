import React from 'react';
import { colors, borderRadius, shadows } from '@/lib/design-tokens';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  style = {},
  onClick,
  hoverable = false,
  padding = 'md',
}) => {
  const paddingStyles: Record<string, string> = {
    sm: '16px',
    md: '24px',
    lg: '40px',
  };

  const baseStyles: React.CSSProperties = {
    background: colors.background.glass,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${colors.border.glass}`,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.md,
    padding: paddingStyles[padding],
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverable || onClick) {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
      e.currentTarget.style.boxShadow = shadows.lg;
      e.currentTarget.style.border = `1px solid ${colors.border.glassHover}`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverable || onClick) {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = shadows.md;
      e.currentTarget.style.border = `1px solid ${colors.border.glass}`;
    }
  };

  return (
    <div
      style={baseStyles}
      className={className}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
};
