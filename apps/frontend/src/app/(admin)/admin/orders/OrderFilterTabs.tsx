import { FilterTab } from './FilterTab';
import { s } from './page.styled';
import { FILTER_TABS } from '@/lib/constants/order';
import type { OrderFilterTabsProps } from './page.types';

export const OrderFilterTabs = ({ activeStatus }: OrderFilterTabsProps) => (
  <div className={s.filters}>
    {FILTER_TABS.map(({ value, label }) => (
      <FilterTab key={value} value={value} label={label} isActive={activeStatus === value} />
    ))}
  </div>
);
