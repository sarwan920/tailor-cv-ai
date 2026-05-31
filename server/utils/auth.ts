import crypto from 'crypto';
import { H3Event } from 'h3';
import { prisma } from './db';

/**
 * Hashes password using PBKDF2 with SHA-512 and a random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies password against stored PBKDF2 salt and hash
 */
export function verifyPassword(password: string, storedValue: string): boolean {
  if (!storedValue || !storedValue.includes(':')) return false;
  const [salt, originalHash] = storedValue.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

/**
 * Retrieves the current logged-in user from the event cookie session
 */
export async function getSessionUser(event: H3Event) {
  const token = getCookie(event, 'session_token');
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!session) return null;

    // Check expiration
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } });
      deleteCookie(event, 'session_token');
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Session user lookup error:', error);
    return null;
  }
}

/**
 * Reusable server-side route guard. Throws a 401 if unauthorized.
 */
export async function requireSessionUser(event: H3Event) {
  const user = await getSessionUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please log in.',
    });
  }
  return user;
}
