import React from 'react';
import { cn } from '@/lib/cn';
import { Label } from './Label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, hint, containerClassName, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        
        <input
          ref={ref}
          type={type}
          id={inputId}
          className={cn(
            'flex h-9 w-full rounded-md border bg-surface-2 px-3 py-1.5 text-sm text-text-primary transition-all placeholder:text-text-placeholder focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-border focus:border-accent-primary',
            className
          )}
          {...props}
        />

        {error && (
          <span className="text-xs font-medium text-danger animate-in fade-in duration-150">
            {error}
          </span>
        )}

        {hint && !error && (
          <span className="text-xs text-text-tertiary select-none">
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
