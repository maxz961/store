import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  }
  return email?.[0]?.toUpperCase() ?? '?';
}
