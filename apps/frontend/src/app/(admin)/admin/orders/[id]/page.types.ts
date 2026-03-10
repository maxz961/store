export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

export interface Order {
  id: string;
  status: string;
  deliveryMethod: string;
  totalAmount: number;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderItems: OrderItem[];
  user: { name: string | null; email: string } | null;
}
