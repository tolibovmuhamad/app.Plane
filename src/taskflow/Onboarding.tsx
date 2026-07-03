import type { CSSProperties } from 'react';
import { useTF } from './context';
import { Logo } from './Brand';
import { HButton } from './primitives';

/** Один шаг мастера первого запуска. */
function Step({
  n,
  title,
  text,
  state,
  action,
}: {
  n: number;
  title: string;
  text: string;
  state: 'active' | 'next' | 'done';
  action?: JSX.Element;
}): JSX.Element {
  const badge: CSSProperties =
    state === 'done'
      ? { background: 'var(--accent)', color: '#fff', border: 'none' }
      : state === 'active'
        ? { background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent)' }
        : { background: 'var(--bg-app)', color: 'var(--text-muted)', border: '1px solid var(--border-strong)' };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '16px',
        borderRadius: '11px',
        border: '1px solid var(--border)',
        background: state === 'active' ? 'var(--bg-app)' : 'transparent',
        opacity: state === 'next' ? 0.6 : 1,
      }}
    >
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12.5px',
          fontWeight: 700,
          flexShrink: 0,
          ...badge,
        }}
      >
        {state === 'done' ? (
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          n
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{title}</div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: action ? '12px' : 0 }}>{text}</div>
        {action}
      </div>
    </div>
  );
}

/**
 * Экран первого запуска для аккаунта без воркспейсов. Явно задаёт порядок:
 * сначала создать workspace, потом — project. Заменяет обычный шелл, чтобы не
 * было сбивающих кнопок «Add project» до появления воркспейса.
 */
export function Onboarding(): JSX.Element {
  const tf = useTF();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(60% 55% at 50% 0%,rgba(99,102,241,.10),transparent 70%),radial-gradient(40% 40% at 82% 92%,rgba(139,92,246,.07),transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', width: '100%', maxWidth: '460px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Logo size={30} radius={8} />
          <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-.02em' }}>TaskFlow</span>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '28px 26px',
            boxShadow: 'var(--shadow)',
          }}
        >
          <h1 style={{ margin: '0 0 6px', fontSize: '21px', fontWeight: 600, letterSpacing: '-.02em' }}>
            Welcome{tf.me.name && tf.me.name !== 'Загрузка…' ? `, ${tf.me.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p style={{ margin: '0 0 22px', color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.6 }}>
            Let's set up your space. First create a <strong style={{ color: 'var(--text-primary)' }}>workspace</strong>,
            then add your first <strong style={{ color: 'var(--text-primary)' }}>project</strong> inside it.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Step
              n={1}
              state="active"
              title="Create a workspace"
              text="A workspace is your team's home for projects, issues and members."
              action={
                <HButton
                  onClick={tf.openCreateWorkspace}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    height: '36px',
                    padding: '0 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    transition: 'background .14s',
                  }}
                  hoverStyle={{ background: 'var(--accent-hover)' }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                  </svg>
                  Create workspace
                </HButton>
              }
            />
            <Step
              n={2}
              state="next"
              title="Create a project"
              text="Once your workspace exists, you'll add a project to start tracking work."
            />
          </div>
        </div>

        <p style={{ textAlign: 'center', margin: '18px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
          Wrong account?{' '}
          <span onClick={tf.logout} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>
            Sign out
          </span>
        </p>
      </div>
    </div>
  );
}
