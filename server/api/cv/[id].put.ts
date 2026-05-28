import { prisma } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const { title, content } = body;

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Profile ID is required',
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
