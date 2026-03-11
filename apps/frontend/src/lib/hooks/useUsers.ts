'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';


export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

export const useUsers = () =>
  useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => api.get<AdminUser[]>('/users'),
    retry: false,
  });

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.patch<AdminUser>(`/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isBanned }: { id: string; isBanned: boolean }) =>
      api.patch<AdminUser>(`/users/${id}/ban`, { isBanned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};
