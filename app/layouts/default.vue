<template>
  <div class="marketing-layout">
    <!-- Clean, Sleek Top Header Navigation -->
    <header class="marketing-header no-print">
      <div class="header-container">
        <NuxtLink to="/" class="branding-logo">
          <span class="logo-icon material-icons">grain</span>
          <span class="logo-text">Vellum <span class="accent-text">AI</span></span>
        </NuxtLink>

        <!-- Public Nav Links -->
        <nav class="marketing-nav">
          <a href="#features" class="nav-link">Features</a>
          <a href="#workflow" class="nav-link">How It Works</a>
          <a href="#pricing" class="nav-link">Pricing</a>
        </nav>

        <!-- Primary CTA: Single Load-Bearing Tertiary Accent Button -->
        <div class="header-cta">
          <template v-if="auth.user.value">
            <div class="user-nav-group">
              <span class="user-email no-mobile">{{ auth.user.value.email }}</span>
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
    <main class="marketing-body">
      <slot />
    </main>

    <!-- Sleek Minimal Footer -->
    <footer class="marketing-footer no-print">
      <div class="footer-container">
        <div class="footer-brand">
          <span class="material-icons text-stone mr-4">grain</span>
          <span class="footer-brand-text">Vellum AI &copy; 2026</span>
        </div>
        <div class="footer-status">
          <span class="status-indicator"></span>
          <span class="status-text">All AI Systems Operational</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';
const auth = useAuth();
</script>

<style scoped>
.marketing-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--colors-neutral);
  color: var(--colors-primary);
  width: 100%;
}

.marketing-header {
  height: 80px;
  border-bottom: 1px solid var(--border-light);
  background-color: var(--colors-surface);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
}

.header-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.branding-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-icon {
  font-size: 1.8rem;
  color: var(--colors-tertiary);
}

.logo-text {
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 1.15rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--colors-primary);
}

.logo-text .accent-text {
  color: var(--colors-tertiary);
  font-weight: 700;
}

.marketing-nav {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  font-family: var(--font-family);
  font-size: 0.72rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--colors-secondary);
  position: relative;
  padding: 4px 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--colors-primary);
  transition: width var(--transition-fast);
}

.nav-link:hover {
  color: var(--colors-primary);
}

.nav-link:hover::after {
  width: 100%;
}

.marketing-body {
  flex: 1;
  width: 100%;
}

.marketing-footer {
  background-color: var(--colors-surface);
  border-top: 1px solid var(--border-light);
  padding: var(--spacing-lg) 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-family);
  font-size: 0.72rem;
  color: var(--colors-secondary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.footer-brand {
  display: flex;
  align-items: center;
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-indicator {
  width: 6px;
  height: 6px;
  background-color: var(--success);
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px var(--success);
}

.text-stone { color: var(--colors-secondary); }
.mr-4 { margin-right: 4px; }

@media (max-width: 768px) {
  .marketing-nav {
    display: none; /* Hide standard links on mobile to keep layout clean */
  }
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
}

.user-nav-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-email {
  font-family: var(--font-family);
  font-size: 0.72rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--colors-secondary);
}

@media (max-width: 768px) {
  .no-mobile {
    display: none !important;
  }
}
</style>
