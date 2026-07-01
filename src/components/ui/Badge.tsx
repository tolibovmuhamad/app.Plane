import React from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'secondary';
  priority?: 'none' | 'low' | 'medium' | 'high' | 'urgent';
  className?: string;
}

export function Badge({ children, variant = 'default', priority, className }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold select-none border border-transparent';

  const variants = {
    default: 'bg-layer-2 text-text-primary border-border',
    success: 'bg-success-subtle text-success-text border-success/20',
    danger: 'bg-danger-subtle text-danger-text border-danger/20',
    warning: 'bg-warning-subtle text-warning-text border-warning/20',
    info: 'bg-info-subtle text-info-text border-info/20',
    secondary: 'bg-layer-1 text-text-secondary border-border-subtle',
  };

  const priorityStyles = {
    none: 'bg-layer-2 text-text-tertiary border-border',
    low: 'bg-info-subtle text-info-text border-info/20',
    medium: 'bg-warning-subtle text-warning-text border-warning/20',
    high: 'bg-danger-subtle text-danger-text border-danger/20',
    urgent: 'bg-danger text-text-on-accent animate-pulse border-danger-text/20',
  };

  const selectedStyles = priority ? priorityStyles[priority] : variants[variant];

  return (
    <span className={cn(baseStyles, selectedStyles, className)}>
      {priority && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full shrink-0',
            priority === 'none' && 'bg-text-tertiary',
            priority === 'low' && 'bg-info',
            priority === 'medium' && 'bg-warning',
            priority === 'high' && 'bg-danger',
            priority === 'urgent' && 'bg-text-on-accent'
          )}
        />
      )}
      {children}
    </span>
  );
}
