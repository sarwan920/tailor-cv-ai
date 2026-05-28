import { prisma } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const profiles = await prisma.cvProfile.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return profiles;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch CV profiles',
    });
  }
});
