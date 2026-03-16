import { LayoutDashboard, Package, ShoppingCart, Megaphone, FolderTree, Tags, Users, MessageSquare, Headset, AlertTriangle } from 'lucide-react';


export const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Analytics', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/tags', label: 'Tags', icon: Tags },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/promotions', label: 'Promotions', icon: Megaphone },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/support', label: 'Support', icon: Headset },
  { href: '/admin/logs', label: 'Logs', icon: AlertTriangle },
] as const;
