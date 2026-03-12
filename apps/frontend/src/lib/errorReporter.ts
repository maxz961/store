import { toast } from 'sonner';
import { api } from '@/lib/api';


/**
 * Используется в onError admin-мутаций — показывает конкретный контекст.
 * Мутации с этим обработчиком должны иметь meta: { suppressGlobalError: true }
 * чтобы глобальный QueryCache не показал второй toast.
 */
export const reportAdminError = (error: unknown, context: string): void => {
  const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
  toast.error(`${context}: ${message}`);

  void api.post('/logs', {
    message: `[Admin] ${context}: ${message}`,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  }).catch(() => {});
};

/**
 * Вызывается глобальным QueryCache/MutationCache для всех остальных ошибок
 * (shop-запросы, shop-мутации). Показывает общее сообщение и пишет в лог.
 */
export const reportShopError = (error: unknown, context: string): void => {
  toast.error('Что-то пошло не так — мы уже отловили эту ошибку, скоро исправим');

  const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
  void api.post('/logs', {
    message: `[Shop] ${context}: ${message}`,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  }).catch(() => {});
};
