'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { s } from './layout.styled';
import { NAV_ITEMS } from './layout.constants';


export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className={s.sidebar}>
      <nav className={s.sidebarInner}>
        <p className={s.sidebarTitle}>Администрирование</p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={isActive ? s.navLinkActive : s.navLink}
            >
              <Icon className={s.navIcon} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
