import { useTF } from './context';
import { AuthErrorBanner, AuthForm } from './AuthForm';

export function AuthScreen(): JSX.Element {
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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
          backgroundImage:
            'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 30%,#000,transparent 75%)',
          maskImage: 'radial-gradient(70% 60% at 50% 30%,#000,transparent 75%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', width: '100%', maxWidth: '392px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'linear-gradient(150deg,var(--accent),#8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px -4px rgba(99,102,241,.7)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8.5L6.5 12L13 4.5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
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
          <h1 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 600, letterSpacing: '-.02em' }}>{tf.authTitle}</h1>
          <p style={{ margin: '0 0 22px', color: 'var(--text-secondary)', fontSize: '13px' }}>{tf.authSubtitle}</p>
          <AuthErrorBanner />
          <AuthForm />
        </div>
        <p style={{ textAlign: 'center', margin: '18px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
          {tf.authSwitchText}{' '}
          <span onClick={tf.toggleMode} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>
            {tf.authSwitchLink}
          </span>
        </p>
      </div>
    </div>
  );
}
