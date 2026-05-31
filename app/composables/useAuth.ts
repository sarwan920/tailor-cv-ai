import { useState, computed } from '#imports';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export const useAuth = () => {
  const user = useState<User | null>('auth_user', () => null);
  const loading = useState<boolean>('auth_loading', () => false);

  const fetchUser = async () => {
    try {
      loading.value = true;
      const data = await $fetch<User | null>('/api/auth/me');
      user.value = data;
    } catch (e) {
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      const data = await $fetch<User>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      user.value = data;
      return { success: true };
    } catch (e: any) {
      return { 
        success: false, 
        message: e.response?._data?.statusMessage || 'Failed to login. Please check your credentials.' 
      };
    } finally {
      loading.value = false;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      loading.value = true;
      const data = await $fetch<User>('/api/auth/signup', {
        method: 'POST',
        body: { email, password }
      });
      user.value = data;
      return { success: true };
    } catch (e: any) {
      return { 
        success: false, 
        message: e.response?._data?.statusMessage || 'Failed to register account.' 
      };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      loading.value = true;
      await $fetch('/api/auth/logout', { method: 'POST' });
      user.value = null;
      navigateTo('/');
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    fetchUser,
    login,
    signup,
    logout,
    isAuthenticated: computed(() => !!user.value)
  };
};
