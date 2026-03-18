export interface Order {
  id: string;
  status: string;
  deliveryMethod: string;
  totalAmount: number;
  createdAt: string;
  user: { name: string | null; email: string } | null;
}

export interface OrdersResponse {
  items: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export interface OrderFilterTabsProps {
  activeStatus: string;
}

export interface FilterTabProps {
  value: string;
  label: string;
  isActive: boolean;
}

export interface OrdersTableProps {
  orders: OrdersResponse['items'];
}

export interface OrderRowProps {
  order: Order;
}

export interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  activeStatus: string;
  sortBy?: string;
  sortOrder?: string;
}
