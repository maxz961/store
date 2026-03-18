import { s } from './page.styled';


export const OrderDetailSkeleton = () => (
  <div className={s.skeletonRow}>
    <div className={s.skeletonImage} />
    <div className={s.skeletonInfo}>
      <div className={s.skeletonName} />
      <div className={s.skeletonQty} />
    </div>
    <div className={s.skeletonPrice} />
  </div>
);
