'use client';

import { useCallback } from 'react';
import { If, Then, Else } from 'react-if';
import { Spinner } from '@/components/ui/Spinner';
import { useUsers, useUpdateUserRole, useBanUser } from '@/lib/hooks/useUsers';
import { s } from './page.styled';
import { UsersTable } from './UsersTable';


const AdminUsersPage = () => {
  const { data: users = [], isLoading, isError } = useUsers();
  const updateRole = useUpdateUserRole();
  const banUser = useBanUser();

  const handleUpdateRole = useCallback(
    (id: string, role: 'CUSTOMER' | 'ADMIN') => {
      updateRole.mutate({ id, role });
    },
    [updateRole],
  );

  const handleToggleBan = useCallback(
    (id: string, isBanned: boolean) => {
      banUser.mutate({ id, isBanned });
    },
    [banUser],
  );

  if (isLoading) return <Spinner />;

  return (
    <div className={s.page}>

      <If condition={isError}>
        <Then>
          <p className="mt-6 text-sm text-destructive">Не удалось загрузить пользователей</p>
        </Then>
        <Else>
          <UsersTable
            users={users}
            onUpdateRole={handleUpdateRole}
            onToggleBan={handleToggleBan}
          />
        </Else>
      </If>
    </div>
  );
};

export default AdminUsersPage;
