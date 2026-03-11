'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';


export interface ErrorLog {
  id: string;
  message: string;
  stack: string | null;
  url: string | null;
  userId: string | null;
  isRead: boolean;
  createdAt: string;
}


export const useLogs = () =>
  useQuery<ErrorLog[]>({
    queryKey: ['admin', 'logs'],
    queryFn: () => api.get<ErrorLog[]>('/logs'),
  });

export const useUnreadLogsCount = () =>
  useQuery<number>({
    queryKey: ['admin', 'logs', 'unread-count'],
    queryFn: () => api.get<number>('/logs/unread-count'),
    refetchInterval: 30_000,
  });

export const useMarkLogsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.put('/logs/mark-all-read', {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'logs'] });
    },
  });
};
