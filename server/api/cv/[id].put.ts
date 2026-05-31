import { prisma } from '../../utils/db';
import { requireSessionUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const user = await requireSessionUser(event);
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const { title, content } = body;

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

    const updatedProfile = await prisma.cvProfile.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
    return updatedProfile;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update CV profile',
    });
  }
});
