import Link from 'next/link';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { s } from './page.styled';
import { breadcrumbs } from './page.constants';
import { PromotionsTable } from './PromotionsTable';
import type { Promotion } from './page.types';


const AdminPromotionsPage = async () => {
  const promotions = await api.get<Promotion[]>('/promotions', { cache: 'no-store', server: true });

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={s.header}>
        <h1 className={s.title}>Акции</h1>
        <Link href="/admin/promotions/new">
          <Button size="sm">
            <Plus className={s.buttonIcon} />
            Добавить акцию
          </Button>
        </Link>
      </div>

      <PromotionsTable promotions={promotions} />
    </div>
  );
};

export default AdminPromotionsPage;
