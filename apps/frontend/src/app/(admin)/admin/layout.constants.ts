import { LayoutDashboard, Package, ShoppingCart, Megaphone } from 'lucide-react';


export const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Аналитика', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Товары', icon: Package },
  { href: '/admin/orders', label: 'Заказы', icon: ShoppingCart },
  { href: '/admin/promotions', label: 'Акции', icon: Megaphone },
] as const;
