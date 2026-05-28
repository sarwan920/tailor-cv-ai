import { prisma } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Profile ID is required',
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
