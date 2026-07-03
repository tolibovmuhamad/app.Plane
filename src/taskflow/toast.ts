import { create } from 'zustand';

export type ToastKind = 'success' | 'danger' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ToastState {
  toasts: Toast[];
  push: (message: string, kind?: ToastKind, duration?: number) => void;
  dismiss: (id: string) => void;
}

/**
 * Глобальный стор тостов. Вынесен из React-дерева, поэтому `pushToast` можно
 * звать откуда угодно (мутации в useTaskFlow, интерсепторы и т.п.) без контекста.
 * Рендерит их `<Toaster />`.
 */
export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (message, kind = 'info', duration = 3500) => {
    const id = Math.random().toString(36).slice(2, 9);
    set((s) => ({ toasts: [...s.toasts, { id, message, kind }] }));
    if (duration > 0) {
      setTimeout(() => get().dismiss(id), duration);
    }
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Хелпер для вызова из любого места (вне React). */
export const pushToast = (message: string, kind: ToastKind = 'info', duration?: number): void =>
  useToastStore.getState().push(message, kind, duration);

export const toast = {
  success: (m: string, d?: number) => pushToast(m, 'success', d),
  error: (m: string, d?: number) => pushToast(m, 'danger', d),
  warning: (m: string, d?: number) => pushToast(m, 'warning', d),
  info: (m: string, d?: number) => pushToast(m, 'info', d),
};
