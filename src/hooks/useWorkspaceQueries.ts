import { useQuery } from '@tanstack/react-query';
import { workspacesApi } from '@/api/endpoints/workspaces';
import { projectsApi } from '@/api/endpoints/projects';
import { notificationsApi } from '@/api/endpoints/notifications';

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: workspacesApi.list,
  });
}

export function useProjects(workspaceSlug: string | null) {
  return useQuery({
    queryKey: ['workspaces', workspaceSlug, 'projects'],
    queryFn: () => projectsApi.list(workspaceSlug!),
    enabled: !!workspaceSlug,
  });
}

export function useUnreadNotificationsCount(workspaceSlug: string | null) {
  return useQuery({
    queryKey: ['workspaces', workspaceSlug, 'notifications', 'unread-count'],
    queryFn: async () => {
      const res = await notificationsApi.getUnread(workspaceSlug!);
      return res.unread_count;
    },
    enabled: !!workspaceSlug,
    refetchInterval: 30_000, // Poll every 30 seconds for new notifications
  });
}
