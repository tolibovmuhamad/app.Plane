import { useAuthStore } from '@/stores/auth.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { useUiStore } from '@/stores/ui.store';
import { useWorkspaces, useProjects, useUnreadNotificationsCount } from '@/hooks/useWorkspaceQueries';
import { Avatar } from '../ui/Avatar';
import { Bell, Sun, Moon, LogOut, ChevronRight, Menu } from 'lucide-react';
import { useSession } from '@/features/auth/useSession';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Topbar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { logout } = useSession();
  const { currentWorkspaceSlug, currentProjectId } = useWorkspaceStore();
  const { theme, setTheme, isSidebarOpen, toggleSidebar } = useUiStore();
  
  const [profileOpen, setProfileOpen] = useState(false);

  const { data: workspaces } = useWorkspaces();
  const { data: projects } = useProjects(currentWorkspaceSlug);
  const { data: unreadCount } = useUnreadNotificationsCount(currentWorkspaceSlug);

  const activeWorkspace = workspaces?.find((w) => w.slug === currentWorkspaceSlug);
  const activeProject = projects?.find((p) => p.id === currentProjectId);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-border bg-surface-1 px-4 text-text-primary">
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center gap-2">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="mr-2 rounded p-1 hover:bg-layer-1-hover text-text-secondary hover:text-text-primary"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <span className="text-text-secondary hover:text-text-primary cursor-pointer">
            {activeWorkspace?.name || 'Workspace'}
          </span>
          {activeProject && (
            <>
              <ChevronRight className="h-4 w-4 text-text-tertiary" />
              <span className="text-text-primary font-semibold">
                {activeProject.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-text-secondary hover:bg-layer-1-hover hover:text-text-primary transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications Bell */}
        <button
          className="relative rounded-lg p-2 text-text-secondary hover:bg-layer-1-hover hover:text-text-primary transition-colors"
          title="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount && unreadCount > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-semibold text-text-on-accent animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-full border border-transparent p-0.5 hover:bg-layer-1-hover focus:outline-none transition-colors"
          >
            <Avatar src={user?.avatar_url} name={user?.display_name || 'User'} size="sm" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-lg border border-border bg-surface-2 p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-100">
              <div className="border-b border-border px-3 py-2">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {user?.display_name || 'My Profile'}
                </p>
                <p className="truncate text-xs text-text-tertiary">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-danger-subtle hover:text-danger-text transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
