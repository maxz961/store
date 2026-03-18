'use client';

import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { LogRow } from './LogRow';
import type { LogsTableProps } from './page.types';


export const LogsTable = ({ logs }: LogsTableProps) => {
  const { t } = useLanguage();

  return (
    <table className={s.table}>
      <thead className={s.thead}>
        <tr>
          <th className={s.th} />
          <th className={s.th}>{t('admin.logs.tableMessage')}</th>
          <th className={s.th}>{t('admin.logs.tableUser')}</th>
          <th className={s.th}>{t('admin.logs.tableDate')}</th>
        </tr>
      </thead>
      <tbody className={s.tbody}>
        {logs.map((log) => (
          <LogRow key={log.id} log={log} />
        ))}
      </tbody>
    </table>
  );
};
