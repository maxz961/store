export const formatCurrency = (value: number) => {
  const formatted = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0 }).format(value);
  return `${formatted} ₴`;
};

export const formatDate = (date: string, monthFormat: 'short' | 'long' = 'short', locale = 'uk-UA') =>
  new Date(date).toLocaleDateString(locale, { day: 'numeric', month: monthFormat, year: 'numeric' });
