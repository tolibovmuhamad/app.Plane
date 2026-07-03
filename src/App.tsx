import { TaskFlowApp } from './taskflow/TaskFlowApp';
import { ErrorBoundary, NotFound } from './taskflow/ErrorBoundary';

/** Известные маршруты: главная и ссылка-приглашение. Остальное → 404. */
function isKnownRoute(pathname: string): boolean {
  return pathname === '/' || /^\/invites\/[^/]+\/?$/.test(pathname);
}

export default function App() {
  return (
    <ErrorBoundary>
      {isKnownRoute(window.location.pathname) ? <TaskFlowApp /> : <NotFound />}
    </ErrorBoundary>
  );
}
