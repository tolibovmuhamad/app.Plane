import React from 'react';
import { cn } from '@/lib/cn';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTabId, onTabChange, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-border w-full overflow-x-auto', className)}>
      <div className="flex gap-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-1 pb-2.5 text-sm font-semibold transition-all duration-150 relative -bottom-[1px]',
                isActive
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
