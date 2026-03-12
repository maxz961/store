import type { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { s } from './layout.styled';


const AdminLayout = ({ children }: { children: ReactNode }) => (
  <div className={s.wrapper}>
    <AdminSidebar />
    <main className={s.content}>
      {children}
    </main>
  </div>
);

export default AdminLayout;
