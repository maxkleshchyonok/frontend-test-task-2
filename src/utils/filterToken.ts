/**
 * Utility functions for managing filter tokens in URL
 */

const STORAGE_KEY = 'filterTokenMap';

interface TokenMap {
  [token: string]: string; // token -> machineTypeId
}

/**
 * Generate a random 8-character alphanumeric token
 */
export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Get the token map from localStorage
 */
function getTokenMap(): TokenMap {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save the token map to localStorage
 */
function saveTokenMap(map: TokenMap): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore write errors
  }
}

/**
 * Get or create a token for a machine type ID
 * Returns 'all' for the 'all' filter
 */
export function getTokenForTypeId(typeId: string): string {
  if (typeId === 'all') return 'all';
  
  const map = getTokenMap();
  
  // Check if we already have a token for this typeId
  const existingToken = Object.entries(map).find(([, id]) => id === typeId)?.[0];
  if (existingToken) return existingToken;
  
  // Generate a new token
  let token = generateToken();
  
  // Ensure uniqueness (very unlikely to collide, but just in case)
  while (map[token]) {
    token = generateToken();
  }
  
  // Save the new mapping
  map[token] = typeId;
  saveTokenMap(map);
  
  return token;
}

/**
 * Get the machine type ID for a token
 * Returns null if token not found
 */
export function getTypeIdForToken(token: string): string | null {
  if (token === 'all') return 'all';
  
  const map = getTokenMap();
  return map[token] || null;
}

/**
 * Clean up tokens for deleted machine types
 * Should be called when a machine type is deleted
 */
export function cleanupToken(typeId: string): void {
  if (typeId === 'all') return;
  
  const map = getTokenMap();
  const token = Object.entries(map).find(([, id]) => id === typeId)?.[0];
  
  if (token) {
    delete map[token];
    saveTokenMap(map);
  }
}
