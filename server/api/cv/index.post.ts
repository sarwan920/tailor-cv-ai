import { prisma } from '../../utils/db';
import { requireSessionUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const user = await requireSessionUser(event);
    const body = await readBody(event);
    const { title, content } = body;

    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required',
      });
    }

    const newProfile = await prisma.cvProfile.create({
      data: {
        title,
        content,
        userId: user.id,
      },
    });
    return newProfile;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create CV profile',
    });
  }
});
