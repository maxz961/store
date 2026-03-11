'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ShoppingCart, Sun, Moon, Store, Search } from 'lucide-react';
import { If, Then, Else, When } from 'react-if';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/Dropdown';
import { useCartStore } from '@/store/cart';
import { useProductParams } from '@/lib/hooks/useProductParams';
import { useAuth } from '@/lib/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import { UserTrigger } from './UserTrigger/UserTrigger';
import { UserMenu } from './UserMenu/UserMenu';
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
              <Dropdown className="relative" trigger={<UserTrigger image={user?.image} initials={initials} />}>
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
