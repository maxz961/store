import Link from 'next/link';
import { Package, ChevronRight, Headset } from 'lucide-react';
import { s } from './page.styled';


export const QuickLinks = () => {
  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>Быстрые ссылки</h2>
      <div className={s.quickLinks}>
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

        <Link href="/account/support" className={s.linkCard}>
          <div className={s.linkIcon}>
            <Headset className="h-5 w-5" />
          </div>
          <div className={s.linkInfo}>
            <p className={s.linkTitle}>Колл-центр</p>
            <p className={s.linkDescription}>Напишите нам — мы ответим как можно скорее</p>
          </div>
          <ChevronRight className={s.linkArrow} />
        </Link>
      </div>
    </div>
  );
};
