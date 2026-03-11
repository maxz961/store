import { When } from 'react-if';
import { s } from './page.styled';
import { UserRow } from './UserRow';
import type { UsersTableProps } from './page.types';


export const UsersTable = ({ users, onUpdateRole, onToggleBan }: UsersTableProps) => (
  <div className={s.tableWrapper}>
    <table className={s.table}>
      <thead className={s.thead}>
        <tr>
          <th className={s.th}>Пользователь</th>
          <th className={s.thCenter}>Роль</th>
          <th className={s.thCenter}>Статус</th>
          <th className={s.th}>Регистрация</th>
          <th className={s.th}>Действия</th>
        </tr>
      </thead>
      <tbody>
        <When condition={users.length === 0}>
          <tr>
            <td colSpan={5} className={s.emptyRow}>Пользователи не найдены</td>
          </tr>
        </When>
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onUpdateRole={onUpdateRole}
            onToggleBan={onToggleBan}
          />
        ))}
      </tbody>
    </table>
  </div>
);
