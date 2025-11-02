/**
 * Helper functions for JWT token operations
 */

/**
 * Decode JWT token (base64 decode payload)
 * @param token JWT token string
 * @returns Decoded payload object or null
 */
export function decodeJWT(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Get role from JWT token
 * @param token JWT token string
 * @returns Role string or null
 */
export function getRoleFromToken(token: string): string | null {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // Check for role in different claim types
  return (
    decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    decoded['role'] ||
    decoded[ClaimTypes?.Role] ||
    null
  );
}

/**
 * Get user ID from JWT token
 * @param token JWT token string
 * @returns User ID string or null
 */
export function getUserIdFromToken(token: string): string | null {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return decoded['sub'] || decoded['userId'] || null;
}

/**
 * Check if JWT token is expired
 * @param token JWT token string
 * @returns boolean
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

// Simple constant for ClaimTypes
const ClaimTypes = {
  Role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
};
