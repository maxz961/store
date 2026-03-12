'use client';

import Link from 'next/link';
import { Heart, UserCircle } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { s } from './page.styled';
import { breadcrumbs } from './page.constants';
import { FavoriteCard } from './FavoriteCard';


const FavoriteSkeleton = () => (
  <div className={s.skeleton}>
    <div className={s.skeletonImage} />
    <div className={s.skeletonContent}>
      <div className={s.skeletonTitle} />
      <div className={s.skeletonPrice} />
    </div>
  </div>
);


const FavoritesPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: favorites, isLoading: favoritesLoading } = useFavorites();

  const isLoading = authLoading || favoritesLoading;

  if (!authLoading && !isAuthenticated) {
    return (
      <div className={s.page}>
        <div className={s.notAuth}>
          <UserCircle className={s.emptyIcon} />
          <p className={s.notAuthTitle}>Вы не авторизованы</p>
          <p className={s.notAuthText}>Войдите, чтобы увидеть избранное</p>
          <Link href="/login">
            <Button>Войти</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <If condition={isLoading}>
        <Then>
          <div className={s.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <FavoriteSkeleton key={i} />
            ))}
          </div>
        </Then>
        <Else>
          <If condition={!favorites || favorites.length === 0}>
            <Then>
              <div className={s.empty}>
                <Heart className={s.emptyIcon} />
                <p className={s.emptyTitle}>Избранное пусто</p>
                <p className={s.emptyText}>Добавляйте товары в избранное, чтобы вернуться к ним позже</p>
                <Link href="/products">
                  <Button>Перейти в каталог</Button>
                </Link>
              </div>
            </Then>
            <Else>
              <div className={s.grid}>
                {favorites?.map((favorite) => (
                  <FavoriteCard
                    key={favorite.id}
                    favorite={favorite}
                  />
                ))}
              </div>
            </Else>
          </If>
        </Else>
      </If>
    </div>
  );
};

export default FavoritesPage;
