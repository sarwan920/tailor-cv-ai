<template>
  <div class="step-layout fade-in">
    <div class="step-instruction flex-header-row">
      <div>
        <h2>
          <span class="material-icons mr-8 text-stone align-bottom">history</span>
          Adaptation Logs
        </h2>
        <p class="instruction-desc">Browse through all the previous job descriptions you have tailored your resume for.</p>
      </div>
    </div>

    <!-- Empty State if no history logs exist yet -->
    <div v-if="history.length === 0" class="empty-history-container">
      <div class="empty-history-card glass-panel text-center">
        <span class="material-icons empty-icon">receipt_long</span>
        <h3>No Logs Found</h3>
        <p>You haven't tailored your resume for any positions yet. Run your first adaptation in "Tailor a Job" to start building your log history.</p>
        <button @click="routeToTailor" class="btn btn-primary mt-16 flex-btn mx-auto">
          <span class="material-icons">auto_awesome</span>
          Start Tailoring
        </button>
      </div>
    </div>

    <!-- Logs grid -->
    <div v-else class="drawer-body-grid-full">
      <div 
        v-for="item in history" 
        :key="item.id" 
        class="history-log-card-full" 
        @click="loadHistoryLog(item)"
      >
        <div class="history-log-header">
          <span class="log-company">{{ item.company }}</span>
          <span class="log-match-score">
            <span class="material-icons mr-4" style="font-size: 13px;">check_circle</span>
            95% ATS MATCH
          </span>
        </div>
        <h5 class="log-title">{{ item.jobTitle }}</h5>
        <div class="log-desc-snippet">{{ getSnippet(item.jobDescription) }}</div>
        <span class="log-date">Optimized {{ formatDate(item.createdAt) }}</span>
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

<style scoped>
.step-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step-instruction h2 {
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--colors-primary);
}

.instruction-desc {
  font-size: 0.88rem;
  color: var(--colors-secondary);
  margin-top: 4px;
}

.flex-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Empty State */
.empty-history-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.empty-history-card {
  max-width: 520px;
  width: 100%;
  text-align: center;
  padding: 40px !important;
}

.empty-icon {
  font-size: 3.5rem;
  color: var(--colors-secondary);
  margin-bottom: 20px;
}

.empty-history-card h3 {
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 12px;
}

.empty-history-card p {
  font-size: 0.88rem;
  color: var(--colors-secondary);
  line-height: 1.6;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mt-16 {
  margin-top: 16px;
}

/* Grid layout */
.drawer-body-grid-full {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.history-log-card-full {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--colors-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.history-log-card-full:hover {
  border-color: var(--colors-primary);
}

.history-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.log-company {
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--colors-primary);
}

.log-match-score {
  font-size: 0.68rem;
  color: var(--success);
  font-weight: 500;
  letter-spacing: 0.08em;
  display: inline-flex;
  align-items: center;
}

.log-title {
  font-size: 0.98rem;
  font-weight: 400;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--colors-primary);
}

.log-desc-snippet {
  font-size: 0.82rem;
  color: var(--colors-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
  flex: 1;
}

.log-date {
  font-size: 0.72rem;
  color: var(--colors-secondary);
}

.mr-4 {
  margin-right: 4px;
}

.flex-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
