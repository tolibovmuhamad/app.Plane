import type { Config } from 'tailwindcss';

/**
 * Базовый конфиг (A0.1). Семантические дизайн-токены Plane (полная шкала,
 * OKLCH, статусы) заводит Soleh в B0.1 — здесь только каркас, ссылающийся
 * на CSS-переменные из `src/styles/globals.css`.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-bg-canvas)',
        'surface-1': 'var(--color-bg-surface-1)',
        'surface-2': 'var(--color-bg-surface-2)',
        'accent-primary': 'var(--color-accent-primary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        border: 'var(--color-border)',
      },
      borderRadius: {
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
