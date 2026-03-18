import { s } from './page.styled';
import { LogRow } from './LogRow';
import type { LogsTableProps } from './page.types';


export const LogsTable = ({ logs }: LogsTableProps) => (
  <table className={s.table}>
    <thead className={s.thead}>
      <tr>
        <th className={s.th} />
        <th className={s.th}>Сообщение / URL</th>
        <th className={s.th}>Пользователь</th>
        <th className={s.th}>Дата</th>
      </tr>
    </thead>
    <tbody className={s.tbody}>
      {logs.map((log) => (
        <LogRow key={log.id} log={log} />
      ))}
    </tbody>
  </table>
);
