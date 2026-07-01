import React from 'react';
import { cn } from '@/lib/cn';
import { Label } from './Label';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, containerClassName, id, rows = 3, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
        {label && <Label htmlFor={textareaId}>{label}</Label>}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'flex w-full rounded-md border bg-surface-2 px-3 py-2 text-sm text-text-primary transition-all placeholder:text-text-placeholder focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[60px]',
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

Textarea.displayName = 'Textarea';
