<template>
  <div>
    <!-- Loading Animation (Runs inside the container when AI is tailoring) -->
    <div v-if="isTailoring" class="stepper-loader glass-panel no-print">
      <div class="loader-ring-wrapper">
        <div class="loader-ring">
          <span class="material-icons loader-spin-icon">sync</span>
        </div>
        <h3>AI Tailoring Engine Active</h3>
        <p class="loader-subtitle">Rephrasing accomplishments and mapping keywords...</p>
        
        <div class="loader-sub-steps">
          <div class="sub-step" :class="loaderStepClass(1)">
            <span class="sub-bullet">
              <span class="material-icons" style="font-size: 14px;">{{ loaderStepIcon(1) }}</span>
            </span>
            <span>Parsing LinkedIn Job Description...</span>
          </div>
          <div class="sub-step" :class="loaderStepClass(2)">
            <span class="sub-bullet">
              <span class="material-icons" style="font-size: 14px;">{{ loaderStepIcon(2) }}</span>
            </span>
            <span>Analyzing Resume Experience & Keywords...</span>
          </div>
          <div class="sub-step" :class="loaderStepClass(3)">
            <span class="sub-bullet">
              <span class="material-icons" style="font-size: 14px;">{{ loaderStepIcon(3) }}</span>
            </span>
            <span>Generating fact-faithful optimized Markdown...</span>
          </div>
          <div class="sub-step" :class="loaderStepClass(4)">
            <span class="sub-bullet">
              <span class="material-icons" style="font-size: 14px;">{{ loaderStepIcon(4) }}</span>
            </span>
            <span>Finalizing ATS compliance checks...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Step Workspace -->
    <div v-else class="step-layout fade-in">
      <div class="step-instruction">
        <h2>
          <span class="material-icons mr-8 text-stone align-bottom">work_outline</span>
          Target Job specifications
        </h2>
        <p class="instruction-desc">Provide details of the position you are targeting. Paste the job description copied from LinkedIn or Indeed.</p>
      </div>

      <div class="split-workspace-columns">
        <!-- Job Details and Focus -->
        <div class="workspace-pane glass-panel pad-24">
          <h3 class="panel-inner-title">Job Information</h3>
          
          <div class="form-double-row">
            <div class="form-group flex-1">
              <label class="form-label">Target Job Title <span class="required-mark">*</span></label>
              <input 
                v-model="form.jobTitle" 
                type="text" 
                class="form-input" 
                :class="{ 'validation-error': showValidationError && !form.jobTitle.trim() }"
                placeholder="e.g. Lead Frontend Architect"
              />
            </div>
            <div class="form-group flex-1 ml-16">
              <label class="form-label">Target Company <span class="required-mark">*</span></label>
              <input 
                v-model="form.company" 
                type="text" 
                class="form-input" 
                :class="{ 'validation-error': showValidationError && !form.company.trim() }"
                placeholder="e.g. Google"
              />
            </div>
          </div>

          <div class="form-group mb-0">
            <label class="form-label">AI Tuning Guidelines (Optional)</label>
            <textarea 
              v-model="form.customDirectives" 
              class="form-input form-textarea directive-textarea"
              placeholder="Examples: 'Emphasize my cloud engineering achievements', 'Rewrite in an executive tone', or 'Highlight React Native metrics.'"
            ></textarea>
          </div>
        </div>

        <!-- Job Description Specifications -->
        <div class="workspace-pane glass-panel">
          <div class="pane-action-header">
            <span class="editor-lbl">LinkedIn Job Description Specifications <span class="required-mark">*</span></span>
          </div>
          <textarea 
            v-model="form.jobDescription" 
            class="workspace-editor-textarea flex-editor"
            :class="{ 'validation-error': showValidationError && !form.jobDescription.trim() }"
            placeholder="Paste the full job description text from LinkedIn here..."
          ></textarea>
        </div>
      </div>

      <div class="step-navigation-footer">
        <BaseButton @click="navigateBack" variant="secondary" size="lg" class="flex-btn">
          <span class="material-icons">arrow_back</span>
          Back to CV
        </BaseButton>
        <!-- This is the single interactive highlight CTA of this screen -->
        <BaseButton @click="handleTailorClick" variant="primary" size="lg" class="flex-btn" :loading="isTailoring">
          <span class="material-icons mr-6">auto_awesome</span>
          Initiate AI Tailoring
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'dashboard'
});
import {
  useMasterCv,
  useJobForm,
  useTailoredResult,
  useTailoredContent,
  useTailoredAnalysis,
  useIsTailoring,
  useTailoringStep
} from '~/composables/useCvState';

const router = useRouter();

const masterCv = useMasterCv();
const form = useJobForm();
const tailoredResult = useTailoredResult();
const tailoredContent = useTailoredContent();
const tailoredAnalysis = useTailoredAnalysis();
const isTailoring = useIsTailoring();
const tailoringStep = useTailoringStep();
const showValidationError = ref(false);

