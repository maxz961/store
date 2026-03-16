import Image from 'next/image';
import { If, Then, Else, When } from 'react-if';
import type { ChangeEvent } from 'react';
import { SelectField } from '@/components/ui/SelectField';
import { s } from './page.styled';
import { ROLE_OPTIONS } from './page.constants';
import { getInitials } from '@/lib/utils';
import type { UserRowProps, UserRole } from './page.types';


export const UserRow = ({ user, onUpdateRole, onToggleBan }: UserRowProps) => {
  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onUpdateRole(user.id, e.target.value as UserRole);
  };

  const handleToggleBan = () => {
    onToggleBan(user.id, !user.isBanned);
  };

  const dateStr = new Date(user.createdAt).toLocaleDateString('en-US');

  const avatar = (
    <If condition={!!user.image}>
      <Then>
        <Image
          src={user.image ?? ''}
          alt={user.name ?? user.email}
          width={32}
          height={32}
          className={s.avatar}
          unoptimized
        />
      </Then>
      <Else>
        <div className={s.avatarFallback}>
          {getInitials(user.name, user.email)}
        </div>
      </Else>
    </If>
  );

  return (
    <tr className={s.tr}>
      <td className={s.td}>
        <div className={s.userCell}>
          {avatar}
          <div>
            <div className={s.userName}>{user.name ?? '—'}</div>
            <div className={s.userEmail}>{user.email}</div>
          </div>
        </div>
      </td>
      <td className={s.tdCenter}>
        <SelectField
          label=""
          value={user.role}
          onChange={handleRoleChange}
          options={ROLE_OPTIONS}
          className={s.roleSelect}
        />
      </td>
      <td className={s.tdCenter}>
        <If condition={user.isBanned}>
          <Then>
            <span className={s.bannedBadge}>Banned</span>
          </Then>
          <Else>
            <span className={s.activeBadge}>Active</span>
          </Else>
        </If>
      </td>
      <td className={s.td}>
        <span className={s.date}>{dateStr}</span>
      </td>
      <td className={s.td}>
        <When condition={user.role !== 'ADMIN'}>
          <button
            type="button"
            className={user.isBanned ? s.unbanBtn : s.banBtn}
            onClick={handleToggleBan}
          >
            {user.isBanned ? 'Unban' : 'Ban'}
          </button>
        </When>
      </td>
    </tr>
  );
};
