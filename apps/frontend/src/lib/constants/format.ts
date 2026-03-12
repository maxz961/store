export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UAH', minimumFractionDigits: 0 }).format(value);

export const formatDate = (date: string, monthFormat: 'short' | 'long' = 'short') =>
  new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: monthFormat, year: 'numeric' });
