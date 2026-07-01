/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          remove(id);
        }, duration);
      }
    },
    [remove]
  );

  const success = useCallback((msg: string, dur?: number) => toast(msg, 'success', dur), [toast]);
  const error = useCallback((msg: string, dur?: number) => toast(msg, 'danger', dur), [toast]);
  const warning = useCallback((msg: string, dur?: number) => toast(msg, 'warning', dur), [toast]);
  const info = useCallback((msg: string, dur?: number) => toast(msg, 'info', dur), [toast]);

  const icons = {
    success: CheckCircle2,
    danger: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'border-success/30 bg-surface-2 text-success',
    danger: 'border-danger/30 bg-surface-2 text-danger',
    warning: 'border-warning/30 bg-surface-2 text-warning',
    info: 'border-info/30 bg-surface-2 text-info',
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {createPortal(
        <div className="fixed right-4 top-4 z-50 flex flex-col gap-3 w-full max-w-sm">
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <div
                key={t.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-4 shadow-xl animate-in slide-in-from-right-5 duration-200 bg-surface-1 text-text-primary',
                  colors[t.type]
                )}
                role="alert"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <div className="flex-1 text-sm font-medium text-text-primary">
                  {t.message}
                </div>
                <button
                  onClick={() => remove(t.id)}
                  className="rounded p-0.5 text-text-tertiary hover:bg-layer-1-hover hover:text-text-primary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
