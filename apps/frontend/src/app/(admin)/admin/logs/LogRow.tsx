'use client';

import { useState } from 'react';
import { When } from 'react-if';
import { cn, langToLocale } from '@/lib/utils';
import { formatDate } from '@/lib/constants/format';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import type { LogRowProps } from './page.types';


export const LogRow = ({ log }: LogRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const { lang } = useLanguage();

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <tr
        className={cn(s.row, !log.isRead && s.rowUnread)}
        onClick={handleToggle}
        data-testid="log-row"
      >
        <td className={s.tdDot}>
          <When condition={!log.isRead}>
            <span className={s.dot} />
          </When>
          <When condition={log.isRead}>
            <span className={s.dotEmpty} />
          </When>
        </td>
        <td className={s.tdMain}>
          <p className={s.message}>{log.message}</p>
          <When condition={!!log.url}>
            <p className={s.url}>{log.url}</p>
          </When>
        </td>
        <td className={s.tdUser}>{log.userId ?? '—'}</td>
        <td className={s.tdDate}>{formatDate(log.createdAt, 'long', langToLocale(lang))}</td>
      </tr>
      <When condition={expanded && !!log.stack}>
        <tr>
          <td colSpan={4} className={s.stack}>
            <pre className={s.stackPre}>{log.stack}</pre>
          </td>
        </tr>
      </When>
    </>
  );
};
