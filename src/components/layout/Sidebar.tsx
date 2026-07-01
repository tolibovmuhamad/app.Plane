import { useEffect, useState } from 'react';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { useUiStore } from '@/stores/ui.store';
import { useWorkspaces, useProjects } from '@/hooks/useWorkspaceQueries';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Settings,
  Plus,
  ChevronDown,
  Calendar,
  Grid,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export function Sidebar() {
  const { currentWorkspaceSlug, currentProjectId, setWorkspace, setProject } =
    useWorkspaceStore();
  const { isSidebarOpen, toggleSidebar } = useUiStore();
  const { data: workspaces } = useWorkspaces();
  const { data: projects, isLoading: loadingProjects } = useProjects(currentWorkspaceSlug);
  
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  // Auto-select first workspace if none selected
  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !currentWorkspaceSlug) {
      setWorkspace(workspaces[0].slug);
    }
  }, [workspaces, currentWorkspaceSlug, setWorkspace]);

  const activeWorkspace = workspaces?.find((w) => w.slug === currentWorkspaceSlug);

  const navItems = [
    { label: 'Issues', icon: Layers, path: 'issues' },
    { label: 'Cycles', icon: Calendar, path: 'cycles' },
    { label: 'Modules', icon: Grid, path: 'modules' },
    { label: 'Settings', icon: Settings, path: 'settings' },
  ];

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-border bg-surface-1 text-text-secondary transition-all duration-300 ease-in-out',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Workspace Selector */}
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {isSidebarOpen ? (
          <div className="relative w-full">
            <button
              onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
              className="flex w-full items-center justify-between rounded-md p-1.5 hover:bg-layer-1-hover text-text-primary transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-primary font-semibold text-text-on-accent uppercase">
                  {activeWorkspace?.name.charAt(0) || 'W'}
                </div>
                <div className="truncate text-sm font-medium">
                  {activeWorkspace?.name || 'Loading...'}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            </button>

            {/* Dropdown Menu */}
            {workspaceDropdownOpen && workspaces && workspaces.length > 0 && (
              <div className="absolute left-0 right-0 top-12 z-50 rounded-lg border border-border bg-surface-2 p-1.5 shadow-xl">
                <div className="px-2 py-1 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                  Workspaces
                </div>
                {workspaces.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setWorkspace(w.slug);
                      setWorkspaceDropdownOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors text-left',
                      w.slug === currentWorkspaceSlug
                        ? 'bg-layer-2-selected text-text-primary'
                        : 'hover:bg-layer-2-hover text-text-secondary'
                    )}
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-accent-primary text-[10px] font-bold text-text-on-accent uppercase">
                      {w.name.charAt(0)}
                    </div>
                    <span className="truncate">{w.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-accent-primary font-bold text-text-on-accent uppercase">
              {activeWorkspace?.name.charAt(0) || 'W'}
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={cn(
                  'flex w-full items-center rounded-md text-sm font-medium transition-all duration-150',
                  isSidebarOpen ? 'px-3 py-2 gap-3 justify-start' : 'p-2.5 justify-center',
                  'hover:bg-layer-1-hover hover:text-text-primary'
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Project Section */}
        <div className="pt-6">
          {isSidebarOpen ? (
            <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
              <span>Projects</span>
              <button className="rounded p-0.5 hover:bg-layer-1-hover hover:text-text-primary">
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="border-t border-border my-4" />
          )}

          <div className="space-y-1">
            {loadingProjects ? (
              isSidebarOpen ? (
                <div className="space-y-2 px-3">
                  <div className="h-6 w-full animate-pulse rounded bg-border-subtle" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-border-subtle" />
                </div>
              ) : (
                <div className="flex justify-center py-2">
                  <div className="h-4 w-4 animate-pulse rounded-full bg-border-subtle" />
                </div>
              )
            ) : projects && projects.length > 0 ? (
              projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => setProject(proj.id)}
                  className={cn(
                    'flex w-full items-center rounded-md text-sm transition-all duration-150',
                    isSidebarOpen ? 'px-3 py-1.5 gap-3 justify-start' : 'p-2 justify-center',
                    proj.id === currentProjectId
                      ? 'bg-layer-1-selected text-text-primary font-medium'
                      : 'hover:bg-layer-1-hover hover:text-text-primary'
                  )}
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border-strong bg-surface-2 text-[10px] font-bold uppercase text-text-secondary">
                    {proj.identifier}
                  </div>
                  {isSidebarOpen && <span className="truncate">{proj.name}</span>}
                </button>
              ))
            ) : (
              isSidebarOpen && (
                <div className="px-3 py-2 text-xs text-text-tertiary italic">
                  No projects
                </div>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="flex h-14 items-center border-t border-border px-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex w-full items-center rounded-md p-2 hover:bg-layer-1-hover hover:text-text-primary transition-all duration-150',
            isSidebarOpen ? 'justify-start gap-3' : 'justify-center'
          )}
        >
          {isSidebarOpen ? (
            <>
              <ChevronLeft className="h-4.5 w-4.5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-4.5 w-4.5" />
          )}
        </button>
      </div>
    </aside>
  );
}
