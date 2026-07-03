import type { CSSProperties } from 'react';

interface LogoProps {
  /** Сторона квадрата-плитки, px. */
  size?: number;
  /** Скругление углов плитки, px. */
  radius?: number;
  /** Мягкая тень + внутренний блик (для «объёмного» вида). */
  glow?: boolean;
  /** Доп. стили обёртки (напр. marginBottom). */
  style?: CSSProperties;
}

/**
 * Логотип TaskFlow — единый бренд-знак.
 * Плитка с градиентом бренда + белый «flow»-знак: восходящая линия через узлы
 * (метафора потока задач и прогресса). Один компонент на все экраны.
 */
export function Logo({ size = 30, radius = 8, glow = true, style }: LogoProps): JSX.Element {
  const mark = Math.round(size * 0.62);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: 'linear-gradient(150deg,var(--accent) 0%,#8B5CF6 60%,#A855F7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: glow
          ? '0 4px 14px -4px rgba(99,102,241,.65), inset 0 1px 0 rgba(255,255,255,.28)'
          : 'inset 0 1px 0 rgba(255,255,255,.28)',
        ...style,
      }}
    >
      <svg width={mark} height={mark} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 16.5L9.5 11L13.5 14L20 6.5"
          stroke="#fff"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="6.5" r="2.4" fill="#fff" />
      </svg>
    </div>
  );
}
