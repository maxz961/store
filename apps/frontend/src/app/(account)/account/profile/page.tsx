'use client';

import Link from 'next/link';
import { UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import { s } from './page.styled';
import { breadcrumbs } from './page.constants';
import { UserCard } from './UserCard';
import { QuickLinks } from './QuickLinks';


const ProfilePage = () => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div className={s.page}>
        <Breadcrumbs items={breadcrumbs} />
        <div className={s.loadingSection}>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <div className={s.skeletonAvatar} />
              <div className={s.userInfo}>
                <div className={s.skeletonName} />
                <div className={s.skeletonEmail} />
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
          <UserCircle className={s.avatarFallbackIcon} />
          <p className={s.notAuthTitle}>Вы не авторизованы</p>
          <p className={s.notAuthText}>Войдите, чтобы увидеть свой профиль</p>
          <Link href="/login">
            <Button>Войти</Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = getInitials(user.name, user.email);

  const memberSince = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <h1 className={s.pageTitle}>Профиль</h1>

      <UserCard
        name={user.name}
        email={user.email}
        image={user.image}
        initials={initials}
        memberSince={memberSince}
        onLogout={logout}
      />

      <QuickLinks />
    </div>
  );
};

export default ProfilePage;
