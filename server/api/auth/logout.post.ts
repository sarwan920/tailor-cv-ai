import { prisma } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'session_token');

  if (token) {
    try {
      // Delete the session record
      await prisma.session.deleteMany({
        where: { token }
      });
    } catch (error) {
      console.error('Logout session delete error:', error);
    }
  }

  // Clear cookie
  deleteCookie(event, 'session_token');

  return { success: true, message: 'Logged out successfully' };
});
