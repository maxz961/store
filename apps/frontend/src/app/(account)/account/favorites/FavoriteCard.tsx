import Link from 'next/link';
import Image from 'next/image';
import { ImageOff, Trash2 } from 'lucide-react';
import { If, Then, Else } from 'react-if';
import { Spinner } from '@/components/ui/Spinner';
import { useRemoveFavorite } from '@/lib/hooks/useFavorites';
import { formatCurrency } from '@/lib/constants/format';
import { s } from './page.styled';
import type { FavoriteCardProps } from './page.types';


export const FavoriteCard = ({ favorite }: FavoriteCardProps) => {
  const { product } = favorite;
  const removeFavorite = useRemoveFavorite();

  const handleRemove = () => removeFavorite.mutate(product.id);

  return (
    <div className={s.card}>
      <Link href={`/products/${product.slug}`} className={s.imageLink}>
        <If condition={product.images.length > 0}>
          <Then>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={s.image}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          </Then>
          <Else>
            <div className={s.placeholder}>
              <ImageOff className={s.placeholderIcon} />
            </div>
          </Else>
        </If>
      </Link>

      <div className={s.content}>
        <Link href={`/products/${product.slug}`}>
          <p className={s.name}>{product.name}</p>
        </Link>
        <p className={s.category}>{product.category.name}</p>
        <div className={s.footer}>
          <span className={s.price}>{formatCurrency(Number(product.price))}</span>
          <button
            className={s.removeButton}
            onClick={handleRemove}
            disabled={removeFavorite.isPending}
            aria-label="Убрать из избранного"
          >
            <If condition={removeFavorite.isPending}>
              <Then><Spinner size="sm" /></Then>
              <Else><Trash2 className={s.removeIcon} /></Else>
            </If>
          </button>
        </div>
      </div>
    </div>
  );
};
