import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Popover({ trigger, children, className }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
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
    <div ref={popoverRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 mt-2 z-40 rounded-lg border border-border bg-surface-2 p-3 shadow-xl animate-in fade-in zoom-in-95 duration-100',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
