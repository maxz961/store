'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { When, If, Then, Else } from 'react-if';
import { Spinner } from '@/components/ui/Spinner';
import { useUsers, useUpdateUserRole, useBanUser } from '@/lib/hooks/useUsers';
import { s } from './page.styled';
import { UsersTable } from './UsersTable';


const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Админ-панель', href: '/admin/dashboard' },
  { label: 'Пользователи' },
];


const AdminUsersPage = () => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsers();
  const updateRole = useUpdateUserRole();
  const banUser = useBanUser();
  const [query, setQuery] = useState('');

  const users = useMemo(() => data?.pages.flat() ?? [], [data]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name ?? '').toLowerCase().includes(q),
    );
  }, [users, query]);

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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
    [],
  );

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  if (isLoading) return <Spinner />;

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.header}>
        <div className={s.searchWrapper}>
          <Search className={s.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Поиск по имени или email..."
            className={s.searchInput}
          />
        </div>
      </div>

      <If condition={isError}>
        <Then>
          <p className="mt-6 text-sm text-destructive">Не удалось загрузить пользователей</p>
        </Then>
        <Else>
          <>
            <UsersTable
              users={filteredUsers}
              onUpdateRole={handleUpdateRole}
              onToggleBan={handleToggleBan}
            />
            <When condition={!!hasNextPage}>
              <div className={s.loadMoreWrapper}>
                <button
                  className={s.loadMoreBtn}
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? 'Загрузка...' : 'Загрузить ещё'}
                </button>
              </div>
            </When>
          </>
        </Else>
      </If>
    </div>
  );
};

export default AdminUsersPage;
