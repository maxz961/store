import { s } from './page.styled';

export const OrderDetailSkeleton = () => (
  <div className="flex items-center gap-4 p-5 border-b border-border last:border-0">
    <div className={`${s.skeleton} h-14 w-14 rounded-lg`} />
    <div className="flex-1">
      <div className={`${s.skeleton} h-4 w-48 mb-2`} />
      <div className={`${s.skeleton} h-3 w-20`} />
    </div>
    <div className={`${s.skeleton} h-4 w-16`} />
  </div>
);
