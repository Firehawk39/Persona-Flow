import React from 'react';
import { colors } from '@/lib/design-tokens';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = colors.primary,
}) => {
  const sizeMap = {
    sm: '20px',
    md: '40px',
    lg: '60px',
  };

  const borderWidth = {
    sm: '2px',
    md: '4px',
    lg: '6px',
  };

  return (
    <div
      style={{
        display: 'inline-block',
        width: sizeMap[size],
        height: sizeMap[size],
        border: `${borderWidth[size]} solid rgba(0,0,0,0.1)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
