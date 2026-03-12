import { toast } from 'sonner';
import { api } from '@/lib/api';


/**
 * Показывает toast об ошибке и записывает в лог.
 * Использовать в onError всех admin-мутаций.
 */
export const reportAdminError = (error: unknown, context: string): void => {
  const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
  toast.error(`${context}: ${message}`);

  void api.post('/logs', {
    message: `[Admin] ${context}: ${message}`,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  }).catch(() => {});
};
