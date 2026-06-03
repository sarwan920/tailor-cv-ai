import { prisma } from '../../utils/db';
import { requireSessionUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const user = await requireSessionUser(event);
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tailored CV ID is required',
      });
    }

    // Verify ownership via CVProfile's userId
    const tailoredCv = await prisma.tailoredCv.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!tailoredCv) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tailored CV not found',
      });
    }

    if (tailoredCv.profile.userId !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden. You do not own this tailored CV.',
      });
    }

    await prisma.tailoredCv.delete({
      where: { id },
    });
    return { success: true, message: 'Tailored CV deleted successfully' };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to delete tailored CV',
    });
  }
});
