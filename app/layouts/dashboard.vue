<template>
  <div class="flex min-h-screen w-screen overflow-x-hidden flex-col lg:flex-row bg-neutral">
    <!-- Mobile Sticky Header -->
    <header class="h-16 sticky top-0 bg-surface border-b border-hairline flex items-center justify-between px-4 z-40 lg:hidden no-print">
      <NuxtLink to="/" class="flex items-center gap-1.5">
        <span class="text-[1.3rem] text-brand-green material-icons">grain</span>
        <span class="font-sans font-bold text-[1.02rem] tracking-tight uppercase text-primary">
          Vellum<span class="text-brand-green">.</span>
        </span>
      </NuxtLink>

      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <button 
          @click="toggleTheme" 
          class="w-8 h-8 flex items-center justify-center rounded-full border border-hairline hover:border-primary text-secondary hover:text-primary transition-all duration-150 cursor-pointer shrink-0"
          aria-label="Toggle theme"
        >
          <span class="material-icons text-[15px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
        </button>

        <!-- Hamburger Menu Button -->
        <button 
          @click="menuOpen = !menuOpen" 
          class="w-8 h-8 flex items-center justify-center rounded-full border border-hairline hover:border-primary text-secondary hover:text-primary transition-all duration-150 cursor-pointer shrink-0"
          aria-label="Toggle menu"
        >
          <span class="material-icons text-[18px]">{{ menuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </header>

    <!-- Mobile Drawer Backdrop Overlay -->
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
        class="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-sm lg:hidden"
        @click="menuOpen = false"
      ></div>
    </transition>

    <!-- Fixed Left Sidebar Navigation (Hidden during print, Drawer on Mobile) -->
    <aside 
      class="fixed inset-y-0 left-0 z-[101] w-[280px] max-w-[85vw] bg-surface border-r border-hairline flex flex-col h-screen p-4 lg:py-8 lg:px-4 justify-between no-print transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-50 lg:w-[280px] lg:border-r"
      :class="menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="flex flex-col flex-1">
        <!-- Back link to Landing Page -->
        <NuxtLink to="/" @click="menuOpen = false" class="flex items-center gap-1.5 mb-6 lg:mb-8 px-2 select-none">
          <span class="text-[1.5rem] text-brand-green material-icons">grain</span>
          <span class="font-sans font-bold text-[1.1rem] tracking-tight uppercase text-primary">
            Vellum<span class="text-brand-green">.</span>
          </span>
        </NuxtLink>
        
        <nav class="flex flex-col gap-1 flex-1">
          <!-- exact prop makes sure active class only matches exactly for "/resume" -->
          <NuxtLink to="/resume" @click="menuOpen = false" class="flex items-center gap-3 py-2 px-3 lg:py-2.5 lg:px-4 font-sans font-medium text-[0.8rem] text-secondary rounded-md border border-transparent transition-all duration-150 cursor-pointer hover:text-primary hover:bg-surface/50 [&.active]:text-primary [&.active]:bg-neutral [&.active]:border-hairline [&.active_span]:text-brand-green" active-class="active" exact-active-class="active">
            <span class="material-icons text-[18px] text-secondary transition-colors duration-150">folder_open</span>
            Master Resume
          </NuxtLink>
          <NuxtLink to="/tailor" @click="menuOpen = false" class="flex items-center gap-3 py-2 px-3 lg:py-2.5 lg:px-4 font-sans font-medium text-[0.8rem] text-secondary rounded-md border border-transparent transition-all duration-150 cursor-pointer hover:text-primary hover:bg-surface/50 [&.active]:text-primary [&.active]:bg-neutral [&.active]:border-hairline [&.active_span]:text-brand-green" active-class="active">
            <span class="material-icons text-[18px] text-secondary transition-colors duration-150">auto_awesome</span>
            Tailor a Job
          </NuxtLink>
          <NuxtLink to="/studio" @click="menuOpen = false" class="flex items-center gap-3 py-2 px-3 lg:py-2.5 lg:px-4 font-sans font-medium text-[0.8rem] text-secondary rounded-md border border-transparent transition-all duration-150 cursor-pointer hover:text-primary hover:bg-surface/50 [&.active]:text-primary [&.active]:bg-neutral [&.active]:border-hairline [&.active_span]:text-brand-green" active-class="active">
            <span class="material-icons text-[18px] text-secondary transition-colors duration-150">analytics</span>
            Tailoring Studio
          </NuxtLink>
          <NuxtLink to="/history" @click="menuOpen = false" class="flex items-center gap-3 py-2 px-3 lg:py-2.5 lg:px-4 font-sans font-medium text-[0.8rem] text-secondary rounded-md border border-transparent transition-all duration-150 cursor-pointer hover:text-primary hover:bg-surface/50 [&.active]:text-primary [&.active]:bg-neutral [&.active]:border-hairline [&.active_span]:text-brand-green" active-class="active">
            <span class="material-icons text-[18px] text-secondary transition-colors duration-150">history</span>
            Adaptation Logs
          </NuxtLink>
        </nav>
      </div>

      <div class="border-t border-hairline pt-4 mt-4">
        <div class="flex items-center justify-between mb-4 px-2 gap-2">
          <div v-if="auth.user.value" class="flex items-center gap-2 overflow-hidden">
            <span class="material-icons text-[20px] text-secondary">account_circle</span>
            <span class="font-sans text-[0.68rem] text-secondary font-medium uppercase tracking-[0.08em] whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">{{ auth.user.value.email }}</span>
          </div>
          <button 
            @click="toggleTheme" 
            class="w-7 h-7 flex items-center justify-center rounded-full border border-hairline hover:border-primary text-secondary hover:text-primary transition-all duration-150 cursor-pointer shrink-0 ml-auto"
            aria-label="Toggle theme"
          >
            <span class="material-icons text-[15px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>
        </div>
        <div class="flex flex-col gap-2">
          <BaseButton @click="() => { showApiSettings = true; menuOpen = false; }" variant="secondary" class="w-full flex-btn">
            <span class="material-icons">vpn_key</span>
            {{ hasApiKey ? 'Key Set' : 'Configure Key' }}
          </BaseButton>
          <BaseButton @click="() => { auth.logout(); menuOpen = false; }" variant="danger" class="w-full flex-btn">
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
      <div class="bg-surface border border-hairline rounded-lg max-w-[500px] w-full p-8 shadow-none">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-sans font-medium text-[1.1rem] text-primary flex items-center gap-2">
            <span class="material-icons text-brand-green">vpn_key</span>
            Gemini API Configuration
          </h3>
          <button @click="showApiSettings = false" class="bg-none border-none text-secondary hover:text-primary text-[1.5rem] cursor-pointer flex items-center">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="mb-8">
          <p class="text-[0.82rem] text-secondary mb-4 leading-[1.6]">
            To tailor your CV using Gemini, paste your Gemini API Key below.
            It is stored locally in your browser's <code>localStorage</code> and never uploaded anywhere else.
          </p>
          <div class="mb-8">
            <label class="block font-sans font-medium text-[0.68rem] uppercase tracking-[0.2em] mb-2 text-secondary">Gemini API Key</label>
            <input 
              v-model="apiKeyInput" 
              type="password" 
              class="w-full bg-surface border border-hairline text-primary font-sans text-[0.88rem] p-2.5 rounded-md outline-none focus:border-brand-green transition-colors duration-200 placeholder:text-secondary/50" 
              placeholder="AIzaSy..." 
            />
          </div>
          <p v-if="!apiKeyInput" class="text-[0.8rem] text-danger mt-2.5 flex items-center gap-1.5">
            <span class="material-icons text-[14px]">info</span>
            <span>You can also configure the <code>GEMINI_API_KEY</code> on your server `.env` file.</span>
          </p>
        </div>
        <div class="flex justify-end gap-3">
          <BaseButton @click="showApiSettings = false" variant="secondary" size="sm">Cancel</BaseButton>
          <BaseButton @click="saveApiKey" variant="primary" size="sm">Save Key</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/main.css';
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';

const auth = useAuth();
const { isDark, toggleTheme } = useTheme();
const menuOpen = ref(false);
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

