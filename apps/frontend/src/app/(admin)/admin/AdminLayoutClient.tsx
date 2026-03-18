'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { AdminSidebar } from './AdminSidebar';
import { s } from './layout.styled';


export const AdminLayoutClient = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { isAdmin, isManager, isLoading } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleOpen = useCallback(() => setIsMobileOpen(true), []);
  const handleClose = useCallback(() => setIsMobileOpen(false), []);

  useEffect(() => {
    if (!isLoading && !isAdmin && !isManager) {
      router.replace('/');
    }
  }, [isLoading, isAdmin, isManager, router]);

  if (isLoading || (!isAdmin && !isManager)) return null;

  return (
    <div className={s.wrapper}>
      <AdminSidebar isOpen={isMobileOpen} onClose={handleClose} />
      <main className={s.content}>
        <div className={s.mobileMenuBar}>
          <button className={s.mobileMenuBtn} onClick={handleOpen} aria-label="Открыть меню">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">Меню</span>
        </div>
        {children}
      </main>
    </div>
  );
};
