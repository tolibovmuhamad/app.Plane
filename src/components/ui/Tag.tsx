import { cn } from '@/lib/cn';

interface TagProps {
  label: string;
  color?: string; // Hex color code e.g. "#ff0000"
  className?: string;
}

export function Tag({ label, color, className }: TagProps) {
  // Validate and parse hex color to generate background opacity or fallback styles
  const dotStyle = color ? { backgroundColor: color } : undefined;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded bg-layer-1 border border-border px-2 py-0.5 text-xs font-medium text-text-secondary select-none hover:text-text-primary hover:bg-layer-1-hover transition-colors cursor-pointer',
        className
      )}
    >
      <span
        className="h-2 w-2 rounded-full shrink-0 bg-text-tertiary"
        style={dotStyle}
      />
      <span className="truncate">{label}</span>
    </span>
  );
}
