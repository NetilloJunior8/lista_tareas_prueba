import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Función cn(...) estándar de shadcn/ui.
 * Combina clases condicionales con clsx y resuelve conflictos de Tailwind con tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
