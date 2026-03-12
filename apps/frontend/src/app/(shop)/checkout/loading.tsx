import { Spinner } from '@/components/ui/Spinner';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { breadcrumbs } from './page.constants';


export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    </div>
  );
}
