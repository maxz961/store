import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Lang } from '@/lib/i18n';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  }
  return email?.[0]?.toUpperCase() ?? '?';
}

export function getLocalizedText(lang: Lang, uk: string, en?: string | null): string {
  return lang === 'uk' ? uk : (en || uk);
}
