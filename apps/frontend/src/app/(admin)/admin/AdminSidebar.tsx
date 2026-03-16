'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AlertTriangle, X } from 'lucide-react';
import { When } from 'react-if';
import { cn } from '@/lib/utils';
import { s } from './layout.styled';
import { NAV_ITEMS } from './layout.constants';
import { useAdminUnreadCount } from '@/lib/hooks/useSupport';
import { useImageErrorCount } from '@/lib/hooks/useAdmin';
import { useUnreadLogsCount } from '@/lib/hooks/useLogs';


interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}


export const AdminSidebar = ({ isOpen = false, onClose }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: unreadCount } = useAdminUnreadCount();
  const { data: imageErrorData } = useImageErrorCount();
  const { data: logsUnread } = useUnreadLogsCount();
  const hasImageErrors = !!imageErrorData?.count && imageErrorData.count > 0;

  useEffect(() => {
    NAV_ITEMS.forEach(({ href }) => router.prefetch(href));
  }, [router]);

  const navItems = NAV_ITEMS.map(({ href, label, icon: Icon }) => {
    const isActive = pathname.startsWith(href);
    const isSupport = href === '/admin/support';
    const isProducts = href === '/admin/products';
    const isLogs = href === '/admin/logs';

    return (
      <Link
        key={href}
        href={href}
        className={isActive ? s.navLinkActive : s.navLink}
        onClick={onClose}
      >
        <Icon className={s.navIcon} />
        <span className={s.navLabelGroup}>
          {label}
          <When condition={isSupport && !!unreadCount && unreadCount > 0}>
            <span className={s.navBadge} data-testid="support-unread-badge">
              {unreadCount}
            </span>
          </When>
          <When condition={isProducts && hasImageErrors}>
            <AlertTriangle className={s.navWarningIcon} data-testid="products-image-error-icon" />
          </When>
          <When condition={isLogs && !!logsUnread && logsUnread > 0}>
            <span className={s.navBadgeWarning} data-testid="logs-unread-badge">{logsUnread}</span>
          </When>
        </span>
      </Link>
    );
  });

  return (
    <>
      <When condition={isOpen}>
        <div className={s.backdrop} onClick={onClose} />
      </When>

      <aside className={cn(isOpen ? s.sidebarMobileOpen : s.sidebar)}>
        <When condition={isOpen}>
          <div className={s.drawerHeader}>
            <p className={s.sidebarTitle} style={{ margin: 0 }}>Administration</p>
            <button onClick={onClose} className={s.drawerClose} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
        </When>
        <nav className={s.sidebarInner}>
          <When condition={!isOpen}>
            <p className={s.sidebarTitle}>Administration</p>
          </When>
          {navItems}
        </nav>
      </aside>
    </>
  );
};
