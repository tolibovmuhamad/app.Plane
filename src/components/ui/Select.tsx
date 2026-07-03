import React from 'react';
import { cn } from '@/lib/cn';
import { Label } from './Label';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  containerClassName?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, containerClassName, placeholder, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
        {label && <Label htmlFor={selectId}>{label}</Label>}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'flex h-9 w-full appearance-none rounded-md border bg-surface-2 px-3 py-1.5 text-sm text-text-primary transition-all focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-50 pr-8 [color-scheme:dark] cursor-pointer',
              error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-border focus:border-accent-primary',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom Arrow indicator */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

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

Select.displayName = 'Select';
