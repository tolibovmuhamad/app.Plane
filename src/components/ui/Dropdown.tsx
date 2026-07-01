import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, children, align = 'left', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer select-none">
        {trigger}
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className={cn(
            'absolute mt-1.5 z-40 w-56 rounded-lg border border-border bg-surface-2 p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-100 focus:outline-none',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  danger?: boolean;
}

export function DropdownItem({
  children,
  className,
  active,
  danger,
  ...props
}: DropdownItemProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
        active ? 'bg-layer-2-selected text-text-primary' : 'hover:bg-layer-2-hover text-text-secondary',
        danger && 'text-danger hover:bg-danger-subtle hover:text-danger-text',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Menu aliases
export const Menu = Dropdown;
export const MenuItem = DropdownItem;
