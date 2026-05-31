<template>
  <div class="auth-page dot-matrix-bg fade-in">
    <!-- SVG Noise filter for film grain realism -->
    <svg style="display: none;">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.035 0" />
      </filter>
    </svg>
    <div class="noise-overlay" style="filter: url(#noiseFilter);"></div>

    <div class="auth-container">
      <div class="auth-card glass-panel">
        <div class="auth-badge">
          <span class="badge-dot"></span>
          SECURE REGISTER
        </div>

        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Initialize your workspace and start tailoring your professional narrative with Gemini AI.</p>

        <form @submit.prevent="handleSignup" class="auth-form">
          <div v-if="errorMessage" class="error-banner">
            <span class="material-icons error-icon">error_outline</span>
            <span class="error-text">{{ errorMessage }}</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="name@company.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
              autocomplete="new-password"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
              autocomplete="new-password"
            />
          </div>

          <BaseButton type="submit" variant="primary" size="lg" :loading="loading" class="w-100 mt-16">
            Create Account & Workspace
          </BaseButton>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <NuxtLink to="/login" class="auth-link">Sign In</NuxtLink></p>
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

<style scoped>
.auth-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: var(--colors-neutral);
  position: relative;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  z-index: 10;
}

.auth-card {
  padding: var(--spacing-lg) !important;
  background-color: var(--colors-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 40px rgba(27, 25, 23, 0.05);
}

.auth-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 100px;
  border: 1px solid var(--border-light);
  background-color: var(--colors-neutral);
  font-family: var(--font-family);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--colors-secondary);
  margin-bottom: 24px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background-color: var(--colors-tertiary);
  border-radius: 50%;
}

.auth-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 400;
  color: var(--colors-primary);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.auth-subtitle {
  font-size: 0.88rem;
  color: var(--colors-secondary);
  line-height: 1.6;
  margin-bottom: 32px;
}

.auth-form {
  margin-bottom: 24px;
}

.w-100 {
  width: 100%;
}

.mt-16 {
  margin-top: 16px;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(150, 75, 67, 0.08);
  border: 1px solid var(--danger);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  margin-bottom: var(--spacing-lg);
}

.error-icon {
  color: var(--danger);
  font-size: 18px;
}

.error-text {
  font-size: 0.8rem;
  color: var(--danger);
  font-weight: 500;
}

.auth-footer {
  text-align: center;
  border-top: 1px solid var(--border-light);
  padding-top: 20px;
  margin-top: var(--spacing-lg);
  font-size: 0.82rem;
  color: var(--colors-secondary);
}

.auth-link {
  font-weight: 500;
  color: var(--colors-tertiary);
  transition: color var(--transition-fast);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.auth-link:hover {
  color: var(--colors-primary);
}
</style>
