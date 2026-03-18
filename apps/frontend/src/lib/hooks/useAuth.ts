'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';


interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'CUSTOMER' | 'MANAGER' | 'ADMIN';
  createdAt: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        return await api.get<User>('/auth/me');
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } catch {
      // cookie may already be cleared
    }
    queryClient.setQueryData(['auth', 'me'], null);
    window.location.href = '/';
  };

  const login = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER',
    login,
    logout,
    invalidate,
  };
};
