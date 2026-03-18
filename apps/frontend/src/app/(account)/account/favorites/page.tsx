'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, UserCircle } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useLanguage } from '@/lib/i18n';
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
  const { t } = useLanguage();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: favorites, isLoading: favoritesLoading } = useFavorites();

  useEffect(() => {
    router.prefetch('/account/profile');
    router.prefetch('/account/orders');
    router.prefetch('/account/support');
  }, [router]);

  const isLoading = authLoading || favoritesLoading;

  if (!authLoading && !isAuthenticated) {
    return (
      <div className={s.page}>
        <div className={s.notAuth}>
          <UserCircle className={s.emptyIcon} />
          <p className={s.notAuthTitle}>{t('favorites.notAuth')}</p>
          <p className={s.notAuthText}>{t('favorites.notAuthText')}</p>
          <Link href="/login">
            <Button>{t('favorites.login')}</Button>
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
                <p className={s.emptyTitle}>{t('favorites.empty')}</p>
                <p className={s.emptyText}>{t('favorites.emptyText')}</p>
                <Link href="/products">
                  <Button>{t('favorites.browseCatalog')}</Button>
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
