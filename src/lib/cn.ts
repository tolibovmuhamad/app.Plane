/**
 * Утилита склейки классов (заготовка). При появлении зависимостей
 * можно заменить на clsx + tailwind-merge.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
