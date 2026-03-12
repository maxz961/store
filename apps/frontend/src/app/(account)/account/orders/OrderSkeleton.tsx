import { s } from './page.styled';


export const OrderSkeleton = () => (
  <div className={s.skeletonCard}>
    <div className={s.skeletonRow}>
      <div className={s.skeletonLeft}>
        <div className={s.skeletonTitle} />
        <div className={s.skeletonSubtitle} />
      </div>
      <div className={s.skeletonRight}>
        <div className={s.skeletonAmount} />
        <div className={s.skeletonBadge} />
      </div>
    </div>
  </div>
);
