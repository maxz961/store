'use client';

import { AlertTriangle } from 'lucide-react';
import { When } from 'react-if';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useLogs, useMarkLogsRead } from '@/lib/hooks/useLogs';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';
import { LogsTable } from './LogsTable';


const AdminLogsPage = () => {
  const { t } = useLanguage();
  const { data: logs = [], isLoading } = useLogs();
  const markRead = useMarkLogsRead();

  const unreadCount = logs.filter((l) => !l.isRead).length;

  const breadcrumbs = [
    { label: t('nav.admin'), href: '/admin/dashboard' },
    { label: t('admin.logs.breadcrumbLabel') },
  ];

  const handleMarkAllRead = () => {
    markRead.mutate();
  };

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className="flex justify-center py-16"><Spinner /></div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <div className={s.header}>
        <h1 className={s.title}>{t('admin.logs.pageTitle')}</h1>
        <When condition={unreadCount > 0}>
          <Button
            size="sm"
            variant="outline"
            disabled={markRead.isPending}
            onClick={handleMarkAllRead}
          >
            {t('admin.logs.markAllRead')}
          </Button>
        </When>
      </div>

      <When condition={logs.length === 0}>
        <div className={s.emptyState}>
          <AlertTriangle className={s.emptyIcon} />
          <p className={s.emptyText}>{t('admin.logs.emptyState')}</p>
        </div>
      </When>

      <When condition={logs.length > 0}>
        <LogsTable logs={logs} />
      </When>
    </div>
  );
};

export default AdminLogsPage;
