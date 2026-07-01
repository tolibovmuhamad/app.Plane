import React from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 select-none';

    const variants = {
      primary: 'bg-accent-primary text-text-on-accent hover:bg-accent-hover active:bg-accent-active',
      secondary: 'bg-layer-2 text-text-primary hover:bg-layer-2-hover active:bg-layer-2-active border border-border',
      ghost: 'text-text-secondary hover:bg-layer-1-hover hover:text-text-primary active:bg-layer-1-active',
      danger: 'bg-danger text-text-on-accent hover:bg-danger-hover active:bg-danger-active',
      outline: 'border border-border text-text-primary hover:bg-layer-1-hover hover:text-text-primary active:bg-layer-1-active',
    };

    const sizes = {
      xs: 'px-2 py-1 text-xs gap-1',
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Spinner className="h-4 w-4 text-current animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