function handleTailorClick() {
  if (!form.value.jobTitle.trim() || !form.value.company.trim() || !form.value.jobDescription.trim()) {
    showValidationError.value = true;
    alert('Please fill out all mandatory fields marked with a red asterisk (*) to initiate tailoring.');
    return;
  }
  triggerTailor();
}

function navigateBack() {
  router.push('/resume');
}

// Stepper Progress Indicators
function loaderStepClass(step) {
  if (tailoringStep.value === step) return 'active';
  if (tailoringStep.value > step) return 'completed';
  return 'pending';
}

function loaderStepIcon(step) {
  if (tailoringStep.value > step) return 'check_circle';
  if (tailoringStep.value === step) return 'refresh';
  return 'radio_button_unchecked';
}

function runLoaderAnimation() {
  tailoringStep.value = 1;
  const interval = setInterval(() => {
    if (tailoringStep.value < 4) {
      tailoringStep.value++;
    } else {
      clearInterval(interval);
    }
  }, 2500);
  return interval;
}

// Optimization triggers
async function triggerTailor() {
  if (!masterCv.value.id) {
    // If no resume is saved yet, save it first
    alert('Please save a master CV first on the Master Resume page.');
    router.push('/resume');
    return;
  }

  const geminiApiKey = localStorage.getItem('gemini_api_key') || '';
  isTailoring.value = true;
  
  const loaderInterval = runLoaderAnimation();

  try {
    const response = await $fetch('/api/tailor', {
      method: 'POST',
      body: {
        profileId: masterCv.value.id,
        jobTitle: form.value.jobTitle,
        company: form.value.company,
        jobDescription: form.value.jobDescription,
        geminiApiKey,
        options: {
          customDirectives: form.value.customDirectives
        }
      }
    });

    tailoringStep.value = 4;
    setTimeout(() => {
      clearInterval(loaderInterval);
      tailoredResult.value = response;
      tailoredContent.value = response.tailoredContent;
      try {
        tailoredAnalysis.value = JSON.parse(response.aiAnalysis || '{}');
      } catch {
        tailoredAnalysis.value = { matchedSkills: [], keywordsHighlighted: [], adjustmentsMade: [] };
      }
      isTailoring.value = false;
      router.push('/studio');
    }, 1000);

  } catch (err) {
    clearInterval(loaderInterval);
    isTailoring.value = false;
    alert('Failed to tailor CV: ' + (err.statusMessage || err.message));
  }
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

.title-icon {
  font-size: 1.7rem;
  color: var(--colors-secondary);
}

.instruction-desc {
  font-size: 0.88rem;
  color: var(--colors-secondary);
  margin-top: 4px;
}

.split-workspace-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  height: 68vh;
}

.workspace-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 0 !important;
}

.pad-24 {
  padding: var(--spacing-lg) !important;
}

.panel-inner-title {
  font-size: 0.72rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  margin-bottom: 20px;
  color: var(--colors-secondary);
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 8px;
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

.flex-editor {
  min-height: 100%;
}

.form-double-row {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.ml-16 {
  margin-left: 16px;
}

.directive-textarea {
  min-height: 140px;
  font-size: 0.88rem;
}

.step-navigation-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  border-top: 1px solid var(--border-light);
  padding-top: var(--spacing-lg);
}

.flex-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Stepper Loader State */
.stepper-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  min-height: 480px;
  background-color: var(--colors-surface);
}

.loader-ring-wrapper {
  max-width: 480px;
  width: 100%;
  text-align: center;
}

.loader-ring {
  position: relative;
  width: 48px;
  height: 48px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-spin-icon {
  font-size: 2.2rem;
  color: var(--colors-tertiary);
  animation: spin 1.2s linear infinite;
}

.loader-ring-wrapper h3 {
  font-size: 1.4rem;
  font-weight: 300;
  color: var(--colors-primary);
  letter-spacing: 0.02em;
  margin-bottom: 6px;
}

.loader-subtitle {
  font-size: 0.85rem;
  color: var(--colors-secondary);
  margin-bottom: 32px;
}

.loader-sub-steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  text-align: left;
  max-width: 320px;
  margin: 0 auto;
  padding: var(--spacing-md);
  background-color: var(--colors-neutral);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
}

.sub-step {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.82rem;
  color: var(--colors-secondary);
  transition: all var(--transition-normal);
}

.sub-bullet {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.sub-step.active {
  color: var(--colors-primary);
  font-weight: 500;
}

.sub-step.active .sub-bullet .material-icons {
  color: var(--colors-tertiary);
  animation: spin 2.5s linear infinite;
}

.sub-step.completed {
  color: var(--success);
}

.sub-step.completed .sub-bullet .material-icons {
  color: var(--success);
}

@keyframes spin {
  100% { transform: rotate(360deg); }
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
  
  .form-double-row {
    flex-direction: column;
  }
  
  .ml-16 {
    margin-left: 0;
    margin-top: 16px;
  }
}

.required-mark {
  color: var(--danger);
  margin-left: 2px;
  font-weight: bold;
}

.validation-error {
  border: 1px solid var(--danger) !important;
  background-color: rgba(150, 75, 67, 0.03) !important;
}
</style>
