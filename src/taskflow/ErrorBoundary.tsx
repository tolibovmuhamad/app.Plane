import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/** Экран-заглушка (используется и ErrorBoundary, и NotFound). */
function FullScreen({
  emoji,
  title,
  message,
  actionLabel,
  onAction,
  detail,
}: {
  emoji: string;
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
  detail?: string;
}): JSX.Element {
  return (
    <div
      className="tf-root"
      data-theme="dark"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: '420px', textAlign: 'center' }}>
        <div style={{ fontSize: '44px', marginBottom: '14px' }}>{emoji}</div>
        <h1 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600, letterSpacing: '-.02em' }}>{title}</h1>
        <p style={{ margin: '0 0 22px', color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.6 }}>{message}</p>
        {detail && (
          <pre
            style={{
              textAlign: 'left',
              fontSize: '11.5px',
              color: 'var(--text-muted)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '10px 12px',
              margin: '0 0 22px',
              maxHeight: '140px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: "'Geist Mono',monospace",
            }}
          >
            {detail}
          </pre>
        )}
        <button
          onClick={onAction}
          style={{
            height: '40px',
            padding: '0 20px',
            border: 'none',
            borderRadius: '8px',
            background: 'var(--accent)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

/** 404 — экран для неизвестного пути. */
export function NotFound(): JSX.Element {
  return (
    <FullScreen
      emoji="🧭"
      title="Страница не найдена"
      message="Такой страницы нет или ссылка устарела. Вернитесь на главную и продолжайте работу."
      actionLabel="На главную"
      onAction={() => {
        window.location.href = '/';
      }}
    />
  );
}

/** Ловит ошибки рендера ниже по дереву и показывает экран восстановления. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <FullScreen
          emoji="⚠️"
          title="Что-то пошло не так"
          message="Приложение столкнулось с ошибкой. Попробуйте перезагрузить страницу — обычно это помогает."
          actionLabel="Перезагрузить"
          onAction={() => window.location.reload()}
          detail={this.state.error.message}
        />
      );
    }
    return this.props.children;
  }
}
