'use client';

import { useState, useCallback } from 'react';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { s } from './layout.styled';


export const AdminLayoutClient = ({ children }: { children: ReactNode }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleOpen = useCallback(() => setIsMobileOpen(true), []);
  const handleClose = useCallback(() => setIsMobileOpen(false), []);

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
