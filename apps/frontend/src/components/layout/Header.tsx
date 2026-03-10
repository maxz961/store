'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ShoppingCart, Sun, Moon, Store, Search, User, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/Dropdown';
import { useCartStore } from '@/store/cart';
import { useProductParams } from '@/lib/hooks/useProductParams';
import { useAuth } from '@/lib/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import { s } from './Header.styled';


export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { get, update } = useProductParams();
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  const itemCount = useCartStore((state) => state.items.reduce((acc, i) => acc + i.quantity, 0));
  const [query, setQuery] = useState(get('search') ?? '');

  const handleToggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    update({ search: query.trim() || undefined });
  }, [query, update]);

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), []);

  const initials = getInitials(user?.name, user?.email);

  const userTrigger = (
    <div className={s.userButton} aria-label="Меню пользователя">
      <If condition={!!user?.image}>
        <Then>
          <img src={user?.image ?? ''} alt="" className={s.userAvatar} referrerPolicy="no-referrer" />
        </Then>
        <Else>
          <span className={s.userFallback}>{initials}</span>
        </Else>
      </If>
    </div>
  );

  const userMenu = (
    <>
      <div className={s.dropdownHeader}>
        <p className={s.dropdownName}>{user?.name ?? 'Пользователь'}</p>
        <p className={s.dropdownEmail}>{user?.email}</p>
      </div>

      <Link href="/account/profile" className={s.dropdownItem}>
        <User className={s.dropdownIcon} />
        Профиль
      </Link>

      <Link href="/account/orders" className={s.dropdownItem}>
        <Package className={s.dropdownIcon} />
        Мои заказы
      </Link>

      <When condition={isAdmin}>
        <div className={s.dropdownDivider} />
        <Link href="/admin/dashboard" className={s.dropdownItem}>
          <LayoutDashboard className={s.dropdownIcon} />
          Админ-панель
        </Link>
      </When>

      <div className={s.dropdownDivider} />
      <button className={s.dropdownDanger} onClick={logout}>
        <LogOut className="h-4 w-4" />
        Выйти
      </button>
    </>
  );

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link href="/products" className={s.logo}>
          <Store className={s.logoIcon} />
          Store
        </Link>

        <form onSubmit={handleSearch} className={s.searchForm}>
          <div className={s.searchWrapper}>
            <Search className={s.searchIcon} />
            <input
              type="text"
              value={query}
              onChange={handleSearchInput}
              placeholder="Поиск товаров..."
              className={s.searchInput}
            />
          </div>
        </form>

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
              <Dropdown className="relative" trigger={userTrigger}>
                {userMenu}
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
