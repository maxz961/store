'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { When } from 'react-if';
import { s } from './layout.styled';
import { NAV_ITEMS } from './layout.constants';
import { useAdminUnreadCount } from '@/lib/hooks/useSupport';


export const AdminSidebar = () => {
  const pathname = usePathname();
  const { data: unreadCount } = useAdminUnreadCount();

  return (
    <aside className={s.sidebar}>
      <nav className={s.sidebarInner}>
        <p className={s.sidebarTitle}>Администрирование</p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          const isSupport = href === '/admin/support';

          return (
            <Link
              key={href}
              href={href}
              className={isActive ? s.navLinkActive : s.navLink}
            >
              <Icon className={s.navIcon} />
              <span className={s.navLabelGroup}>
                {label}
                <When condition={isSupport && !!unreadCount && unreadCount > 0}>
                  <span className={s.navBadge} data-testid="support-unread-badge">
                    {unreadCount}
                  </span>
                </When>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
