'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';


type ParamValue = string | string[] | undefined;

export const useProductParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: string) => searchParams.get(key) ?? undefined,
    [searchParams],
  );

  const update = useCallback(
    (updates: Record<string, ParamValue>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');

      for (const [key, value] of Object.entries(updates)) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, value);
        }
      }

      router.push(`/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const reset = useCallback(() => {
    router.push('/products', { scroll: false });
  }, [router]);

  return { get, update, reset, searchParams };
};
