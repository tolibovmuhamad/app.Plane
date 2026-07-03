import type { CSSProperties } from 'react';
import { useTF } from './context';
import { FocusInput, HButton } from './primitives';

const authFieldStyle: CSSProperties = {
  width: '100%',
  height: '38px',
  padding: '0 12px',
  marginBottom: '16px',
  background: 'var(--bg-app)',
  border: '1px solid var(--border-strong)',
  borderRadius: '6px',
  color: 'var(--text-primary)',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
};
const authFieldFocus: CSSProperties = {
  borderColor: 'var(--accent)',
  boxShadow: '0 0 0 3px var(--accent-subtle)',
};
const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: '6px',
};
const errorBorder: CSSProperties = { borderColor: '#EF4444' };

function FieldError({ msg }: { msg: string | null }): JSX.Element | null {
  if (!msg) return null;
  return <div style={{ marginTop: '-10px', marginBottom: '14px', fontSize: '11.5px', color: '#EF4444' }}>{msg}</div>;
}

/** Баннер общей ошибки авторизации (неверные креды / сеть). */
export function AuthErrorBanner(): JSX.Element | null {
  const tf = useTF();
  if (!tf.authError) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '9px 12px',
        marginBottom: '18px',
        borderRadius: '8px',
        border: '1px solid rgba(239,68,68,.35)',
        background: 'rgba(239,68,68,.08)',
        color: '#EF4444',
        fontSize: '12.5px',
        lineHeight: 1.4,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx={8} cy={8} r={6.5} stroke="currentColor" strokeWidth={1.4} />
        <path d="M8 5v3.5M8 10.6v.1" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
      {tf.authError}
    </div>
  );
}

interface AuthFormProps {
  /** Показывать ли поле «Display name» в режиме регистрации (по умолчанию — да). */
  showName?: boolean;
  /** Блокировать поле email (например, e-mail из приглашения). */
  emailReadOnly?: boolean;
}

/**
 * Общие поля входа/регистрации (email + пароль, плюс имя при регистрации) и
 * кнопка сабмита. Данные и обработчики берутся из TaskFlow-модели (`useTF`),
 * поэтому форма переиспользуется и на экране входа, и на экране приглашения.
 */
export function AuthForm({ showName = true, emailReadOnly = false }: AuthFormProps): JSX.Element {
  const tf = useTF();
  return (
    <form onSubmit={tf.submitAuth}>
      {tf.isRegister && showName && (
        <>
          <label style={labelStyle}>Display name</label>
          <FocusInput
            value={tf.authName}
            onChange={tf.onName}
            placeholder="Ada Lovelace"
            style={tf.authNameError ? { ...authFieldStyle, ...errorBorder } : authFieldStyle}
            focusStyle={authFieldFocus}
          />
          <FieldError msg={tf.authNameError} />
        </>
      )}
      <label style={labelStyle}>Email</label>
      <FocusInput
        value={tf.authEmail}
        onChange={tf.onEmail}
        type="email"
        placeholder="you@company.com"
        readOnly={emailReadOnly}
        style={
          tf.authEmailError
            ? { ...authFieldStyle, ...errorBorder }
            : emailReadOnly
              ? { ...authFieldStyle, opacity: 0.7, cursor: 'not-allowed' }
              : authFieldStyle
        }
        focusStyle={authFieldFocus}
      />
      <FieldError msg={tf.authEmailError} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
        <span style={{ fontSize: '12px', color: 'var(--accent)', cursor: 'pointer' }}>Forgot?</span>
      </div>
      <FocusInput
        value={tf.authPass}
        onChange={tf.onPass}
        type="password"
        placeholder="••••••••"
        style={tf.authPassError ? { ...authFieldStyle, marginBottom: '22px', ...errorBorder } : { ...authFieldStyle, marginBottom: '22px' }}
        focusStyle={authFieldFocus}
      />
      <FieldError msg={tf.authPassError} />
      <HButton
        type="submit"
        disabled={tf.submitting}
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
          transition: 'background .14s ease-out',
        }}
        hoverStyle={{ background: 'var(--accent-hover)' }}
      >
        {tf.submitting && (
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
        {tf.authButton}
      </HButton>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 16px' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or continue with</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <HButton type="button" style={socialBtnStyle} hoverStyle={socialBtnHover}>
        <GoogleIcon />
        Sign in with Google
      </HButton>
      <HButton type="button" style={{ ...socialBtnStyle, marginBottom: 0 }} hoverStyle={socialBtnHover}>
        <GitHubIcon />
        Sign in with GitHub
      </HButton>
    </form>
  );
}

const socialBtnStyle: CSSProperties = {
  width: '100%',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '9px',
  border: '1px solid var(--border-strong)',
  borderRadius: '8px',
  background: 'var(--bg-app)',
  color: 'var(--text-primary)',
  fontSize: '13px',
  fontWeight: 500,
  fontFamily: 'inherit',
  cursor: 'pointer',
  marginBottom: '10px',
  transition: 'all .14s',
};
const socialBtnHover: CSSProperties = { borderColor: 'var(--text-muted)', background: 'var(--bg-surface)' };

function GoogleIcon(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

function GitHubIcon(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
