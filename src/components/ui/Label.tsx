import React from 'react';
import { cn } from '@/lib/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-xs font-semibold text-text-secondary select-none flex items-center gap-1',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-danger font-bold">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
