'use client';

import Link from 'next/link';
import { Package, LogOut, ChevronRight, UserCircle } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/hooks/useAuth';
import { s } from './page.styled';

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Профиль' },
];

const ProfilePage = () => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-6">
          <div className={s.card}>
            <div className={s.cardHeader}>
              <div className={`${s.skeleton} h-16 w-16 rounded-full`} />
              <div className={s.userInfo}>
                <div className={`${s.skeleton} h-5 w-40 mb-2`} />
                <div className={`${s.skeleton} h-4 w-56`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={s.page}>
        <div className={s.notAuth}>
          <UserCircle className="h-12 w-12 text-muted-foreground" />
          <p className={s.notAuthTitle}>Вы не авторизованы</p>
          <p className={s.notAuthText}>Войдите, чтобы увидеть свой профиль</p>
          <Link href="/login">
            <Button>Войти</Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase();

  const memberSince = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <h1 className={`${s.title} mt-6 mb-6`}>Профиль</h1>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <If condition={!!user.image}>
            <Then>
              <img src={user.image ?? ''} alt="" className={s.avatar} referrerPolicy="no-referrer" />
            </Then>
            <Else>
              <span className={s.avatarFallback}>{initials}</span>
            </Else>
          </If>
          <div className={s.userInfo}>
            <p className={s.userName}>{user.name ?? 'Пользователь'}</p>
            <p className={s.userEmail}>{user.email}</p>
            <p className={s.userMeta}>Участник с {memberSince}</p>
          </div>
        </div>

        <div className={s.actions}>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>

      <div className={s.section}>
        <h2 className={s.sectionTitle}>Быстрые ссылки</h2>
        <div className="space-y-3">
          <Link href="/account/orders" className={s.linkCard}>
            <div className={s.linkIcon}>
              <Package className="h-5 w-5" />
            </div>
            <div className={s.linkInfo}>
              <p className={s.linkTitle}>Мои заказы</p>
              <p className={s.linkDescription}>История покупок и статусы доставки</p>
            </div>
            <ChevronRight className={s.linkArrow} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
