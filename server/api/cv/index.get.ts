import { prisma } from '../../utils/db';
import { requireSessionUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const user = await requireSessionUser(event);
    const profiles = await prisma.cvProfile.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    });
    return profiles;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch CV profiles',
    });
  }
});
