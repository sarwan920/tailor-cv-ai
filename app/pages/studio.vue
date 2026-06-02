<template>
  <div>
    <!-- Empty State if no tailored CV has been generated/loaded yet -->
    <div v-if="!tailoredResult" class="flex items-center justify-center min-h-[70vh] fade-in">
      <div class="max-w-[520px] w-full text-center p-10 bg-surface border border-secondary/25 rounded-lg">
        <span class="material-icons text-[3.5rem] text-secondary mb-5">analytics</span>
        <h3 class="text-[1.5rem] font-light mb-3">Tailoring Studio</h3>
        <p class="text-[0.88rem] text-secondary leading-relaxed">No job-specific adaptations have been loaded yet. Head over to the "Tailor a Job" workspace to optimize your resume for your target LinkedIn requisition.</p>
        <BaseButton @click="routeToTailor" variant="primary" class="mt-4 flex-btn mx-auto">
          <span class="material-icons">auto_awesome</span>
          Go to Tailoring Workspace
        </BaseButton>
      </div>
    </div>

    <!-- Active Optimization Studio Workspace -->
    <div v-else class="flex flex-col gap-6 fade-in no-print">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-[1.5rem] font-light text-primary">
            <span class="material-icons mr-2 text-secondary align-bottom">analytics</span>
            AI Tailoring Studio
          </h2>
          <p class="text-[0.88rem] text-secondary mt-1">Compare original versus tailored CV, view the optimization report, and export your polished resume.</p>
        </div>
        <!-- Secondary Action Button -->
        <BaseButton @click="resetStudio" variant="secondary" size="sm" class="flex-btn">
          <span class="material-icons">refresh</span>
          Match Another Job
        </BaseButton>
      </div>

      <!-- ATS Scorecard Dashboard Widget -->
      <section class="p-4 md:py-4 md:px-8 bg-surface border border-secondary/25 rounded-lg">
        <div class="flex justify-between items-center border-b border-secondary/25 pb-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-success"></span>
            <h4 class="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-secondary">ATS Compatibility Report</h4>
          </div>
          <span class="bg-transparent border border-success text-success font-sans font-medium text-[0.68rem] tracking-[0.18em] py-1 px-2.5 rounded-sm">96% ATS MATCH RATING</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="border-r-0 md:border-r border-secondary/25 pr-0 md:pr-6">
            <h5 class="font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary mb-2.5">Matched Competencies</h5>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="skill in tailoredAnalysis.matchedSkills" :key="skill" class="bg-neutral border border-secondary/25 text-primary text-[0.72rem] font-normal py-1 px-2 rounded-sm inline-flex items-center">
                <span class="material-icons mr-1" style="font-size: 13px;">check_circle</span>
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="border-r-0 md:border-r border-secondary/25 pr-0 md:pr-6">
            <h5 class="font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary mb-2.5">Integrated Keywords</h5>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="kw in tailoredAnalysis.keywordsHighlighted" :key="kw" class="bg-neutral border border-secondary/25 text-primary font-mono text-[0.7rem] py-0.5 px-1.5 rounded-sm">
                {{ kw }}
              </span>
            </div>
          </div>

          <div>
            <h5 class="font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary mb-2.5">Revisions Summary</h5>
            <ul class="pl-0 list-none flex flex-col gap-1.5">
              <li v-for="adj in tailoredAnalysis.adjustmentsMade" :key="adj" class="text-[0.78rem] text-primary leading-normal flex items-start">
                <span class="material-icons mr-1.5 text-secondary" style="font-size: 11px; margin-top: 3px;">arrow_right</span>
                {{ adj }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Comparative Panes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[52vh] mt-3">
        <!-- Left: Original Referencing -->
        <div class="flex flex-col h-[380px] lg:h-full overflow-hidden p-0 bg-surface border border-secondary/25 rounded-lg">
          <div class="py-3.5 px-5 border-b border-secondary/25 bg-surface flex items-center justify-between">
            <span class="font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary">Original Master CV</span>
            <span class="font-sans text-[0.72rem] text-secondary">{{ getWordCount(masterCv.content) }} words</span>
          </div>
          <div class="flex-1 p-4 bg-neutral overflow-y-auto">
            <div class="markdown-preview dark-preview" v-html="renderedMaster"></div>
          </div>
        </div>

        <!-- Right: Editable Tailored Output -->
        <div class="flex flex-col h-[480px] lg:h-full overflow-hidden p-0 bg-surface border border-secondary/25 rounded-lg">
          <div class="py-3.5 px-5 border-b border-secondary/25 bg-surface flex items-center justify-between">
            <div class="flex bg-primary/5 p-0.5 rounded-md border border-secondary/25 items-center">
              <button 
                @click="setTab('preview')" 
                class="bg-transparent border-none font-sans font-medium text-[0.65rem] uppercase tracking-[0.12em] py-1.5 px-3 rounded-sm text-secondary cursor-pointer transition-colors duration-150 hover:text-primary [&.active]:text-primary [&.active]:bg-surface [&.active]:shadow-[0_1px_3px_rgba(27,25,23,0.08)]" 
                :class="{ active: rightTab === 'preview' }"
              >Preview</button>
              <button 
                @click="setTab('diff')" 
                class="bg-transparent border-none font-sans font-medium text-[0.65rem] uppercase tracking-[0.12em] py-1.5 px-3 rounded-sm text-secondary cursor-pointer transition-colors duration-150 hover:text-primary [&.active]:text-primary [&.active]:bg-surface [&.active]:shadow-[0_1px_3px_rgba(27,25,23,0.08)]" 
                :class="{ active: rightTab === 'diff' }"
              >GitHub Diff</button>
              <button 
                @click="setTab('edit')" 
                class="bg-transparent border-none font-sans font-medium text-[0.65rem] uppercase tracking-[0.12em] py-1.5 px-3 rounded-sm text-secondary cursor-pointer transition-colors duration-150 hover:text-primary [&.active]:text-primary [&.active]:bg-surface [&.active]:shadow-[0_1px_3px_rgba(27,25,23,0.08)]" 
                :class="{ active: rightTab === 'edit' }"
              >Edit Markdown</button>
            </div>

            <div class="flex items-center">
              <span class="font-sans text-[0.72rem] text-secondary mr-3 hidden sm:inline">{{ getWordCount(tailoredContent) }} words</span>
              <BaseButton @click="copyToClipboard(tailoredContent)" variant="secondary" size="sm" class="w-7! h-7! p-0! inline-flex! items-center! justify-center! rounded-md! mr-1.5" title="Copy Markdown">
                <span class="material-icons" style="font-size: 16px;">content_copy</span>
              </BaseButton>
              <!-- This is the single interactive highlight CTA of this screen -->
              <BaseButton @click="triggerPrint" variant="primary" size="sm" class="w-7! h-7! p-0! inline-flex! items-center! justify-center! rounded-md!" title="PDF/Print">
                <span class="material-icons" style="font-size: 16px;">print</span>
              </BaseButton>
            </div>
          </div>
          
          <div class="flex-1 p-0 bg-neutral overflow-hidden flex flex-col">
            <!-- Live Preview -->
            <div v-show="rightTab === 'preview'" class="h-full overflow-y-auto p-4 bg-neutral">
              <div class="markdown-preview light-theme-preview" v-html="renderedTailored"></div>
            </div>

            <!-- GitHub Diff View -->
            <div v-show="rightTab === 'diff'" class="h-full overflow-y-auto p-4 bg-neutral">
              <div class="font-sans text-[0.78rem] text-secondary mb-3 flex items-center gap-2">
                <span class="text-[18px] text-success material-icons">difference</span>
                <span>Track Changes: <del class="bg-danger/18 text-[#8A3D35] line-through px-1 py-0.5 rounded-[2px] no-underline">Red represents original text</del> and <ins class="bg-success/22 text-[#2F382A] px-1 py-0.5 rounded-[2px] no-underline">Green represents tailored improvements</ins>.</span>
              </div>
              <div class="markdown-preview light-theme-preview" v-html="diffHtml"></div>
            </div>

            <!-- Edit Markdown -->
            <textarea 
              v-show="rightTab === 'edit'" 
              v-model="tailoredContent" 
              class="w-full flex-1 bg-transparent border-none text-primary font-mono text-[0.9rem] p-5 leading-relaxed resize-none outline-none h-full"
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
const diffHtml = ref('');
const isPrintLayoutActive = ref(false);
const printContent = ref('');

function setTab(tab) {
  rightTab.value = tab;
  if (tab === 'diff') {
    generateDiff();
  }
}

function loadDiffJS() {
  return new Promise((resolve, reject) => {
    if (window.Diff) {
      resolve(window.Diff);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.2.0/diff.min.js';
    script.onload = () => resolve(window.Diff);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function generateDiff() {
  try {
    diffHtml.value = '<p style="color: var(--colors-secondary); font-style: italic; padding: 12px;">Comparing baselines and generating revision differences...</p>';
    const Diff = await loadDiffJS();
    const originalText = masterCv.value.content || '';
    const tailoredText = tailoredContent.value || '';
    
    // Perform word-level diffing
    const changes = Diff.diffWords(originalText, tailoredText);
    
    let diffMarkdown = '';
    changes.forEach((part) => {
      const value = part.value;
      if (part.added || part.removed) {
        const tagOpen = part.added ? '<ins class="diff-added">' : '<del class="diff-removed">';
        const tagClose = part.added ? '</ins>' : '</del>';
        
        // Split chunk into lines to ensure markdown list and heading syntax stays structural
        const lines = value.split('\n');
        const processedLines = lines.map((line) => {
          if (!line.trim()) return line;
          
          // Keep bullet list markers (-/+/1.) or headers (#/##) outside of our highlight tags
          const match = line.match(/^(\s*(?:-\s+|\*\s+|\d+\.\s+|#+\s+))(.*)/);
          if (match) {
            const prefix = match[1];
            const content = match[2];
            return `${prefix}${tagOpen}${escapeHtml(content)}${tagClose}`;
          } else {
            return `${tagOpen}${escapeHtml(line)}${tagClose}`;
          }
        });
        
        diffMarkdown += processedLines.join('\n');
      } else {
        diffMarkdown += escapeHtml(part.value);
      }
    });
    
    // Parse the generated HTML markdown using marked.parse
    diffHtml.value = marked.parse(diffMarkdown);
  } catch (err) {
    console.error('Diff generation error:', err);
    diffHtml.value = '<p class="warning-text">Failed to generate revision differences.</p>';
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
:deep(.markdown-preview ins.diff-added) {
  background-color: rgba(95, 107, 86, 0.22) !important; /* Sage green addition */
  color: #2F382A !important;
  text-decoration: none !important;
  padding: 1px 4px !important;
  border-radius: 2px !important;
  display: inline;
}

:deep(.markdown-preview del.diff-removed) {
  background-color: rgba(150, 75, 67, 0.18) !important; /* Terracotta red deletion */
  color: #8A3D35 !important;
  text-decoration: line-through !important;
  padding: 1px 4px !important;
  border-radius: 2px !important;
  display: inline;
}

/* One-Page Direct Printing Styles */
@media print {
  /* Absolute isolation: Hide everything except the print-only container */
  body * {
    visibility: hidden !important;
  }

  .print-mode-layout-only,
  .print-mode-layout-only * {
    visibility: visible !important;
  }

  .print-mode-layout-only {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    display: block !important;
    background: #FFFFFF !important;
    color: #000000 !important;
  }

  body, html {
    background: #FFFFFF !important;
    color: #000000 !important;
    font-size: 8.5pt !important;
    line-height: 1.25 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .markdown-preview {
    font-family: 'Jost', sans-serif !important;
    font-size: 8.5pt !important;
    line-height: 1.25 !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: #FFFFFF !important;
    color: #000000 !important;
  }

  .markdown-preview h1 {
    font-size: 14pt !important;
    font-weight: 600 !important;
    margin-top: 0 !important;
    margin-bottom: 4pt !important;
    padding-bottom: 2pt !important;
    border-bottom: 1.5px solid #000000 !important;
    color: #000000 !important;
  }

  .markdown-preview h2 {
    font-size: 10.5pt !important;
    font-weight: 600 !important;
    margin-top: 6pt !important;
    margin-bottom: 3pt !important;
    border-bottom: 1px solid #8C847A !important;
    padding-bottom: 1pt !important;
    color: #000000 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.08em !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  .markdown-preview p {
    font-size: 8.5pt !important;
    margin-bottom: 3pt !important;
    color: #000000 !important;
  }

  .markdown-preview ul, .markdown-preview ol {
    margin-bottom: 3pt !important;
    padding-left: 10pt !important;
  }

  .markdown-preview li {
    font-size: 8.5pt !important;
    margin-bottom: 1pt !important;
    color: #000000 !important;
  }

  .markdown-preview strong {
    font-weight: 600 !important;
    color: #000000 !important;
  }

  .markdown-preview hr {
    margin: 4pt 0 !important;
    border: none !important;
    border-top: 1px solid #8C847A !important;
  }

  @page {
    size: portrait;
    margin: 0.4in 0.5in 0.4in 0.5in !important;
  }
}
</style>
