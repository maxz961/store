'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Badge } from '@/components/ui/badge';
import { s } from './page.styled';
import { formatCurrency } from '@/lib/constants/format';
import { api } from '@/lib/api';
import type { ProductRowProps } from './page.types';


export const ProductRow = ({ product }: ProductRowProps) => {
  const router = useRouter();
  const errorReported = useRef(false);
  const [imgError, setImgError] = useState(false);

  const handleRowClick = useCallback(() => {
    router.push(`/products/${product.slug}`);
  }, [router, product.slug]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleImageError = useCallback(() => {
    setImgError(true);
    if (errorReported.current) return;
    errorReported.current = true;
    api.patch(`/products/${product.id}/image-error`).catch(() => undefined);
  }, [product.id]);

  return (
    <tr className={s.tr} onClick={handleRowClick}>
      <td className={s.td}>
        <div className={s.productCell}>
          <If condition={product.images.length > 0 && !imgError}>
            <Then>
              <Image
                src={product.images[0]}
                alt=""
                width={40}
                height={40}
                className={s.productImage}
                onError={handleImageError}
                unoptimized
              />
            </Then>
            <Else>
              <div className={s.productImageFallback}>—</div>
            </Else>
          </If>
          <span className={s.productName}>{product.name}</span>
        </div>
      </td>
      <td className={s.td}>
        <span className={s.category}>{product.category?.name ?? '—'}</span>
      </td>
      <td className={s.td}>
        <div className={s.tagsWrapper}>
          {product.tags?.slice(0, 3).map((t) => (
            <Badge
              key={t.tag.slug}
              variant="outline"
              className={s.tag}
              style={t.tag.color ? {
                borderColor: `${t.tag.color}40`,
                backgroundColor: `${t.tag.color}12`,
                color: t.tag.color,
              } : undefined}
            >
              {t.tag.name}
            </Badge>
          ))}
        </div>
      </td>
      <td className={s.tdRight}>
        <span className={s.price}>{formatCurrency(Number(product.price))}</span>
      </td>
      <td className={s.tdRight}>
        <span className={product.stock <= 5 ? s.stockLow : s.stock}>{product.stock}</span>
      </td>
      <td className={s.tdCenter}>
        <If condition={product.isPublished}>
          <Then><span className={s.statusPublished}>Published</span></Then>
          <Else><span className={s.statusDraft}>Draft</span></Else>
        </If>
      </td>
      <td className={s.td}>
        <Link href={`/admin/products/${product.slug}`} className={s.editLink} onClick={handleEditClick}>
          <Pencil className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
};
