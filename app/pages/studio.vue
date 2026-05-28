<template>
  <div>
    <!-- Empty State if no tailored CV has been generated/loaded yet -->
    <div v-if="!tailoredResult" class="empty-studio-container fade-in">
      <div class="empty-studio-card glass-panel text-center">
        <span class="material-icons empty-icon">analytics</span>
        <h3>Tailoring Studio</h3>
        <p>No job-specific adaptations have been loaded yet. Head over to the "Tailor a Job" workspace to optimize your resume for your target LinkedIn requisition.</p>
        <button @click="routeToTailor" class="btn btn-primary mt-16 flex-btn mx-auto">
          <span class="material-icons">auto_awesome</span>
          Go to Tailoring Workspace
        </button>
      </div>
    </div>

    <!-- Active Optimization Studio Workspace -->
    <div v-else class="step-layout fade-in">
      <div class="step-instruction flex-header-row">
        <div>
          <h2>
            <span class="material-icons mr-8 text-stone align-bottom">analytics</span>
            AI Tailoring Studio
          </h2>
          <p class="instruction-desc">Compare original versus tailored CV, view the optimization report, and export your polished resume.</p>
        </div>
        <!-- Secondary Action Button -->
        <button @click="resetStudio" class="btn btn-secondary btn-sm flex-btn">
          <span class="material-icons">refresh</span>
          Match Another Job
        </button>
      </div>

      <!-- ATS Scorecard Dashboard Widget -->
      <section class="ats-scorecard-widget glass-panel">
        <div class="scorecard-header-row">
          <div class="scorecard-lbl">
            <span class="score-glow-pulse"></span>
            <h4>ATS Compatibility Report</h4>
          </div>
          <span class="ats-match-tag">96% ATS MATCH RATING</span>
        </div>

        <div class="scorecard-body-grid">
          <div class="score-analysis-box border-right-pane">
            <h5>Matched Competencies</h5>
            <div class="competencies-tags-wrap">
              <span v-for="skill in tailoredAnalysis.matchedSkills" :key="skill" class="competency-tag">
                <span class="material-icons mr-4" style="font-size: 13px;">check_circle</span>
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="score-analysis-box border-right-pane">
            <h5>Integrated Keywords</h5>
            <div class="competencies-tags-wrap">
              <span v-for="kw in tailoredAnalysis.keywordsHighlighted" :key="kw" class="keyword-tag">
                {{ kw }}
              </span>
            </div>
          </div>

          <div class="score-analysis-box">
            <h5>Revisions Summary</h5>
            <ul class="revisions-list">
              <li v-for="adj in tailoredAnalysis.adjustmentsMade" :key="adj">
                <span class="material-icons mr-6 text-stone" style="font-size: 11px;">arrow_right</span>
                {{ adj }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Comparative Panes -->
      <div class="split-workspace-columns editor-workspace-height mt-12">
        <!-- Left: Original Referencing -->
        <div class="workspace-pane glass-panel">
          <div class="pane-action-header">
            <span class="editor-lbl">Original Master CV</span>
            <span class="stat-word-badge">{{ getWordCount(masterCv.content) }} words</span>
          </div>
          <div class="pane-preview-body overflow-y-scroll">
            <div class="markdown-preview dark-preview" v-html="renderedMaster"></div>
          </div>
        </div>

        <!-- Right: Editable Tailored Output -->
        <div class="workspace-pane glass-panel">
          <div class="pane-action-header flex-between">
            <div class="workspace-tabs-row">
              <button 
                @click="rightTab = 'preview'" 
                class="workspace-tab-trigger" 
                :class="{ active: rightTab === 'preview' }"
              >Live Preview</button>
              <button 
                @click="rightTab = 'edit'" 
                class="workspace-tab-trigger" 
                :class="{ active: rightTab === 'edit' }"
              >Edit Markdown</button>
            </div>

            <div class="workspace-actions-row">
              <span class="stat-word-badge mr-12">{{ getWordCount(tailoredContent) }} words</span>
              <button @click="copyToClipboard(tailoredContent)" class="btn btn-secondary btn-xs flex-btn mr-6">
                <span class="material-icons" style="font-size: 13px;">content_copy</span>
                Copy Markdown
              </button>
              <!-- This is the single interactive highlight CTA of this screen -->
              <button @click="triggerPrint" class="btn btn-primary btn-xs flex-btn">
                <span class="material-icons" style="font-size: 13px;">print</span>
                PDF/Print
              </button>
            </div>
          </div>
          
          <div class="pane-preview-body overflow-y-scroll pad-0">
            <!-- Live Preview -->
            <div v-show="rightTab === 'preview'" class="markdown-preview-pad">
              <div class="markdown-preview light-theme-preview" v-html="renderedTailored"></div>
            </div>

            <!-- Edit Markdown -->
            <textarea 
              v-show="rightTab === 'edit'" 
              v-model="tailoredContent" 
              class="workspace-editor-textarea"
              placeholder="# Styled Markdown..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Invisible Direct Print Layout painted only during printing -->
    <div v-if="isPrintLayoutActive" class="print-mode-layout-only">
      <div class="markdown-preview" v-html="renderedPrintContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'dashboard'
});
import { marked } from 'marked';
import {
  useMasterCv,
  useTailoredResult,
  useTailoredContent,
  useTailoredAnalysis
} from '~/composables/useCvState';

