'use client';

import { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ShoppingCart, Sun, Moon, Store } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/Dropdown';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMyUnreadCount, useAdminUnreadCount } from '@/lib/hooks/useSupport';
import { useImageErrorCount } from '@/lib/hooks/useAdmin';
import { useUnreadLogsCount } from '@/lib/hooks/useLogs';
import { useLanguage } from '@/lib/i18n';
import { getInitials } from '@/lib/utils';
import { UserTrigger } from './UserTrigger/UserTrigger';
import { UserMenu } from './UserMenu/UserMenu';
import { SearchInput } from './SearchInput';
import { LangSwitcher } from './LangSwitcher';
import { s } from './Header.styled';


export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { user, isAuthenticated, isAdmin, isManager, login, logout } = useAuth();
  const itemCount = useCartStore((state) => state.items.reduce((acc, i) => acc + i.quantity, 0));
  const isAdminOrManager = isAdmin || isManager;
  const { data: myUnreadCount } = useMyUnreadCount(isAuthenticated && !isAdminOrManager);
  const { data: adminUnreadCount } = useAdminUnreadCount(isAdminOrManager);
  const { data: imageErrorData } = useImageErrorCount(isAdminOrManager);
  const { data: logsUnread } = useUnreadLogsCount(isAdminOrManager);
  const hasUnread = isAdminOrManager
    ? (!!adminUnreadCount && adminUnreadCount > 0)
    : (!!myUnreadCount && myUnreadCount > 0);
  const hasImageErrors = isAdminOrManager && !!imageErrorData?.count && imageErrorData.count > 0;
  const hasUnreadLogs = isAdminOrManager && !!logsUnread && logsUnread > 0;

  useEffect(() => {
    if (!isAuthenticated) return;
    router.prefetch('/account/profile');
    router.prefetch('/account/orders');
    router.prefetch('/account/support');
    router.prefetch('/cart');
    if (isAdminOrManager) router.prefetch('/admin/dashboard');
  }, [router, isAuthenticated, isAdminOrManager]);

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
          <Button variant="ghost" size="icon" onClick={handleToggleTheme} aria-label={t('common.toggleTheme')} suppressHydrationWarning>
            <Sun className={s.sunIcon} />
            <Moon className={s.moonIcon} />
          </Button>

          <LangSwitcher />

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative" aria-label={t('cart.title')}>
              <ShoppingCart className={s.cartIcon} />
              <When condition={itemCount > 0}>
                <span className={s.cartBadge}>{itemCount}</span>
              </When>
            </Button>
          </Link>

          <If condition={isAuthenticated && !!user}>
            <Then>
              <Dropdown className={s.userDropdown} trigger={<UserTrigger image={user?.image} initials={initials} hasUnreadMessages={hasUnread} hasImageErrors={hasImageErrors} hasUnreadLogs={hasUnreadLogs} />}>
                <UserMenu user={user!} isAdmin={isAdmin} isManager={isManager} logout={logout} />
              </Dropdown>
            </Then>
            <Else>
              <Button variant="ghost" size="sm" className={s.loginButton} onClick={login}>
                {t('nav.login')}
              </Button>
            </Else>
          </If>
        </div>
      </div>
    </header>
  );
};
