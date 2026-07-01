import React from 'react';
import { cn } from '@/lib/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, disabled, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-center gap-2 select-none">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            className={cn(
              'peer h-4 w-4 shrink-0 rounded border bg-surface-2 text-accent-primary transition-all focus:outline-none focus:ring-1 focus:ring-accent-primary disabled:cursor-not-allowed disabled:opacity-50',
              error ? 'border-danger' : 'border-border',
              'accent-accent-primary', // Native styling coloring for compatibility
              className
            )}
            {...props}
          />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              'text-sm font-medium text-text-primary select-none cursor-pointer',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
