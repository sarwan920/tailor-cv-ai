import { prisma } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const history = await prisma.tailoredCv.findMany({
      include: {
        profile: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return history;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch tailored CV history',
    });
  }
});
