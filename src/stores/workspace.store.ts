import { create } from 'zustand';

/**
 * Клиентское состояние навигации по workspace/проекту (заготовка).
 * Сами данные workspace'ов/проектов — в TanStack Query, не дублировать сюда.
 */
interface WorkspaceState {
  currentWorkspaceSlug: string | null;
  currentProjectId: string | null;
  setWorkspace: (slug: string | null) => void;
  setProject: (projectId: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspaceSlug: null,
  currentProjectId: null,
  setWorkspace: (slug) => set({ currentWorkspaceSlug: slug, currentProjectId: null }),
  setProject: (projectId) => set({ currentProjectId: projectId }),
}));
