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
