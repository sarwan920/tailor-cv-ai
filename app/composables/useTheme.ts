/**
 * Thin wrapper around @nuxtjs/color-mode's useColorMode().
 * Provides a backward-compatible API so existing components
 * can keep using `isDark` and `toggleTheme()`.
 */
export function useTheme() {
  const colorMode = useColorMode();

  const isDark = computed(() => colorMode.value === 'dark');

  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  };

  // Kept for backward compatibility — now a no-op since the module handles init.
  const initTheme = () => {};

  return {
    isDark,
    toggleTheme,
    initTheme
  };
}
