import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useSession } from '@/features/auth/useSession';

/**
 * Временная защищённая главная — подтверждает, что гард, сессия и logout работают.
 * Реальный AppShell/список workspace'ов придёт в следующих фазах.
 */
export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { logout } = useSession();

  async function onLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold text-text-primary">Task Management</h1>
      <p className="text-text-secondary">
        Защищённая зона{user ? ` — ${user.display_name}` : ''}.
      </p>
      <button
        onClick={onLogout}
        className="rounded-md border border-border px-4 py-2 text-text-secondary hover:text-text-primary"
      >
        Выйти
      </button>
    </div>
  );
}
