'use client';

import Link from 'next/link';
import { User, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { When } from 'react-if';
import { useLanguage } from '@/lib/i18n';
import { s } from '../Header.styled';
import type { UserMenuProps } from './UserMenu.types';


export const UserMenu = ({ user, isAdmin, isManager, logout }: UserMenuProps) => {
  const { t } = useLanguage();

  return (
    <>
      <div className={s.dropdownHeader}>
        <p className={s.dropdownName}>{user?.name ?? t('profile.user')}</p>
        <p className={s.dropdownEmail}>{user?.email}</p>
      </div>

      <Link href="/account/profile" className={s.dropdownItem}>
        <User className={s.dropdownIcon} />
        {t('account.profile')}
      </Link>

      <Link href="/account/orders" className={s.dropdownItem}>
        <Package className={s.dropdownIcon} />
        {t('account.orders')}
      </Link>

      <When condition={isAdmin || isManager}>
        <div className={s.dropdownDivider} />
        <Link href="/admin/dashboard" className={s.dropdownItem}>
          <LayoutDashboard className={s.dropdownIcon} />
          {t('admin.sidebarTitle')}
        </Link>
      </When>

      <div className={s.dropdownDivider} />
      <button className={s.dropdownDanger} onClick={logout}>
        <LogOut className="h-4 w-4" />
        {t('nav.logout')}
      </button>
    </>
  );
};
