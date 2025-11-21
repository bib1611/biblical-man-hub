import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Server-side admin password (NOT exposed to client)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || 'default_secure_hash_change_this';

// Simple session token validation
const VALID_SESSIONS = new Map<string, { createdAt: number; isAdmin: boolean }>();
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Clean up expired sessions on-demand (can't use setInterval in serverless)
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of VALID_SESSIONS.entries()) {
    if (now - session.createdAt > SESSION_DURATION) {
      VALID_SESSIONS.delete(token);
    }
  }
}

export function verifyPassword(password: string): boolean {
  // Simple comparison for now - in production, use bcrypt
  const adminPass = process.env.ADMIN_PASSWORD;
  console.log('Password check:', {
    provided: password,
    expected: adminPass,
    match: password === adminPass,
    envVarExists: !!adminPass
  });
  return password === adminPass;
}

export function createSession(): string {
  const token = generateSecureToken();
  VALID_SESSIONS.set(token, {
    createdAt: Date.now(),
    isAdmin: true,
  });
  return token;
}

export function validateSession(token: string): boolean {
  cleanupExpiredSessions(); // Clean up on each validation
  const session = VALID_SESSIONS.get(token);
  if (!session) return false;

  // Check if expired
  if (Date.now() - session.createdAt > SESSION_DURATION) {
    VALID_SESSIONS.delete(token);
    return false;
  }

  return session.isAdmin;
}

export function deleteSession(token: string): void {
  VALID_SESSIONS.delete(token);
}

function generateSecureToken(): string {
  // Generate cryptographically secure random token
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Middleware function to verify admin access on server-side
export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    const cookieStore = await cookies();

    // Check for admin session cookie (password-based login)
    const adminSessionToken = cookieStore.get('admin_session')?.value;
    if (adminSessionToken && validateSession(adminSessionToken)) {
      return true;
    }

    // Check for creator session (automatic creator authentication)
    const sessionToken = cookieStore.get('session_token')?.value;
    if (sessionToken) {
      // Import here to avoid circular dependency
      const { getSessionByToken } = await import('@/lib/session');
      const session = await getSessionByToken(sessionToken);

      if (session) {
        const { getUserById } = await import('@/lib/session');
        const user = await getUserById(session.userId);

        // Allow access if user is creator
        if (user && user.isCreator) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

// Helper to get IP with better header support
export function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  return 'unknown';
}

// Simple rate limiting (in-memory)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired rate limit entries on-demand (can't use setInterval in serverless)
function cleanupExpiredRateLimits() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

export function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  cleanupExpiredRateLimits(); // Clean up on each check
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}
