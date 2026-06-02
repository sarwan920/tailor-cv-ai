<template>
  <div class="flex min-h-screen w-screen overflow-x-hidden flex-col lg:flex-row bg-neutral">
    <!-- Fixed Left Sidebar Navigation (Hidden during print) -->
    <aside class="w-full lg:w-[280px] bg-surface border-b lg:border-b-0 lg:border-r border-secondary/25 flex flex-col lg:h-screen lg:fixed left-0 top-0 z-50 p-4 lg:py-8 lg:px-4 justify-between no-print">
      <div class="flex flex-col flex-1">
        <!-- Back link to Landing Page -->
        <NuxtLink to="/" class="flex items-center gap-2 mb-6 lg:mb-8 px-2">
          <span class="text-[1.8rem] text-tertiary material-icons">grain</span>
          <span class="font-sans font-medium text-[1.15rem] tracking-[0.08em] uppercase text-primary">
            Vellum <span class="text-tertiary font-bold">AI</span>
          </span>
        </NuxtLink>
        
        <nav class="flex flex-col gap-1.5 flex-1">
          <!-- exact prop makes sure active class only matches exactly for "/resume" -->
          <NuxtLink to="/resume" class="flex items-center gap-3 py-2.5 px-3 lg:py-3 lg:px-4 font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary rounded border border-transparent transition-all duration-150 cursor-pointer hover:text-primary hover:bg-primary/5 [&.active]:text-primary [&.active]:bg-neutral [&.active]:border-secondary [&.active_span]:text-tertiary" active-class="active" exact-active-class="active">
            <span class="material-icons text-[18px] text-secondary transition-colors duration-150">folder_open</span>
            Master Resume
          </NuxtLink>
          <NuxtLink to="/tailor" class="flex items-center gap-3 py-2.5 px-3 lg:py-3 lg:px-4 font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary rounded border border-transparent transition-all duration-150 cursor-pointer hover:text-primary hover:bg-primary/5 [&.active]:text-primary [&.active]:bg-neutral [&.active]:border-secondary [&.active_span]:text-tertiary" active-class="active">
            <span class="material-icons text-[18px] text-secondary transition-colors duration-150">auto_awesome</span>
            Tailor a Job
          </NuxtLink>
          <NuxtLink to="/studio" class="flex items-center gap-3 py-2.5 px-3 lg:py-3 lg:px-4 font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary rounded border border-transparent transition-all duration-150 cursor-pointer hover:text-primary hover:bg-primary/5 [&.active]:text-primary [&.active]:bg-neutral [&.active]:border-secondary [&.active_span]:text-tertiary" active-class="active">
            <span class="material-icons text-[18px] text-secondary transition-colors duration-150">analytics</span>
            Tailoring Studio
          </NuxtLink>
          <NuxtLink to="/history" class="flex items-center gap-3 py-2.5 px-3 lg:py-3 lg:px-4 font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary rounded border border-transparent transition-all duration-150 cursor-pointer hover:text-primary hover:bg-primary/5 [&.active]:text-primary [&.active]:bg-neutral [&.active]:border-secondary [&.active_span]:text-tertiary" active-class="active">
            <span class="material-icons text-[18px] text-secondary transition-colors duration-150">history</span>
            Adaptation Logs
          </NuxtLink>
        </nav>
      </div>

      <div class="border-t border-secondary/25 pt-4 mt-4">
        <div v-if="auth.user.value" class="flex items-center gap-2 mb-4 px-2">
          <span class="material-icons text-[20px] text-secondary">account_circle</span>
          <span class="font-sans text-[0.68rem] text-secondary font-medium uppercase tracking-[0.08em] whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{{ auth.user.value.email }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <BaseButton @click="showApiSettings = true" variant="secondary" class="w-full flex-btn">
            <span class="material-icons">vpn_key</span>
            {{ hasApiKey ? 'Key Set' : 'Configure Key' }}
          </BaseButton>
          <BaseButton @click="auth.logout" variant="danger" class="w-full flex-btn">
            <span class="material-icons">logout</span>
            Sign Out
          </BaseButton>
        </div>
      </div>
    </aside>

    <!-- Scrollable Right Content Area -->
    <main class="w-full lg:ml-[280px] flex-1 min-h-screen overflow-y-auto p-4 lg:p-8 bg-neutral print:m-0 print:p-0">
      <slot />
    </main>

    <!-- API Key Settings Modal -->
    <div v-if="showApiSettings" class="fixed inset-0 bg-primary/40 flex items-center justify-center p-5 z-[1000] no-print" @click.self="showApiSettings = false">
      <div class="bg-surface border border-secondary rounded-lg max-w-[500px] w-full p-8 shadow-none">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-sans font-medium text-[1.2rem] text-primary flex items-center gap-2">
            <span class="material-icons text-secondary">vpn_key</span>
            Gemini API Configuration
          </h3>
          <button @click="showApiSettings = false" class="bg-none border-none text-secondary hover:text-primary text-[1.5rem] cursor-pointer flex items-center">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="mb-8">
          <p class="text-[0.88rem] text-secondary mb-4 leading-[1.6]">
            To tailor your CV using Gemini, paste your Gemini API Key below.
            It is stored locally in your browser's <code>localStorage</code> and never uploaded anywhere else.
          </p>
          <div class="mb-8">
            <label class="block font-sans font-normal text-[0.72rem] uppercase tracking-[0.24em] mb-2 text-secondary">Gemini API Key</label>
            <input 
              v-model="apiKeyInput" 
              type="password" 
              class="w-full bg-surface border border-secondary/25 text-primary font-sans text-[0.98rem] p-3 rounded-md outline-none focus:border-primary transition-colors duration-250 placeholder:text-secondary/60" 
              placeholder="AIzaSy..." 
            />
          </div>
          <p v-if="!apiKeyInput" class="text-[0.82rem] text-danger mt-2.5 flex items-center gap-1">
            <span class="material-icons text-[14px]">info</span>
            You can also configure the <code>GEMINI_API_KEY</code> on your server `.env` file.
          </p>
        </div>
        <div class="flex justify-end gap-3">
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

