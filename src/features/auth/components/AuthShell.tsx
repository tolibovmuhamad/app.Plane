import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Временная вёрстка экрана авторизации на Tailwind-токенах. Заменится/обернётся
 * в UI-компоненты Soleh (B0.1), но API страниц (поля, ошибки) останется тем же.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: { text: string; linkText: string; to: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface-1 p-8 shadow-lg">
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        <p className="mt-6 text-center text-sm text-text-secondary">
          {footer.text}{' '}
          <Link
            to={footer.to}
            className="font-medium text-text-primary underline-offset-2 hover:underline"
          >
            {footer.linkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
