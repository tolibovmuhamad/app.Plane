import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/** Поле формы с подписью и ошибкой (временное, до UI-компонентов Soleh). */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, error, id, className, ...props }, ref) {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(
            'rounded-md border bg-surface-2 px-3 py-2 text-sm text-text-primary',
            'outline-none placeholder:text-text-tertiary',
            'focus:border-accent-primary',
            error ? 'border-red-500' : 'border-border',
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  },
);
