import { defineNuxtRouteMiddleware, navigateTo, useState } from '#imports';
import { useAuth } from '../composables/useAuth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth();
  
  // Only check session on the very first load or on SSR
  const hasChecked = useState('auth_checked', () => false);
  if (!hasChecked.value) {
    await auth.fetchUser();
    hasChecked.value = true;
  }

  const protectedRoutes = ['/resume', '/tailor', '/studio', '/history'];
  const isProtected = protectedRoutes.some(route => to.path.startsWith(route));

  // Redirect to login if trying to access protected route while unauthenticated
  if (isProtected && !auth.user.value) {
    return navigateTo('/login');
  }

  // Redirect to dashboard (resume) if already authenticated and trying to visit login/signup
  if ((to.path === '/login' || to.path === '/signup') && auth.user.value) {
    return navigateTo('/resume');
  }
});
