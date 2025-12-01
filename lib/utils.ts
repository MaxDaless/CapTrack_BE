import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('fr-BE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-BE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function parseDate(dateString: string): Date {
  // Try common date formats
  const formats = [
    // DD/MM/YYYY
    /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/,
    // YYYY-MM-DD
    /^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/,
    // MM/DD/YYYY
    /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/,
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      // Assume DD/MM/YYYY as primary format for Belgian data
      const [_, p1, p2, p3] = match;
      if (p1.length === 4) {
        // YYYY-MM-DD format
        return new Date(`${p1}-${p2}-${p3}`);
      } else {
        // DD/MM/YYYY format
        return new Date(`${p3}-${p2}-${p1}`);
      }
    }
  }

  // Fallback to Date constructor
  return new Date(dateString);
}

export function parseNumber(value: string | number): number {
  if (typeof value === 'number') return value;

  // Remove common thousand separators and replace comma decimal separator
  const cleaned = value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');

  return parseFloat(cleaned) || 0;
}