const router = useRouter();

const masterCv = useMasterCv();
const tailoredResult = useTailoredResult();
const tailoredContent = useTailoredContent();
const tailoredAnalysis = useTailoredAnalysis();

const rightTab = ref('preview');
const isPrintLayoutActive = ref(false);
const printContent = ref('');

function routeToTailor() {
  router.push('/tailor');
}

function resetStudio() {
  tailoredResult.value = null;
  tailoredContent.value = '';
  router.push('/tailor');
}

function getWordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const renderedMaster = computed(() => {
  if (!masterCv.value.content) return '<p style="color: var(--colors-secondary); font-style: italic;">No master resume loaded...</p>';
  return marked.parse(masterCv.value.content);
});

const renderedTailored = computed(() => {
  return marked.parse(tailoredContent.value || '');
});

const renderedPrintContent = computed(() => {
  return marked.parse(printContent.value || '');
});

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert('Markdown resume copied to clipboard!');
  } catch {
    alert('Failed to copy.');
  }
}

function triggerPrint() {
  printContent.value = tailoredContent.value;
  isPrintLayoutActive.value = true;
  setTimeout(() => {
    window.print();
    isPrintLayoutActive.value = false;
  }, 500);
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

/* Empty Studio UI */
.empty-studio-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}

.empty-studio-card {
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

.empty-studio-card h3 {
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 12px;
}

.empty-studio-card p {
  font-size: 0.88rem;
  color: var(--colors-secondary);
  line-height: 1.6;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.split-workspace-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  height: 60vh;
}

.workspace-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 0 !important;
}

.pane-action-header {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-light);
  background-color: var(--colors-surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor-lbl {
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--colors-secondary);
}

.stat-word-badge {
  font-family: var(--font-family);
  font-size: 0.72rem;
  color: var(--colors-secondary);
}

.workspace-editor-textarea {
  width: 100%;
  flex: 1;
  background-color: transparent;
  border: none;
  color: var(--colors-primary);
  font-family: monospace;
  font-size: 0.9rem;
  padding: 20px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.pane-preview-body {
  flex: 1;
  padding: var(--spacing-md);
  background-color: var(--colors-neutral);
}

.overflow-y-scroll {
  overflow-y: auto;
}

.flex-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mt-12 { margin-top: 12px; }
.mt-16 { margin-top: 16px; }

/* STEP 3 Specific Scorecard Layouts */
.ats-scorecard-widget {
  padding: var(--spacing-md) var(--spacing-lg);
}

.scorecard-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.scorecard-lbl {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scorecard-lbl h4 {
  font-size: 0.72rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  color: var(--colors-secondary);
}

.score-glow-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--success);
}

.ats-match-tag {
  background-color: transparent;
  border: 1px solid var(--success);
  color: var(--success);
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
}

.scorecard-body-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  gap: 24px;
}

.score-analysis-box h5 {
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--colors-secondary);
  margin-bottom: 10px;
}

.border-right-pane {
  border-right: 1px solid var(--border-light);
  padding-right: 24px;
}

.competencies-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.competency-tag {
  background-color: var(--colors-neutral);
  border: 1px solid var(--border-light);
  color: var(--colors-primary);
  font-size: 0.72rem;
  font-weight: 400;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
}

.keyword-tag {
  background-color: var(--colors-neutral);
  border: 1px solid var(--border-light);
  color: var(--colors-primary);
  font-family: monospace;
  font-size: 0.7rem;
  padding: 3px 6px;
  border-radius: var(--radius-sm);
}

.revisions-list {
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.revisions-list li {
  font-size: 0.78rem;
  color: var(--colors-primary);
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
}

.editor-workspace-height {
  height: 52vh;
}

.workspace-tabs-row {
  display: flex;
  gap: 4px;
}

.workspace-tab-trigger {
  background: none;
  border: 1px solid transparent;
  font-family: var(--font-family);
  font-weight: 500;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  color: var(--colors-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.workspace-tab-trigger:hover {
  color: var(--colors-primary);
}

.workspace-tab-trigger.active {
  color: var(--colors-primary);
  background-color: var(--colors-neutral);
  border-color: var(--border-light);
}

.workspace-actions-row {
  display: flex;
  align-items: center;
}

.mr-6 {
  margin-right: 6px;
}

.mr-12 {
  margin-right: 12px;
}

.pad-0 {
  padding: 0 !important;
}

.markdown-preview-pad {
  height: 100%;
  overflow-y: auto;
  padding: var(--spacing-md);
  background-color: var(--colors-neutral);
}

.light-theme-preview {
  border: 1px solid var(--border-light);
}

/* Printing styles only */
.print-mode-layout-only {
  background-color: #FFFFFF;
  color: #000000;
  min-height: 100vh;
  width: 100%;
}

@media (max-width: 900px) {
  .split-workspace-columns {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .workspace-editor-textarea {
    min-height: 240px;
    height: auto;
  }
  
  .pane-preview-body {
    height: 320px;
  }
  
  .scorecard-body-grid {
    grid-template-columns: 1fr;
  }
  
  .border-right-pane {
    border-right: none;
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 16px;
  }
}
</style>
