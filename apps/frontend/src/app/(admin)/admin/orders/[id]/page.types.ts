export interface StatusSectionProps {
  orderStatus: string;
  onUpdateStatus: (status: string) => () => void;
  isPending: boolean;
}

export interface DeliveryCardProps {
  deliveryMethod: string;
}

export interface AddressCardProps {
  address: {
    fullName: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

export interface OrderItemsListProps {
  items: OrderItem[];
  totalAmount: number;
}

export interface OrderItemRowProps {
  item: OrderItem;
}

export interface StatusButtonProps {
  status: string;
  label: string;
  isActive: boolean;
  disabled: boolean;
  onClick: () => void;
}
