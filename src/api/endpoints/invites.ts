import { apiClient } from '../client';
import type { WorkspaceRole } from './members';

/**
 * Детали приглашения по токену — публичный эндпоинт (без авторизации),
 * чтобы приглашённый мог увидеть, куда и кем его зовут, ещё до входа.
 */
export interface InviteDetails {
  id: string;
  workspace_id: string;
  email: string;
  role: WorkspaceRole;
  expires_at: string;
  workspace: { id: string; name: string; slug: string };
  invited_by: { id: string; display_name: string; email: string };
}

/** Ответ на принятие приглашения — свежесозданное членство в воркспейсе. */
export interface AcceptInviteResult {
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
}

export const invitesApi = {
  /** GET /invites/:token — публично, показать детали приглашения. */
  get: async (token: string): Promise<InviteDetails> => {
    const { data } = await apiClient.get<InviteDetails>(`/invites/${token}`);
    return data;
  },

  /** POST /invites/:token/accept — требует авторизации; создаёт членство. */
  accept: async (token: string): Promise<AcceptInviteResult> => {
    const { data } = await apiClient.post<AcceptInviteResult>(
      `/invites/${token}/accept`,
      {},
    );
    return data;
  },
};
