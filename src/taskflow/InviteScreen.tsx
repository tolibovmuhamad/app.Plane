import type { ReactNode } from 'react';
import { useTF } from './context';
import { Logo } from './Brand';
import { AuthErrorBanner, AuthForm } from './AuthForm';
import { HButton } from './primitives';

/** Обёртка-шелл: логотип TaskFlow + центрированная карточка. */
function InviteShell({ children }: { children: ReactNode }): JSX.Element {
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
      <div style={{ position: 'relative', width: '100%', maxWidth: '408px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <Logo size={30} radius={8} />
          <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-.02em' }}>TaskFlow</span>
        </div>
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '28px 26px',
            boxShadow: 'var(--shadow)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function InviteScreen(): JSX.Element {
  const tf = useTF();

  // Загрузка деталей приглашения.
  if (tf.inviteLoading) {
    return (
      <InviteShell>
        <div style={{ padding: '18px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
          Loading invitation…
        </div>
      </InviteShell>
    );
  }

  // Токен недействителен / просрочен / не найден.
  if (tf.inviteLoadError) {
    return (
      <InviteShell>
        <h1 style={{ margin: '0 0 6px', fontSize: '19px', fontWeight: 600, letterSpacing: '-.02em' }}>Invitation unavailable</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>{tf.inviteLoadError}</p>
        <HButton
          onClick={tf.dismissInvite}
          style={{
            width: '100%',
            height: '40px',
            border: '1px solid var(--border-strong)',
            borderRadius: '8px',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'all .14s',
          }}
          hoverStyle={{ borderColor: 'var(--text-muted)', background: 'var(--bg-app)' }}
        >
          Continue to TaskFlow
        </HButton>
      </InviteShell>
    );
  }

  const inv = tf.inviteData!;

  return (
    <InviteShell>
      {/* Шапка приглашения: инициал воркспейса + к чему зовут */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '18px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '11px',
            background: 'var(--accent-subtle)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {inv.workspaceInitial}
        </div>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: '0 0 2px', fontSize: '17px', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.3 }}>
            Join {inv.workspaceName}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '12.5px' }}>
            {inv.inviterName} invited you as <strong style={{ color: 'var(--text-primary)' }}>{inv.roleLabel}</strong>
          </p>
        </div>
      </div>

      {tf.inviteAuthed ? (
        <>
          <p style={{ margin: '0 0 18px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
            Accepting adds this workspace to your account.
          </p>
          {tf.inviteAcceptError && (
            <div
              style={{
                padding: '9px 12px',
                marginBottom: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(239,68,68,.35)',
                background: 'rgba(239,68,68,.08)',
                color: '#EF4444',
                fontSize: '12.5px',
                lineHeight: 1.4,
              }}
            >
              {tf.inviteAcceptError}
            </div>
          )}
          <HButton
            onClick={tf.acceptInvite}
            disabled={tf.accepting}
            style={{
              width: '100%',
              height: '40px',
              border: 'none',
              borderRadius: '8px',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: tf.accepting ? 0.6 : 1,
              transition: 'background .14s ease-out',
            }}
            hoverStyle={{ background: 'var(--accent-hover)' }}
          >
            {tf.accepting && (
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,.4)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'tf-spin .6s linear infinite',
                }}
              />
            )}
            {tf.accepting ? 'Accepting…' : 'Accept invitation'}
          </HButton>
          <p style={{ textAlign: 'center', margin: '16px 0 0', fontSize: '12.5px' }}>
            <span onClick={tf.dismissInvite} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Maybe later
            </span>
          </p>
        </>
      ) : (
        <>
          <p style={{ margin: '0 0 18px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
            {tf.isRegister ? 'Create your account' : 'Sign in'} as <strong style={{ color: 'var(--text-primary)' }}>{inv.email}</strong> to accept.
          </p>
          <AuthErrorBanner />
          <AuthForm emailReadOnly />
          <p style={{ textAlign: 'center', margin: '18px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {tf.authSwitchText}{' '}
            <span onClick={tf.toggleMode} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>
              {tf.authSwitchLink}
            </span>
          </p>
        </>
      )}
    </InviteShell>
  );
}
