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

        <!-- Primary CTA: Single Load-Bearing Tertiary Accent Button -->
        <div class="header-cta">
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
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full">
      <slot />
    </main>

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
import { useAuth } from '@/composables/useAuth';
const auth = useAuth();
</script>

