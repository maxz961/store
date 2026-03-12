import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { s } from './page.styled';
import type { OrderHeaderProps } from './page.types';


export const OrderHeader = ({ orderId, date }: OrderHeaderProps) => (
  <>
    <div className={s.titleRow}>
      <Link href="/account/orders">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <h1 className={s.title}>Заказ #{orderId.slice(-8)}</h1>
    </div>
    <p className={s.subtitle}>{date}</p>
  </>
);
