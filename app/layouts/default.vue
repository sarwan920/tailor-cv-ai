<template>
  <div class="min-h-screen flex flex-col bg-neutral text-primary w-full">
    <!-- Clean, Sleek Top Header Navigation -->
    <header class="h-20 border-b border-secondary/25 bg-surface sticky top-0 z-50 flex items-center no-print">
      <div class="w-full max-w-[1200px] mx-auto px-8 flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-[1.8rem] text-tertiary material-icons">grain</span>
          <span class="font-sans font-medium text-[1.15rem] tracking-[0.08em] uppercase text-primary">
            Vellum <span class="text-tertiary font-bold">AI</span>
          </span>
        </NuxtLink>

        <!-- Public Nav Links -->
        <nav class="hidden md:flex gap-8">
          <a href="#features" class="font-sans text-[0.72rem] font-medium uppercase tracking-[0.18em] text-secondary relative py-1 hover:text-primary transition-colors duration-150 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-primary after:transition-all after:duration-150 hover:after:w-full">Features</a>
          <a href="#workflow" class="font-sans text-[0.72rem] font-medium uppercase tracking-[0.18em] text-secondary relative py-1 hover:text-primary transition-colors duration-150 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-primary after:transition-all after:duration-150 hover:after:w-full">How It Works</a>
          <a href="#pricing" class="font-sans text-[0.72rem] font-medium uppercase tracking-[0.18em] text-secondary relative py-1 hover:text-primary transition-colors duration-150 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-primary after:transition-all after:duration-150 hover:after:w-full">Pricing</a>
        </nav>

        <!-- Primary CTA & Theme Toggle -->
        <div class="flex items-center gap-4">
          <button 
            @click="toggleTheme" 
            class="w-9 h-9 flex items-center justify-center rounded-full border border-secondary/25 hover:border-primary text-secondary hover:text-primary transition-all duration-150 cursor-pointer shrink-0"
            aria-label="Toggle theme"
          >
            <span class="material-icons text-[18px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>

          <div class="header-cta hidden md:block">
            <template v-if="auth.user.value">
              <div class="flex items-center gap-3">
                <span class="font-sans text-[0.72rem] font-medium uppercase tracking-[0.08em] text-secondary hidden md:inline">{{ auth.user.value.email }}</span>
                <BaseButton to="/resume" variant="primary" size="sm" class="flex-btn">
                  Workspace
                  <span class="material-icons" style="font-size: 14px;">arrow_forward</span>
                </BaseButton>
                <BaseButton @click="auth.logout" variant="secondary" size="sm" class="flex-btn">
                  Sign Out
                </BaseButton>
              </div>
            </template>
            <template v-else>
              <BaseButton to="/login" variant="primary" size="sm" class="flex-btn">
                Sign In
                <span class="material-icons" style="font-size: 14px;">login</span>
              </BaseButton>
            </template>
          </div>

          <!-- Hamburger Button (Mobile Only) -->
          <button 
            @click="menuOpen = !menuOpen" 
            class="w-9 h-9 flex md:hidden items-center justify-center rounded border border-secondary/25 hover:border-primary text-secondary hover:text-primary transition-all duration-150 cursor-pointer shrink-0"
            aria-label="Toggle menu"
          >
            <span class="material-icons text-[20px]">{{ menuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full">
      <slot />
    </main>

    <!-- Mobile Menu Drawer (Overlay Backdrop) -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="menuOpen" 
        class="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-sm md:hidden"
        @click="menuOpen = false"
      ></div>
    </transition>

    <!-- Mobile Menu Drawer (Content Slider) -->
    <transition
      enter-active-class="transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-250 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="menuOpen" 
        class="fixed top-0 right-0 bottom-0 z-[101] w-[280px] max-w-[85vw] bg-surface border-l border-secondary/25 p-6 flex flex-col justify-between shadow-lg md:hidden"
      >
        <div class="flex flex-col gap-8">
          <!-- Drawer Header -->
          <div class="flex justify-between items-center">
            <span class="font-sans font-medium text-[0.9rem] tracking-[0.12em] uppercase text-secondary">Navigation</span>
            <button 
              @click="menuOpen = false" 
              class="w-8 h-8 flex items-center justify-center rounded-full border border-secondary/25 hover:border-primary text-secondary hover:text-primary transition-all duration-150 cursor-pointer"
            >
              <span class="material-icons text-[18px]">close</span>
            </button>
          </div>

          <!-- Drawer Navigation Links -->
          <nav class="flex flex-col gap-6">
            <a 
              href="#features" 
              @click="menuOpen = false" 
              class="font-sans text-[0.85rem] font-medium uppercase tracking-[0.18em] text-primary hover:text-secondary transition-colors"
            >
              Features
            </a>
            <a 
              href="#workflow" 
              @click="menuOpen = false" 
              class="font-sans text-[0.85rem] font-medium uppercase tracking-[0.18em] text-primary hover:text-secondary transition-colors"
            >
              How It Works
            </a>
            <a 
              href="#pricing" 
              @click="menuOpen = false" 
              class="font-sans text-[0.85rem] font-medium uppercase tracking-[0.18em] text-primary hover:text-secondary transition-colors"
            >
              Pricing
            </a>
          </nav>
        </div>

        <!-- Drawer CTA Section (Bottom) -->
        <div class="border-t border-secondary/25 pt-6 flex flex-col gap-4">
          <template v-if="auth.user.value">
            <div class="flex flex-col gap-3">
              <span class="font-sans text-[0.68rem] text-secondary font-medium uppercase tracking-[0.08em] break-all">{{ auth.user.value.email }}</span>
              <BaseButton to="/resume" variant="primary" size="md" liquid @click="menuOpen = false" class="w-full">
                Workspace &rarr;
              </BaseButton>
              <BaseButton @click="() => { auth.logout(); menuOpen = false; }" variant="secondary" size="md" liquid class="w-full">
                Sign Out
              </BaseButton>
            </div>
          </template>
          <template v-else>
            <BaseButton to="/login" variant="primary" size="md" liquid @click="menuOpen = false" class="w-full">
              Sign In
            </BaseButton>
          </template>
        </div>
      </div>
    </transition>

    <!-- Sleek Minimal Footer -->
    <footer class="bg-surface border-t border-secondary/25 py-8 no-print">
      <div class="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center font-sans text-[0.72rem] text-secondary tracking-[0.08em] uppercase gap-4">
        <div class="flex items-center">
          <span class="material-icons text-secondary mr-2">grain</span>
          <span>Vellum AI &copy; 2026</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-success rounded-full inline-block shadow-[0_0_8px_var(--color-success)]"></span>
          <span>All AI Systems Operational</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';

const auth = useAuth();
const { isDark, toggleTheme } = useTheme();
const menuOpen = ref(false);
</script>

