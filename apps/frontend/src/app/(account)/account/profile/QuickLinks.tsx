'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, Headset, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { s } from './page.styled';


export const QuickLinks = () => {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    router.prefetch('/account/orders');
    router.prefetch('/account/favorites');
    router.prefetch('/account/support');
  }, [router]);

  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>{t('profile.quickLinks')}</h2>
      <div className={s.quickLinks}>
        <Link href="/account/orders" className={s.linkCard}>
          <div className={s.linkIcon}>
            <Package className="h-5 w-5" />
          </div>
          <div className={s.linkInfo}>
            <p className={s.linkTitle}>{t('account.orders')}</p>
            <p className={s.linkDescription}>{t('profile.ordersDescription')}</p>
          </div>
          <ChevronRight className={s.linkArrow} />
        </Link>

        <Link href="/account/favorites" className={s.linkCard}>
          <div className={s.linkIcon}>
            <Heart className="h-5 w-5" />
          </div>
          <div className={s.linkInfo}>
            <p className={s.linkTitle}>{t('account.favorites')}</p>
            <p className={s.linkDescription}>{t('profile.favoritesDescription')}</p>
          </div>
          <ChevronRight className={s.linkArrow} />
        </Link>

        <Link href="/account/support" className={s.linkCard}>
          <div className={s.linkIcon}>
            <Headset className="h-5 w-5" />
          </div>
          <div className={s.linkInfo}>
            <p className={s.linkTitle}>{t('account.support')}</p>
            <p className={s.linkDescription}>{t('support.subtitle')}</p>
          </div>
          <ChevronRight className={s.linkArrow} />
        </Link>
      </div>
    </div>
  );
};
