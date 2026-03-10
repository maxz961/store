import { s } from './page.styled';


export const STATUS_STYLES: Record<string, string> = {
  PENDING: s.statusPending,
  PROCESSING: s.statusProcessing,
  SHIPPED: s.statusShipped,
  DELIVERED: s.statusDelivered,
  CANCELLED: s.statusCancelled,
};
