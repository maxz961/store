import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';


export interface SupportMessage {
  id: string;
  content: string;
  fromAdmin: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface SupportUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface SupportThread {
  user: SupportUser;
  lastMessage: SupportMessage | null;
  unreadCount: number;
}

export interface AdminThreadDetail {
  user: SupportUser;
  messages: SupportMessage[];
}


export const useMyMessages = () =>
  useQuery({
    queryKey: ['support', 'messages'],
    queryFn: () => api.get<SupportMessage[]>('/support/messages'),
  });

export const useMyUnreadCount = () =>
  useQuery({
    queryKey: ['support', 'unread-count'],
    queryFn: () => api.get<number>('/support/unread-count'),
    refetchInterval: 30_000,
  });

export const useAdminUnreadCount = () =>
  useQuery({
    queryKey: ['support', 'admin', 'unread-count'],
    queryFn: () => api.get<number>('/support/admin/unread-count'),
    refetchInterval: 30_000,
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      api.post<SupportMessage>('/support/messages', { content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['support', 'messages'] }),
  });
};

export const useAdminThreads = () =>
  useQuery({
    queryKey: ['support', 'admin', 'threads'],
    queryFn: () => api.get<SupportThread[]>('/support/admin/threads'),
  });

export const useAdminThread = (userId: string) =>
  useQuery({
    queryKey: ['support', 'admin', 'thread', userId],
    queryFn: () => api.get<AdminThreadDetail>(`/support/admin/threads/${userId}`),
    enabled: !!userId,
  });

export const useAdminReply = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      api.post<SupportMessage>(`/support/admin/threads/${userId}/reply`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'admin', 'thread', userId] });
      queryClient.invalidateQueries({ queryKey: ['support', 'admin', 'threads'] });
    },
  });
};
