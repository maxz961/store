import type { CartItem as CartItemData } from '@/store/cart';

export interface CartItemProps {
  item: CartItemData;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}
