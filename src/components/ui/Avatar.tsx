import { useState } from 'react';
import { cn } from '@/lib/cn';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, name = 'User', size = 'sm', className }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  const sizeClasses = {
    xs: 'h-5 w-5 text-[9px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-border-strong font-medium text-text-primary border border-border-default',
        sizeClasses[size],
        className
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="select-none tracking-wider text-text-secondary">{initials}</span>
      )}
    </div>
  );
}
