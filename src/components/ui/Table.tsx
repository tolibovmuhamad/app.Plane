import React from 'react';
import { cn } from '@/lib/cn';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-surface-1">
      <table className={cn('min-w-full divide-y divide-border text-left text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-layer-1 text-text-secondary font-semibold text-xs uppercase tracking-wider', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-border bg-surface-1', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('hover:bg-layer-1-hover transition-colors duration-150', className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn('px-4 py-3 font-semibold select-none', className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3 whitespace-nowrap text-text-secondary text-sm', className)} {...props}>
      {children}
    </td>
  );
}
