<template>
  <div class="flex flex-col gap-6 fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-[1.5rem] font-light text-primary">
          <span class="material-icons mr-2 text-secondary align-bottom">history</span>
          Adaptation Logs
        </h2>
        <p class="text-[0.88rem] text-secondary mt-1">Browse through all the previous job descriptions you have tailored your resume for.</p>
      </div>
    </div>

    <!-- Empty State if no history logs exist yet -->
    <div v-if="history.length === 0" class="flex items-center justify-center min-h-[50vh]">
      <div class="max-w-[520px] w-full text-center p-10 bg-surface border border-hairline rounded-lg shadow-none">
        <span class="material-icons text-[3.5rem] text-secondary mb-5">receipt_long</span>
        <h3 class="text-[1.5rem] font-light mb-3">No Logs Found</h3>
        <p class="text-[0.88rem] text-secondary leading-relaxed">You haven't tailored your resume for any positions yet. Run your first adaptation in "Tailor a Job" to start building your log history.</p>
        <BaseButton @click="routeToTailor" variant="primary" class="mt-4 flex-btn mx-auto">
          <span class="material-icons">auto_awesome</span>
          Start Tailoring
        </BaseButton>
      </div>
    </div>

    <!-- Logs grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="item in history" 
        :key="item.id" 
        class="p-4 md:py-4 md:px-6 bg-surface/50 border border-hairline rounded-lg cursor-pointer transition-all duration-250 flex flex-col justify-between hover:border-brand-green shadow-none" 
        @click="loadHistoryLog(item)"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="font-sans font-semibold text-[0.72rem] uppercase tracking-[0.12em] text-primary">{{ item.company }}</span>
          <div class="flex items-center gap-2">
            <span class="text-[0.68rem] text-success font-medium tracking-[0.08em] inline-flex items-center">
              <span class="material-icons mr-1" style="font-size: 13px;">check_circle</span>
              95% ATS MATCH
            </span>
            <button 
              @click.stop="confirmDelete(item)" 
              class="text-secondary hover:text-danger p-0.5 rounded transition-colors duration-150 cursor-pointer flex items-center justify-center bg-transparent border-none"
              title="Delete Adaptation Log"
            >
              <span class="material-icons text-[16px]">delete</span>
            </button>
          </div>
        </div>
        <h5 class="text-[0.98rem] font-normal mb-2 whitespace-nowrap overflow-hidden text-ellipsis text-primary">{{ item.jobTitle }}</h5>
        <div class="text-[0.82rem] text-secondary leading-normal mb-3 flex-1">{{ getSnippet(item.jobDescription) }}</div>
        <span class="text-[0.72rem] text-secondary">Optimized {{ formatDate(item.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'dashboard'
});
import {
  useJobForm,
  useTailoredResult,
  useTailoredContent,
  useTailoredAnalysis
} from '~/composables/useCvState';

const router = useRouter();
const history = ref([]);

const form = useJobForm();
const tailoredResult = useTailoredResult();
const tailoredContent = useTailoredContent();
const tailoredAnalysis = useTailoredAnalysis();

onMounted(() => {
  fetchHistory();
});

async function fetchHistory() {
  try {
    const data = await $fetch('/api/history');
    history.value = data || [];
  } catch (err) {
    console.error('Error loading history:', err);
  }
}

function routeToTailor() {
  router.push('/tailor');
}

async function confirmDelete(item) {
  if (confirm(`Are you sure you want to delete the tailored CV for "${item.jobTitle}" at "${item.company}"?`)) {
    try {
      await $fetch(`/api/history/${item.id}`, { method: 'DELETE' });
      history.value = history.value.filter(h => h.id !== item.id);
    } catch (err) {
      alert('Failed to delete log: ' + (err.statusMessage || err.message));
    }
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getSnippet(text) {
  if (!text) return '';
  return text.length > 100 ? text.slice(0, 100) + '...' : text;
}

function loadHistoryLog(item) {
  tailoredResult.value = item;
  tailoredContent.value = item.tailoredContent;
  form.value.jobTitle = item.jobTitle;
  form.value.company = item.company;
  form.value.jobDescription = item.jobDescription;
  
  try {
    tailoredAnalysis.value = JSON.parse(item.aiAnalysis || '{}');
  } catch {
    tailoredAnalysis.value = { matchedSkills: [], keywordsHighlighted: [], adjustmentsMade: [] };
  }
  
  router.push('/studio');
}
</script>

