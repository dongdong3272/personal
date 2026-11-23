const STORAGE_KEY = "personal_site_auth";
export const AUTH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type StoredAuth = {
  verifiedAt: number;
  expiresAt: number;
};

function readRaw(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as StoredAuth;
    if (
      typeof parsed.verifiedAt !== "number" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function readValidAuth(): StoredAuth | null {
  const stored = readRaw();
  if (!stored) {
    return null;
  }
  if (Date.now() > stored.expiresAt) {
    clearAuth();
    return null;
  }
  return stored;
}

export function writeAuth(now = Date.now()): StoredAuth {
  const record: StoredAuth = {
    verifiedAt: now,
    expiresAt: now + AUTH_TTL_MS,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  return record;
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return readValidAuth() !== null;
}