import type { PriorityId, StateDef } from './types';

/** Named line-icon set (ported from the design's `ic(name)` builder). */
const iconPaths: Record<string, JSX.Element> = {
  home: (
    <path d="M2.5 7.5L8 3l5.5 4.5M4 6.5V13h8V6.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  ),
  home2: (
    <path d="M2.5 7.5L8 3l5.5 4.5M4 6.5V13h8V6.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  ),
  inbox: (
    <path d="M2.5 8.5h3l1 1.5h3l1-1.5h3M2.5 8.5l1.5-5h8l1.5 5v3.5a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V8.5Z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
  ),
  issues: (
    <g stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <circle cx={5} cy={5} r={2.2} />
      <circle cx={5} cy={11} r={2.2} />
      <path d="M9.5 5h4M9.5 11h4" />
    </g>
  ),
  arrow: (
    <path d="M6 3.5l4.5 4.5L6 12.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  ),
  plus: <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />,
  doc: (
    <path d="M4 2.5h5l3 3V13a.5.5 0 0 1-.5.5h-7A.5.5 0 0 1 4 13V2.5ZM9 2.5V5.5h3" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
  ),
  cycle: (
    <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5V5H10.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  ),
  grid: (
    <g stroke="currentColor" strokeWidth={1.4}>
      <rect x={2} y={2} width={5} height={5} rx={1.2} />
      <rect x={9} y={2} width={5} height={5} rx={1.2} />
      <rect x={2} y={9} width={5} height={5} rx={1.2} />
      <rect x={9} y={9} width={5} height={5} rx={1.2} />
    </g>
  ),
  wiki: (
    <path d="M2.5 3.2c1.6-.7 3.4-.7 5 0v9.6c-1.6-.7-3.4-.7-5 0V3.2ZM13.5 3.2c-1.6-.7-3.4-.7-5 0v9.6c1.6-.7 3.4-.7 5 0V3.2Z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" />
  ),
  sparkle: (
    <path d="M8 1.5c.5 2.6 1 3.9 2.4 5.3 1.4 1.4 2.7 1.9 5.3 2.4-2.6.5-3.9 1-5.3 2.4-1.4 1.4-1.9 2.7-2.4 5.3-.5-2.6-1-3.9-2.4-5.3-1.4-1.4-2.7-1.9-5.3-2.4 2.6-.5 3.9-1 5.3-2.4C7 5.4 7.5 4.1 8 1.5Z" fill="currentColor" />
  ),
  gear: (
    <g stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round">
      <circle cx={8} cy={8} r={2.3} />
      <path d="M8 2.2v1.6M8 12.2v1.6M13.8 8h-1.6M3.8 8H2.2M12.1 3.9l-1.1 1.1M5 10l-1.1 1.1M12.1 12.1 11 11M5 6 3.9 3.9" />
    </g>
  ),
  newpage: (
    <g stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round">
      <path d="M4 2.5h5l3 3V13a.5.5 0 0 1-.5.5h-7A.5.5 0 0 1 4 13V2.5Z" />
      <path d="M6.3 9h3.4M8 7.3v3.4" />
    </g>
  ),
  folder: (
    <path d="M2 4.3c0-.55.45-1 1-1h2.6l1.1 1.3H13c.55 0 1 .45 1 1v5.9c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V4.3Z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
  ),
  chat: (
    <path d="M2.5 4.5c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2v5c0 1.1-.9 2-2 2H6.5L3.5 14v-2.5h-1c-1.1 0-2-.9-2-2v-5Z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
  ),
  search: (
    <g stroke="currentColor" strokeWidth={1.4}>
      <circle cx={7} cy={7} r={4.3} />
      <path d="M10.2 10.2L14 14" strokeLinecap="round" />
    </g>
  ),
  arrowLeft: (
    <path d="M10 3.5L5.5 8l4.5 4.5" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  ),
  general: (
    <g stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round">
      <rect x={2} y={2.5} width={12} height={11} rx={1.5} />
      <path d="M2 6h12" strokeLinecap="round" />
    </g>
  ),
  members: (
    <g stroke="currentColor" strokeWidth={1.35} strokeLinecap="round">
      <circle cx={6} cy={6} r={2.2} />
      <path d="M2.3 13c0-2 1.7-3.3 3.7-3.3s3.7 1.3 3.7 3.3" />
      <circle cx={11.7} cy={6.8} r={1.7} />
      <path d="M9.9 13c0-1.5 1-2.6 2.3-2.9" />
    </g>
  ),
  billing: (
    <g stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round">
      <rect x={1.5} y={3.5} width={13} height={9} rx={1.4} />
      <path d="M1.5 6.5h13" strokeLinecap="round" />
    </g>
  ),
  imports: (
    <path d="M8 2v7.2M5.2 6.4L8 9.2l2.8-2.8M2.5 12.5h11" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  ),
  exports: (
    <path d="M8 11.2V4M5.2 6.8L8 4l2.8 2.8M2.5 12.5h11" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
  ),
  worklogs: (
    <g stroke="currentColor" strokeWidth={1.4}>
      <circle cx={8} cy={8} r={5.5} />
      <path d="M8 5v3.2l2.1 1.4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  identity: (
    <path d="M8 1.8l4.8 1.9v3.8c0 3.3-2 5.6-4.8 6.3-2.8-.7-4.8-3-4.8-6.3V3.7L8 1.8Z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
  ),
  briefcase: (
    <g stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round">
      <rect x={1.8} y={5} width={12.4} height={8.2} rx={1.5} />
      <path d="M5.7 5V3.8c0-.7.55-1.3 1.3-1.3h2c.75 0 1.3.6 1.3 1.3V5" />
      <path d="M1.8 8.5h12.4" strokeLinecap="round" />
    </g>
  ),
  personCircle: (
    <g stroke="currentColor" strokeWidth={1.4}>
      <circle cx={8} cy={8} r={5.8} />
      <circle cx={8} cy={6.6} r={1.9} />
      <path d="M4.2 12.2c.7-1.7 2.1-2.6 3.8-2.6s3.1.9 3.8 2.6" strokeLinecap="round" />
    </g>
  ),
  personPlus: (
    <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
      <circle cx={6.3} cy={6} r={2.3} />
      <path d="M1.8 13c0-2.2 2-3.6 4.5-3.6 1 0 1.9.2 2.7.6" />
      <path d="M11.5 5.5v4M9.5 7.5h4" />
    </g>
  ),
  logout: (
    <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2.5H3.5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1H6" />
      <path d="M10 11l3-3-3-3M13 8H6.5" />
    </g>
  ),
};

const moonPath = (
  <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5Z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
);
const sunPath = (
  <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
    <circle cx={8} cy={8} r={3} />
    <path d="M8 1.5v1.5M8 13v1.5M2.4 2.4l1 1M12.6 12.6l1 1M1.5 8h1.5M13 8h1.5M2.4 13.6l1-1M12.6 3.4l1-1" />
  </g>
);

export function Icon({ name, theme }: { name: string; theme?: 'dark' | 'light' }): JSX.Element {
  const child =
    name === 'theme' ? (theme === 'dark' ? moonPath : sunPath) : iconPaths[name] ?? iconPaths.doc;
  return (
    <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
      {child}
    </svg>
  );
}

export function PriorityIcon({ p }: { p: PriorityId }): JSX.Element {
  if (p === 'none') {
    return (
      <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
        <circle cx={8} cy={8} r={5.5} stroke="#6B7178" strokeWidth={1.5} strokeDasharray="2 2" />
      </svg>
    );
  }
  if (p === 'urgent') {
    return (
      <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
        <rect x={1.5} y={1.5} width={13} height={13} rx={3} fill="#EF4444" />
        <rect x={7} y={4} width={2} height={5} rx={1} fill="#fff" />
        <circle cx={8} cy={11.2} r={1.1} fill="#fff" />
      </svg>
    );
  }
  const map = {
    low: { n: 1, c: '#3B82F6' },
    medium: { n: 2, c: '#EAB308' },
    high: { n: 3, c: '#F59E0B' },
  } as const;
  const cfg = map[p as 'low' | 'medium' | 'high'] ?? map.medium;
  const bars = [
    { x: 1.5, h: 5 },
    { x: 6, h: 9 },
    { x: 10.5, h: 13 },
  ];
  return (
    <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={14 - b.h} width={3.2} height={b.h} rx={1} fill={i < cfg.n ? cfg.c : '#33363C'} />
      ))}
    </svg>
  );
}

