<template>
  <div>
    <!-- Loading Animation (Runs inside the container when AI is tailoring) -->
    <div v-if="isTailoring" class="flex justify-center items-center p-10 md:p-5 min-h-[480px] bg-surface border border-secondary/25 rounded-lg no-print">
      <div class="max-w-[480px] w-full text-center">
        <div class="relative w-12 h-12 mx-auto mb-6 flex items-center justify-center">
          <span class="material-icons text-[2.2rem] text-tertiary animate-spin">sync</span>
        </div>
        <h3 class="text-[1.4rem] font-light text-primary tracking-wide mb-1.5">AI Tailoring Engine Active</h3>
        <p class="text-[0.85rem] text-secondary mb-8">Rephrasing accomplishments and mapping keywords...</p>
        
        <div class="flex flex-col gap-4 text-left max-w-[320px] mx-auto p-4 bg-neutral border border-secondary/25 rounded-md">
          <div class="flex items-center gap-3 text-[0.82rem] text-secondary transition-all duration-250" :class="tailoringStep === 1 ? 'text-primary font-medium' : (tailoringStep > 1 ? 'text-success' : '')">
            <span class="flex items-center justify-center w-5 h-5">
              <span class="material-icons text-[14px]" :class="tailoringStep === 1 ? 'animate-spin text-tertiary' : (tailoringStep > 1 ? 'text-success' : '')">{{ loaderStepIcon(1) }}</span>
            </span>
            <span>Parsing LinkedIn Job Description...</span>
          </div>
          <div class="flex items-center gap-3 text-[0.82rem] text-secondary transition-all duration-250" :class="tailoringStep === 2 ? 'text-primary font-medium' : (tailoringStep > 2 ? 'text-success' : '')">
            <span class="flex items-center justify-center w-5 h-5">
              <span class="material-icons text-[14px]" :class="tailoringStep === 2 ? 'animate-spin text-tertiary' : (tailoringStep > 2 ? 'text-success' : '')">{{ loaderStepIcon(2) }}</span>
            </span>
            <span>Analyzing Resume Experience & Keywords...</span>
          </div>
          <div class="flex items-center gap-3 text-[0.82rem] text-secondary transition-all duration-250" :class="tailoringStep === 3 ? 'text-primary font-medium' : (tailoringStep > 3 ? 'text-success' : '')">
            <span class="flex items-center justify-center w-5 h-5">
              <span class="material-icons text-[14px]" :class="tailoringStep === 3 ? 'animate-spin text-tertiary' : (tailoringStep > 3 ? 'text-success' : '')">{{ loaderStepIcon(3) }}</span>
            </span>
            <span>Generating fact-faithful optimized Markdown...</span>
          </div>
          <div class="flex items-center gap-3 text-[0.82rem] text-secondary transition-all duration-250" :class="tailoringStep === 4 ? 'text-primary font-medium' : (tailoringStep > 4 ? 'text-success' : '')">
            <span class="flex items-center justify-center w-5 h-5">
              <span class="material-icons text-[14px]" :class="tailoringStep === 4 ? 'animate-spin text-tertiary' : (tailoringStep > 4 ? 'text-success' : '')">{{ loaderStepIcon(4) }}</span>
            </span>
            <span>Finalizing ATS compliance checks...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Step Workspace -->
    <div v-else class="flex flex-col gap-6 fade-in">
      <div class="step-instruction">
        <h2 class="text-[1.5rem] font-light text-primary">
          <span class="material-icons mr-2 text-secondary align-bottom">work_outline</span>
          Target Job specifications
        </h2>
        <p class="text-[0.88rem] text-secondary mt-1">Provide details of the position you are targeting. Paste the job description copied from LinkedIn or Indeed.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[68vh]">
        <!-- Job Details and Focus -->
        <div class="flex flex-col h-full overflow-hidden p-6 lg:p-8 bg-surface border border-secondary/25 rounded-lg">
          <h3 class="text-[0.72rem] font-medium uppercase tracking-[0.24em] mb-5 text-secondary border-b border-secondary/25 pb-2">Job Information</h3>
          
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 mb-8">
              <label class="block font-sans text-[0.72rem] font-normal uppercase tracking-[0.24em] mb-2 text-secondary">Target Job Title <span class="text-danger ml-0.5 font-bold">*</span></label>
              <input 
                v-model="form.jobTitle" 
                type="text" 
                class="w-full bg-surface border text-primary font-sans text-[0.98rem] p-3 rounded-md outline-none focus:border-primary transition-colors duration-250 placeholder:text-secondary/60" 
                :class="showValidationError && !form.jobTitle.trim() ? 'border-danger bg-danger/5' : 'border-secondary/25'"
                placeholder="e.g. Lead Frontend Architect"
              />
            </div>
            <div class="flex-1 mb-8">
              <label class="block font-sans text-[0.72rem] font-normal uppercase tracking-[0.24em] mb-2 text-secondary">Target Company <span class="text-danger ml-0.5 font-bold">*</span></label>
              <input 
                v-model="form.company" 
                type="text" 
                class="w-full bg-surface border text-primary font-sans text-[0.98rem] p-3 rounded-md outline-none focus:border-primary transition-colors duration-250 placeholder:text-secondary/60" 
                :class="showValidationError && !form.company.trim() ? 'border-danger bg-danger/5' : 'border-secondary/25'"
                placeholder="e.g. Google"
              />
            </div>
          </div>

          <div class="mb-0">
            <label class="block font-sans text-[0.72rem] font-normal uppercase tracking-[0.24em] mb-2 text-secondary">AI Tuning Guidelines (Optional)</label>
            <textarea 
              v-model="form.customDirectives" 
              class="w-full bg-surface border border-secondary/25 text-primary font-sans text-[0.88rem] p-3 rounded-md outline-none focus:border-primary transition-colors duration-250 placeholder:text-secondary/60 min-h-[140px]"
              placeholder="Examples: 'Emphasize my cloud engineering achievements', 'Rewrite in an executive tone', or 'Highlight React Native metrics.'"
            ></textarea>
          </div>
        </div>

        <!-- Job Description Specifications -->
        <div class="flex flex-col h-full overflow-hidden p-0 bg-surface border border-secondary/25 rounded-lg">
          <div class="py-3 px-5 border-b border-secondary/25 bg-surface flex items-center justify-between">
            <span class="font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary">LinkedIn Job Description Specifications <span class="text-danger ml-0.5 font-bold">*</span></span>
          </div>
          <textarea 
            v-model="form.jobDescription" 
            class="w-full flex-1 bg-transparent border-none text-primary font-mono text-[0.9rem] p-5 leading-relaxed resize-none outline-none min-h-[240px] lg:min-h-full"
            :class="showValidationError && !form.jobDescription.trim() ? 'border border-danger bg-danger/5' : ''"
            placeholder="Paste the full job description text from LinkedIn here..."
          ></textarea>
        </div>
      </div>

      <div class="flex justify-between items-center mt-2.5 border-t border-secondary/25 pt-8">
        <BaseButton @click="navigateBack" variant="secondary" size="lg" class="flex-btn">
          <span class="material-icons">arrow_back</span>
          Back to CV
        </BaseButton>
        <!-- This is the single interactive highlight CTA of this screen -->
        <BaseButton @click="handleTailorClick" variant="primary" size="lg" class="flex-btn" :loading="isTailoring">
          <span class="material-icons mr-1">auto_awesome</span>
          Initiate AI Tailoring
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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

