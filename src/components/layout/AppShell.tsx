import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useUiStore } from '@/stores/ui.store';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  const { theme } = useUiStore();

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas text-text-primary transition-colors duration-200">
      {/* Sidebar Layout component */}
      <Sidebar />

      {/* Main Content Layout area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar Layout component */}
        <Topbar />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