export function StateIcon({ st }: { st: StateDef }): JSX.Element | null {
  const c = st.color;
  if (st.group === 'backlog')
    return (
      <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
        <circle cx={8} cy={8} r={5.5} stroke={c} strokeWidth={1.6} strokeDasharray="1.6 2.2" />
      </svg>
    );
  if (st.group === 'unstarted')
    return (
      <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
        <circle cx={8} cy={8} r={5.5} stroke={c} strokeWidth={1.6} />
      </svg>
    );
  if (st.group === 'started')
    return (
      <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
        <circle cx={8} cy={8} r={5.5} stroke={c} strokeWidth={1.6} />
        <path d="M8 8 L8 2.5 A5.5 5.5 0 0 1 8 13.5 Z" fill={c} />
      </svg>
    );
  if (st.group === 'completed')
    return (
      <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
        <circle cx={8} cy={8} r={6.5} fill={c} />
        <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (st.group === 'cancelled')
    return (
      <svg width={15} height={15} viewBox="0 0 16 16" fill="none">
        <circle cx={8} cy={8} r={6.5} fill="#6B7178" />
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    );
  return null;
}

export function CheckIcon({ done }: { done: boolean }): JSX.Element {
  if (done)
    return (
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <circle cx={8} cy={8} r={6.5} fill="#22C55E" />
        <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <circle cx={8} cy={8} r={6} stroke="var(--text-muted)" strokeWidth={1.5} />
    </svg>
  );
}

export function CalIcon(): JSX.Element {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <rect x={2.5} y={3} width={11} height={11} rx={2} stroke="currentColor" strokeWidth={1.4} />
      <path d="M2.5 6h11M5.5 1.5v2M10.5 1.5v2" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

export function WikiStackIcon({ size = 26 }: { size?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <rect x={5} y={3} width={14} height={18} rx={2} stroke="currentColor" strokeWidth={1.4} transform="rotate(-6 12 12)" opacity={0.55} />
      <rect x={6} y={4} width={14} height={18} rx={2} stroke="currentColor" strokeWidth={1.5} fill="var(--bg-surface)" />
      <path d="M9.5 9.5h7M9.5 13h7M9.5 16.5h4" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" opacity={0.7} />
    </svg>
  );
}

export function WikiStickyIcon({ size = 26 }: { size?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <path d="M6 5.5c0-1.1.9-2 2-2h9c1.1 0 2 .9 2 2v8.7c0 .3-.1.6-.35.85l-4.6 4.6a1.2 1.2 0 0 1-.85.35H8c-1.1 0-2-.9-2-2V5.5Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M14 19.5V16c0-1.1.9-2 2-2h3.5" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}
