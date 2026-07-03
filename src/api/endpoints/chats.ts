import { apiClient } from '../client';

export interface ChatUser {
  id: string;
  display_name: string;
  email?: string;
  avatar_url: string | null;
}

export interface ChatMember {
  chat_id: string;
  user_id: string;
  user: ChatUser;
}

export interface Chat {
  id: string;
  created_at: string;
  updated_at: string;
  members: ChatMember[];
}

export interface MessageReaction {
  message_id: string;
  user_id: string;
  reaction: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string | null;
  voice_url: string | null;
  voice_duration: number | null;
  call_id: string | null;
  created_at: string;
  updated_at: string;
  sender?: ChatUser;
  reactions?: MessageReaction[];
}

export type CallStatus = 'initiated' | 'active' | 'ended' | 'missed' | 'declined';

export interface Call {
  id: string;
  chat_id: string;
  host_id: string;
  status: CallStatus;
  room_name: string;
  jitsi_url: string;
  created_at: string;
  updated_at: string;
}

export const chatsApi = {
  /** Список активных чатов текущего пользователя. */
  list: async (): Promise<Chat[]> => {
    const { data } = await apiClient.get<Chat[]>('/chats/');
    return data;
  },

  /** Создать (или получить существующий) 1-на-1 чат со взаимным подписчиком. */
  create: async (recipientId: string): Promise<Chat> => {
    const { data } = await apiClient.post<Chat>('/chats/', { recipient_id: recipientId });
    return data;
  },

  messages: async (chatId: string): Promise<ChatMessage[]> => {
    const { data } = await apiClient.get<ChatMessage[]>(`/chats/${chatId}/messages`);
    return data;
  },

  sendMessage: async (chatId: string, content: string): Promise<ChatMessage> => {
    const { data } = await apiClient.post<ChatMessage>(`/chats/${chatId}/messages`, { content });
    return data;
  },

  /** Голосовое сообщение — multipart, поле `voice`. */
  sendVoice: async (chatId: string, blob: Blob, durationSec: number): Promise<ChatMessage> => {
    const form = new FormData();
    form.append('voice', blob, 'voice.webm');
    form.append('duration', String(durationSec));
    const { data } = await apiClient.post<ChatMessage>(`/chats/${chatId}/messages/voice`, form);
    return data;
  },

  addReaction: async (messageId: string, reaction: string): Promise<MessageReaction> => {
    const { data } = await apiClient.post<MessageReaction>(`/chats/messages/${messageId}/reactions`, { reaction });
    return data;
  },

  removeReaction: async (messageId: string, reaction: string): Promise<void> => {
    await apiClient.delete(`/chats/messages/${messageId}/reactions/${encodeURIComponent(reaction)}`);
  },

  startCall: async (chatId: string, type: 'audio' | 'video'): Promise<Call> => {
    const { data } = await apiClient.post<Call>(`/chats/${chatId}/calls`, { type });
    return data;
  },

  acceptCall: async (callId: string): Promise<Call> => {
    const { data } = await apiClient.post<Call>(`/chats/calls/${callId}/accept`);
    return data;
  },
  declineCall: async (callId: string): Promise<Call> => {
    const { data } = await apiClient.post<Call>(`/chats/calls/${callId}/decline`);
    return data;
  },
  endCall: async (callId: string): Promise<Call> => {
    const { data } = await apiClient.post<Call>(`/chats/calls/${callId}/end`);
    return data;
  },
};
