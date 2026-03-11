import { LayoutDashboard, Package, ShoppingCart, Megaphone, FolderTree, Tags, Users, MessageSquare, Headset } from 'lucide-react';


export const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Аналитика', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Товары', icon: Package },
  { href: '/admin/categories', label: 'Категории', icon: FolderTree },
  { href: '/admin/tags', label: 'Теги', icon: Tags },
  { href: '/admin/orders', label: 'Заказы', icon: ShoppingCart },
  { href: '/admin/promotions', label: 'Акции', icon: Megaphone },
  { href: '/admin/users', label: 'Пользователи', icon: Users },
  { href: '/admin/reviews', label: 'Отзывы', icon: MessageSquare },
  { href: '/admin/support', label: 'Поддержка', icon: Headset },
] as const;
