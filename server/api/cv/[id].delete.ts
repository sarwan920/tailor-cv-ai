import { prisma } from '../../utils/db';
import { requireSessionUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const user = await requireSessionUser(event);
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Profile ID is required',
      });
    }

    // Verify ownership
    const profile = await prisma.cvProfile.findUnique({
      where: { id }
    });

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'CV profile not found',
      });
    }

    if (profile.userId !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden. You do not own this CV profile.',
      });
    }

    await prisma.cvProfile.delete({
      where: { id },
    });
    return { success: true, message: 'Profile deleted successfully' };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to delete CV profile',
    });
  }
});
