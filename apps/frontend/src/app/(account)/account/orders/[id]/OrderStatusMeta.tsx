import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { STATUS_LABELS, DELIVERY_LABELS } from '@/lib/constants/order';
import { STATUS_STYLES } from './page.constants';
import { s } from './page.styled';
import type { OrderStatusMetaProps } from './page.types';


export const OrderStatusMeta = ({ status, deliveryMethod }: OrderStatusMetaProps) => (
  <div className={s.meta}>
    <Badge className={cn(STATUS_STYLES[status])}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
    <Badge className={s.deliveryBadge}>
      {DELIVERY_LABELS[deliveryMethod] ?? deliveryMethod}
    </Badge>
  </div>
);
