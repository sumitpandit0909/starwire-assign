/**
 * Central API Configuration for STARWIRE Intelligence
 * Handles both unified single-domain deployment & separate Frontend/Backend hosting.
 */

export const API_BASE_URL = ((import.meta as any).env?.VITE_BACKEND_URL || '').replace(/\/+$/, '');

/**
 * Returns the full API URL for a given endpoint path.
 * If VITE_BACKEND_URL is set (separate hosting), prepends it to /api/...
 * If VITE_BACKEND_URL is empty (unified or local proxy), uses relative path /api/...
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) return cleanPath;
  return `${API_BASE_URL}${cleanPath}`;
}
