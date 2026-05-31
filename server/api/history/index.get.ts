import { prisma } from '../../utils/db';
import { requireSessionUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const user = await requireSessionUser(event);
    const history = await prisma.tailoredCv.findMany({
      where: {
        profile: {
          userId: user.id
        }
      },
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
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch tailored CV history',
    });
  }
});
