import type { ReactNode } from 'react';
import { AdminLayoutClient } from './AdminLayoutClient';


const AdminLayout = ({ children }: { children: ReactNode }) => (
  <AdminLayoutClient>{children}</AdminLayoutClient>
);

export default AdminLayout;
