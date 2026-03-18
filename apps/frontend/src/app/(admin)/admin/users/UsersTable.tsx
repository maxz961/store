'use client';

import { When } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { UserRow } from './UserRow';
import type { UsersTableProps } from './page.types';


export const UsersTable = ({ users, canEditRole, onUpdateRole, onToggleBan }: UsersTableProps) => {
  const { t } = useLanguage();

  return (
    <div className={s.tableWrapper}>
      <table className={s.table}>
        <thead className={s.thead}>
          <tr>
            <th className={s.th}>{t('admin.users.tableUser')}</th>
            <th className={s.thCenter}>{t('admin.users.role')}</th>
            <th className={s.thCenter}>{t('admin.users.tableStatus')}</th>
            <th className={s.th}>{t('admin.users.tableRegistered')}</th>
            <th className={s.th}>{t('admin.users.tableActions')}</th>
          </tr>
        </thead>
        <tbody>
          <When condition={users.length === 0}>
            <tr>
              <td colSpan={5} className={s.emptyRow}>{t('admin.users.noItems')}</td>
            </tr>
          </When>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              canEditRole={canEditRole}
              onUpdateRole={onUpdateRole}
              onToggleBan={onToggleBan}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
