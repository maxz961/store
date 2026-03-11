'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ShoppingCart, Sun, Moon, Store } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/Dropdown';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMyUnreadCount, useAdminUnreadCount } from '@/lib/hooks/useSupport';
import { getInitials } from '@/lib/utils';
import { UserTrigger } from './UserTrigger/UserTrigger';
import { UserMenu } from './UserMenu/UserMenu';
import { SearchInput } from './SearchInput';
import { s } from './Header.styled';


export const Header = () => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  const itemCount = useCartStore((state) => state.items.reduce((acc, i) => acc + i.quantity, 0));
  const { data: myUnreadCount } = useMyUnreadCount();
  const { data: adminUnreadCount } = useAdminUnreadCount(isAdmin);
  const hasUnread = isAdmin
    ? (!!adminUnreadCount && adminUnreadCount > 0)
    : (!!myUnreadCount && myUnreadCount > 0);

  const handleToggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);

  const initials = getInitials(user?.name, user?.email);

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link href="/products" className={s.logo}>
          <Store className={s.logoIcon} />
          Store
        </Link>

        <When condition={!isAdminPage}>
          <SearchInput />
        </When>

        <div className={s.actions}>
          <Button variant="ghost" size="icon" onClick={handleToggleTheme} aria-label="Переключить тему">
            <Sun className={s.sunIcon} />
            <Moon className={s.moonIcon} />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative" aria-label="Корзина">
              <ShoppingCart className={s.cartIcon} />
              <When condition={itemCount > 0}>
                <span className={s.cartBadge}>{itemCount}</span>
              </When>
            </Button>
          </Link>

          <If condition={isAuthenticated && !!user}>
            <Then>
              <Dropdown className="relative" trigger={<UserTrigger image={user?.image} initials={initials} hasUnreadMessages={hasUnread} />}>
                <UserMenu user={user!} isAdmin={isAdmin} logout={logout} />
              </Dropdown>
            </Then>
            <Else>
              <Button variant="ghost" size="sm" className={s.loginButton} onClick={login}>
                Войти
              </Button>
            </Else>
          </If>
        </div>
      </div>
    </header>
  );
};
