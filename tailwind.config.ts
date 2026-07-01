import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Canvas & Surfaces
        canvas: 'var(--color-bg-canvas)',
        'surface-1': 'var(--color-bg-surface-1)',
        'surface-2': 'var(--color-bg-surface-2)',

        // Layers
        'layer-1': 'var(--color-bg-layer-1)',
        'layer-1-hover': 'var(--color-bg-layer-1-hover)',
        'layer-1-active': 'var(--color-bg-layer-1-active)',
        'layer-1-selected': 'var(--color-bg-layer-1-selected)',

        'layer-2': 'var(--color-bg-layer-2)',
        'layer-2-hover': 'var(--color-bg-layer-2-hover)',
        'layer-2-active': 'var(--color-bg-layer-2-active)',
        'layer-2-selected': 'var(--color-bg-layer-2-selected)',

        'layer-3': 'var(--color-bg-layer-3)',
        'layer-3-hover': 'var(--color-bg-layer-3-hover)',
        'layer-3-active': 'var(--color-bg-layer-3-active)',
        'layer-3-selected': 'var(--color-bg-layer-3-selected)',

        // Accents
        'accent-primary': 'var(--color-accent-primary)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-active': 'var(--color-accent-active)',

        // Typography
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-placeholder': 'var(--color-text-placeholder)',
        'text-on-accent': 'var(--color-text-on-accent)',

        // Borders
        border: 'var(--color-border-default)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-strong': 'var(--color-border-strong)',

        // Statuses
        success: 'var(--color-success)',
        'success-subtle': 'var(--color-success-subtle)',
        'success-text': 'var(--color-success-text)',

        danger: 'var(--color-danger)',
        'danger-subtle': 'var(--color-danger-subtle)',
        'danger-text': 'var(--color-danger-text)',

        warning: 'var(--color-warning)',
        'warning-subtle': 'var(--color-warning-subtle)',
        'warning-text': 'var(--color-warning-text)',

        info: 'var(--color-info)',
        'info-subtle': 'var(--color-info-subtle)',
        'info-text': 'var(--color-info-text)',

        // Brand Palette Scale
        'brand-100': 'var(--color-brand-100)',
        'brand-200': 'var(--color-brand-200)',
        'brand-300': 'var(--color-brand-300)',
        'brand-400': 'var(--color-brand-400)',
        'brand-500': 'var(--color-brand-500)',
        'brand-600': 'var(--color-brand-600)',
        'brand-700': 'var(--color-brand-700)',
        'brand-800': 'var(--color-brand-800)',
        'brand-900': 'var(--color-brand-900)',
        'brand-1000': 'var(--color-brand-1000)',
        'brand-1100': 'var(--color-brand-1100)',
        'brand-1200': 'var(--color-brand-1200)',
      },
      borderRadius: {
        xs: '0.125rem', // .125rem
        sm: '0.25rem',  // .25rem
        md: '0.375rem', // .375rem
        lg: '0.5rem',   // .5rem
        xl: '0.75rem',  // .75rem
        '2xl': '1rem',  // 1rem
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
