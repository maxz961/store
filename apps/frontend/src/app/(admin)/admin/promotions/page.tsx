'use client';

import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Spinner } from '@/components/ui/Spinner';
import { usePromotions } from '@/lib/hooks/usePromotions';
import { s } from './page.styled';
import { breadcrumbs } from './page.constants';
import { PromotionsTable } from './PromotionsTable';


const AdminPromotionsContent = () => {
  const { data: promotions = [], isLoading } = usePromotions();

  if (isLoading) {
    return <div className="flex justify-center py-24"><Spinner /></div>;
  }

  return <PromotionsTable promotions={promotions} />;
};


const AdminPromotionsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/admin/promotions/new');
  }, [router]);

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <div className={s.header}>
        <Link href="/admin/promotions/new">
          <Button size="sm">
            <Plus className={s.buttonIcon} />
            New promotion
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="flex justify-center py-24"><Spinner /></div>}>
        <AdminPromotionsContent />
      </Suspense>
    </div>
  );
};

export default AdminPromotionsPage;
