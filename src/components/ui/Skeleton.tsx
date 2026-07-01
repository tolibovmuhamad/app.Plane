import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-border-subtle',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'h-3 w-full rounded',
        variant === 'rect' && 'rounded-md',
        className
      )}
    />
  );
}
