'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

const PAGE_SIZE = 20;

export const useUsers = () =>
  useInfiniteQuery({
    queryKey: ['admin', 'users'],
    queryFn: ({ pageParam }) =>
      api.get<AdminUser[]>(`/users?skip=${pageParam}&take=${PAGE_SIZE}`),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length < PAGE_SIZE ? undefined : lastPageParam + PAGE_SIZE,
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
