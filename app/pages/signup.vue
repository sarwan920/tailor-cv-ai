<template>
  <div class="min-h-screen w-full flex items-center justify-center p-5 md:p-10 bg-neutral relative dot-matrix-bg">
    <!-- SVG Noise filter for film grain realism -->
    <svg style="display: none;">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.035 0" />
      </filter>
    </svg>
    <div class="noise-overlay" style="filter: url(#noiseFilter);"></div>

    <div class="w-full max-w-[440px] z-10">
      <div class="p-8 bg-surface border border-secondary rounded-lg shadow-[0_12px_40px_rgba(27,25,23,0.05)]">
        <div class="inline-flex items-center gap-2 py-1.5 px-3 rounded-full border border-secondary/25 bg-neutral font-sans text-[0.65rem] font-medium tracking-[0.15em] text-secondary mb-6">
          <span class="w-1.5 h-1.5 bg-tertiary rounded-full"></span>
          SECURE REGISTER
        </div>

        <h1 class="font-serif text-[2.2rem] font-normal text-primary mb-2 tracking-tight">Create Account</h1>
        <p class="text-[0.88rem] text-secondary leading-normal mb-8">Initialize your workspace and start tailoring your professional narrative with Gemini AI.</p>

        <form @submit.prevent="handleSignup" class="mb-6">
          <div v-if="errorMessage" class="flex items-center gap-2.5 bg-danger/8 border border-danger rounded-md p-3.5 mb-8">
            <span class="material-icons text-danger text-[18px]">error_outline</span>
            <span class="text-[0.8rem] text-danger font-medium">{{ errorMessage }}</span>
          </div>

          <div class="mb-8">
            <label class="block font-sans text-[0.72rem] font-normal uppercase tracking-[0.24em] mb-2 text-secondary" for="email">Email Address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="w-full bg-surface border border-secondary/25 text-primary font-sans text-[0.98rem] p-3 rounded-md outline-none focus:border-primary transition-colors duration-250 placeholder:text-secondary/60"
              placeholder="name@company.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="mb-8">
            <label class="block font-sans text-[0.72rem] font-normal uppercase tracking-[0.24em] mb-2 text-secondary" for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full bg-surface border border-secondary/25 text-primary font-sans text-[0.98rem] p-3 rounded-md outline-none focus:border-primary transition-colors duration-250 placeholder:text-secondary/60"
              placeholder="••••••••"
              required
              autocomplete="new-password"
            />
          </div>

          <div class="mb-8">
            <label class="block font-sans text-[0.72rem] font-normal uppercase tracking-[0.24em] mb-2 text-secondary" for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="w-full bg-surface border border-secondary/25 text-primary font-sans text-[0.98rem] p-3 rounded-md outline-none focus:border-primary transition-colors duration-250 placeholder:text-secondary/60"
              placeholder="••••••••"
              required
              autocomplete="new-password"
            />
          </div>

          <BaseButton type="submit" variant="primary" size="lg" :loading="loading" class="w-full mt-4">
            Create Account & Workspace
          </BaseButton>
        </form>

        <div class="text-center border-t border-secondary/25 pt-5 mt-8 text-[0.82rem] text-secondary">
          <p>Already have an account? <NuxtLink to="/login" class="font-medium text-tertiary hover:text-primary transition-colors duration-150 underline underline-offset-[3px]">Sign In</NuxtLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

const auth = useAuth();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const loading = ref(false);

async function handleSignup() {
  errorMessage.value = '';

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long.';
    return;
  }

  loading.value = true;

  const result = await auth.signup(email.value, password.value);
  loading.value = false;

  if (result.success) {
    navigateTo('/resume');
  } else {
    errorMessage.value = result.message;
  }
}
</script>

