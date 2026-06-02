<template>
  <div class="app-layout">
    <!-- Fixed Left Sidebar Navigation (Hidden during print) -->
    <aside class="sidebar-nav no-print">
      <div class="sidebar-top-section">
        <!-- Back link to Landing Page -->
        <NuxtLink to="/" class="sidebar-branding">
          <span class="sidebar-logo-icon material-icons">grain</span>
          <span class="sidebar-logo-text">Vellum <span class="accent-text">AI</span></span>
        </NuxtLink>
        
        <nav class="sidebar-menu">
          <!-- exact prop makes sure active class only matches exactly for "/resume" -->
          <NuxtLink to="/resume" class="sidebar-item" active-class="active" exact-active-class="active">
            <span class="material-icons">folder_open</span>
            Master Resume
          </NuxtLink>
          <NuxtLink to="/tailor" class="sidebar-item" active-class="active">
            <span class="material-icons">auto_awesome</span>
            Tailor a Job
          </NuxtLink>
          <NuxtLink to="/studio" class="sidebar-item" active-class="active">
            <span class="material-icons">analytics</span>
            Tailoring Studio
          </NuxtLink>
          <NuxtLink to="/history" class="sidebar-item" active-class="active">
            <span class="material-icons">history</span>
            Adaptation Logs
          </NuxtLink>
        </nav>
      </div>

      <div class="sidebar-footer">
        <div v-if="auth.user.value" class="sidebar-user-info">
          <span class="material-icons user-icon">account_circle</span>
          <span class="sidebar-user-email">{{ auth.user.value.email }}</span>
        </div>
        <div class="sidebar-footer-buttons">
          <BaseButton @click="showApiSettings = true" variant="secondary" class="api-btn w-100 flex-btn">
            <span class="material-icons">vpn_key</span>
            {{ hasApiKey ? 'Key Set' : 'Configure Key' }}
          </BaseButton>
          <BaseButton @click="auth.logout" variant="danger" class="w-100 flex-btn mt-8">
            <span class="material-icons">logout</span>
            Sign Out
          </BaseButton>
        </div>
      </div>
    </aside>

    <!-- Scrollable Right Content Area -->
    <main class="main-content">
      <slot />
    </main>

    <!-- API Key Settings Modal -->
    <div v-if="showApiSettings" class="modal-overlay no-print" @click.self="showApiSettings = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <span class="material-icons text-stone mr-8">vpn_key</span>
            Gemini API Configuration
          </h3>
          <button @click="showApiSettings = false" class="close-btn">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="settings-desc">
            To tailor your CV using Gemini, paste your Gemini API Key below.
            It is stored locally in your browser's <code>localStorage</code> and never uploaded anywhere else.
          </p>
          <div class="form-group">
            <label class="form-label">Gemini API Key</label>
            <input 
              v-model="apiKeyInput" 
              type="password" 
              class="form-input" 
              placeholder="AIzaSy..." 
            />
          </div>
          <p v-if="!apiKeyInput" class="warning-text">
            <span class="material-icons mr-4" style="font-size: 14px;">info</span>
            You can also configure the <code>GEMINI_API_KEY</code> on your server `.env` file.
          </p>
        </div>
        <div class="modal-footer">
          <BaseButton @click="showApiSettings = false" variant="secondary">Cancel</BaseButton>
          <BaseButton @click="saveApiKey" variant="primary">Save Key</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/main.css';
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';

const auth = useAuth();
const showApiSettings = ref(false);
const apiKeyInput = ref('');
const hasApiKey = ref(false);

onMounted(() => {
  const storedKey = localStorage.getItem('gemini_api_key') || '';
  apiKeyInput.value = storedKey;
  hasApiKey.value = !!storedKey;
});

function saveApiKey() {
  localStorage.setItem('gemini_api_key', apiKeyInput.value);
  hasApiKey.value = !!apiKeyInput.value;
  showApiSettings.value = false;
}
</script>

<style scoped>
.w-100 {
  width: 100%;
}

.mr-4 { margin-right: 4px; }
.mr-8 { margin-right: 8px; }
.text-stone { color: var(--colors-secondary); }

/* Sidebar extra styling */
.sidebar-top-section {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Print Overrides */
@media print {
  .main-content {
    margin-left: 0 !important;
    padding: 0 !important;
  }
}

.sidebar-user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--spacing-md);
  padding: 0 var(--spacing-sm);
}

.user-icon {
  font-size: 20px;
  color: var(--colors-secondary);
}

.sidebar-user-email {
  font-size: 0.68rem;
  color: var(--colors-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mt-8 {
  margin-top: 8px;
}
</style>
