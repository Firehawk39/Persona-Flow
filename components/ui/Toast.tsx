'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { colors, borderRadius, shadows } from '@/lib/design-tokens';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastStyles = (type: ToastType): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      padding: '16px 24px',
      borderRadius: borderRadius.lg,
      boxShadow: shadows.lg,
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '300px',
      maxWidth: '500px',
      animation: 'slideIn 0.3s ease-out',
      backdropFilter: 'blur(20px)',
    };

    const typeStyles: Record<ToastType, React.CSSProperties> = {
      success: {
        background: 'rgba(34, 197, 94, 0.9)',
        color: 'white',
        border: '1px solid rgba(34, 197, 94, 1)',
      },
      error: {
        background: 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        border: '1px solid rgba(239, 68, 68, 1)',
      },
      warning: {
        background: 'rgba(251, 146, 60, 0.9)',
        color: 'white',
        border: '1px solid rgba(251, 146, 60, 1)',
      },
      info: {
        background: 'rgba(59, 130, 246, 0.9)',
        color: 'white',
        border: '1px solid rgba(59, 130, 246, 1)',
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = (type: ToastType) => {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type];
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={getToastStyles(toast.type)}
            role="alert"
          >
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {getIcon(toast.type)}
            </span>
            <span style={{ flex: 1, fontSize: '15px', fontWeight: '500' }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '0',
                opacity: 0.7,
              }}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
