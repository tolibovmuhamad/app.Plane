import React from 'react';
import { cn } from '@/lib/cn';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface AlertProps {
  variant?: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const icons = {
    success: CheckCircle2,
    danger: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  // Wait! AlertCircle is standard in lucide-react. Let's map it.
  const Icon = variant === 'danger' ? AlertCircle : icons[variant];

  const variants = {
    success: 'border-success/30 bg-success-subtle text-success-text',
    danger: 'border-danger/30 bg-danger-subtle text-danger-text',
    warning: 'border-warning/30 bg-warning-subtle text-warning-text',
    info: 'border-info/30 bg-info-subtle text-info-text',
  };

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border p-4 text-sm transition-all duration-150',
        variants[variant],
        className
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex flex-col gap-1">
        {title && <h5 className="font-semibold leading-none">{title}</h5>}
        <div className="leading-relaxed opacity-95">{children}</div>
      </div>
    </div>
  );
}
