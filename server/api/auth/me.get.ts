import { getSessionUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event);
  if (!user) {
    // Return empty/null gracefully rather than throwing 401 to keep browser console clean for guests
    return null;
  }
  return user;
});
