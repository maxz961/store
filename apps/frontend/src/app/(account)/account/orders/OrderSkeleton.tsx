import { s } from './page.styled';

export const OrderSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className={`${s.skeleton} h-4 w-32 mb-2`} />
        <div className={`${s.skeleton} h-3 w-24`} />
      </div>
      <div className="text-right">
        <div className={`${s.skeleton} h-4 w-20 mb-2`} />
        <div className={`${s.skeleton} h-5 w-24`} />
      </div>
    </div>
  </div>
);
