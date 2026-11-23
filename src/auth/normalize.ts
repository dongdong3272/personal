export function normalizeBirthday(value: string): string {
  return value.trim();
}

export function normalizeHometown(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeOptionId(value: string): string {
  return value.trim();
}