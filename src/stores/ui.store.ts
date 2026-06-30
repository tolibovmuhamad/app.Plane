import { create } from 'zustand';

type Theme = 'dark' | 'light';

/**
 * UI-состояние (заготовка): сайдбар, тема. Расширяется по мере появления задач.
 */
interface UiState {
  isSidebarOpen: boolean;
  theme: Theme;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  theme: 'dark',
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
