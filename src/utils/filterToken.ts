const STORAGE_KEY = "filterTokenMap";

interface TokenMap {
  [token: string]: string;
}

export function generateToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function getTokenMap(): TokenMap {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveTokenMap(map: TokenMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore write errors
  }
}

export function getTokenForTypeId(typeId: string): string {
  if (typeId === "all") return "all";

  const map = getTokenMap();

  const existingToken = Object.entries(map).find(
    ([, id]) => id === typeId
  )?.[0];
  if (existingToken) return existingToken;

  let token = generateToken();

  while (map[token]) {
    token = generateToken();
  }

  map[token] = typeId;
  saveTokenMap(map);

  return token;
}

export function getTypeIdForToken(token: string): string | null {
  if (token === "all") return "all";

  const map = getTokenMap();
  return map[token] || null;
}

export function cleanupToken(typeId: string): void {
  if (typeId === "all") return;

  const map = getTokenMap();
  const token = Object.entries(map).find(([, id]) => id === typeId)?.[0];

  if (token) {
    delete map[token];
    saveTokenMap(map);
  }
}
