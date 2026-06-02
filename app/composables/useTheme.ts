import { ref } from 'vue';

const isDark = ref(false);

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (process.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
      updateThemeClass();
    }
  };

  const updateThemeClass = () => {
    if (process.client) {
      const root = document.documentElement;
      if (isDark.value) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        isDark.value = savedTheme === 'dark';
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDark.value = prefersDark;
      }
      updateThemeClass();
    }
  };

  return {
    isDark,
    toggleTheme,
    initTheme
  };
}
