import { useToastStore, type ToastKind } from './toast';
import { HButton } from './primitives';

const TONE: Record<ToastKind, { color: string; bg: string; border: string; icon: JSX.Element }> = {
  success: {
    color: '#22C55E',
    bg: 'rgba(34,197,94,.10)',
    border: 'rgba(34,197,94,.35)',
    icon: (
      <path d="M4 8.5L7 11.5L12.5 5" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  danger: {
    color: '#EF4444',
    bg: 'rgba(239,68,68,.10)',
    border: 'rgba(239,68,68,.35)',
    icon: (
      <>
        <circle cx={8} cy={8} r={6.2} stroke="currentColor" strokeWidth={1.5} />
        <path d="M8 5v4M8 11h.01" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      </>
    ),
  },
  warning: {
    color: '#EAB308',
    bg: 'rgba(234,179,8,.10)',
    border: 'rgba(234,179,8,.35)',
    icon: (
      <>
        <path d="M8 2.5L14.5 13.5H1.5L8 2.5Z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
        <path d="M8 7v3M8 12h.01" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      </>
    ),
  },
  info: {
    color: 'var(--accent)',
    bg: 'var(--accent-subtle)',
    border: 'rgba(99,102,241,.35)',
    icon: (
      <>
        <circle cx={8} cy={8} r={6.2} stroke="currentColor" strokeWidth={1.5} />
        <path d="M8 7.5v4M8 5h.01" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      </>
    ),
  },
};

/** Стек тостов в правом-нижнем углу. Рендерит `useToastStore`. */
export function Toaster(): JSX.Element {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div
      style={{
        position: 'fixed',
        right: '18px',
        bottom: '18px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: 'min(360px, calc(100vw - 36px))',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => {
        const tone = TONE[t.kind];
        return (
          <div
            key={t.id}
            role="status"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 12px 12px 13px',
              background: 'var(--bg-elevated)',
              border: `1px solid ${tone.border}`,
              borderRadius: '11px',
              boxShadow: 'var(--shadow)',
              animation: 'tf-toast-in .22s cubic-bezier(.2,.8,.2,1)',
            }}
          >
            <span
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '6px',
                background: tone.bg,
                color: tone.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                {tone.icon}
              </svg>
            </span>
            <span style={{ flex: 1, fontSize: '13px', lineHeight: 1.45, color: 'var(--text-primary)' }}>{t.message}</span>
            <HButton
              onClick={() => dismiss(t.id)}
              title="Dismiss"
              style={{
                width: '22px',
                height: '22px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                borderRadius: '5px',
                transition: 'all .14s',
              }}
              hoverStyle={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
              </svg>
            </HButton>
          </div>
        );
      })}
    </div>
  );
}
