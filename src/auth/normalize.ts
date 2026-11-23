export function normalizeBirthday(value: string): string {
  const trimmed = value.trim();
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    const month = parseInt(iso[2], 10);
    const day = parseInt(iso[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }
  const monthDay = trimmed.match(/^(\d{1,2})-(\d{1,2})$/);
  if (monthDay) {
    const month = parseInt(monthDay[1], 10);
    const day = parseInt(monthDay[2], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }
  return trimmed;
}

export function birthdayFromParts(month: string, day: string): string {
  const m = parseInt(month.trim(), 10);
  const d = parseInt(day.trim(), 10);
  if (
    Number.isNaN(m) ||
    Number.isNaN(d) ||
    m < 1 ||
    m > 12 ||
    d < 1 ||
    d > 31
  ) {
    return "";
  }
  return normalizeBirthday(`${m}-${d}`);
}

export function normalizeHometown(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeOptionId(value: string): string {
  return value.trim();
}