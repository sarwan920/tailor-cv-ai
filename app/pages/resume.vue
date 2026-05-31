<template>
  <div class="step-layout fade-in">
    <div class="step-instruction">
      <h2>
        <span class="material-icons mr-8 text-stone align-bottom">folder_open</span>
        Master Resume Editor
      </h2>
      <p class="instruction-desc">This is your baseline resume experience. AI will reference this text to re-write and highlight key competencies—nothing is fabricated or invented.</p>
    </div>

    <div class="split-workspace-columns">
      <!-- Write CV -->
      <div class="workspace-pane glass-panel">
        <div class="pane-action-header">
          <span class="editor-lbl">Markdown / Plain Text</span>
          <div class="editor-header-actions">
            <BaseButton @click="triggerFileInput" variant="secondary" size="xs" class="flex-btn mr-6">
              <span class="material-icons" style="font-size: 13px;">upload_file</span>
              Upload File
            </BaseButton>
            <BaseButton @click="loadDemoCV" variant="secondary" size="xs" class="flex-btn">
              <span class="material-icons" style="font-size: 13px;">lightbulb</span>
              Load Sample Template
            </BaseButton>
            <input 
              type="file" 
              ref="fileInput" 
              accept=".txt,.md,.markdown,.pdf" 
              style="display: none;" 
              @change="handleFileUpload" 
            />
          </div>
        </div>
        <textarea 
          v-model="masterCv.content" 
          @input="onContentChange"
          class="workspace-editor-textarea flex-editor"
          :class="{ 'validation-error': showValidationError && !masterCv.content.trim() }"
          placeholder="Paste or write your master CV here..."
        ></textarea>
      </div>

      <!-- Preview CV -->
      <div class="workspace-pane glass-panel">
        <div class="pane-action-header">
          <span class="editor-lbl">Live CV Preview</span>
          <span class="stat-word-badge">{{ getWordCount(masterCv.content) }} words</span>
        </div>
        <div class="pane-preview-body overflow-y-scroll">
          <div class="markdown-preview dark-preview" v-html="renderedMaster"></div>
        </div>
      </div>
    </div>

    <div class="step-navigation-footer">
      <div></div> <!-- Spacer -->
      <!-- Highlight Interactive CTA -->
      <BaseButton @click="handleNextClick" variant="primary" size="lg" class="flex-btn">
        Next: Tailor a Job
        <span class="material-icons">arrow_forward</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { marked } from 'marked';
import { useMasterCv } from '~/composables/useCvState';

definePageMeta({
  layout: 'dashboard'
});

const router = useRouter();
const masterCv = useMasterCv();
const fileInput = ref(null);
const showValidationError = ref(false);

function handleNextClick() {
  if (!masterCv.value.content || !masterCv.value.content.trim()) {
    showValidationError.value = true;
    alert('Please enter or upload your resume experience first in the editor panel before moving to tailoring.');
    return;
  }
  navigateNext();
}

function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function loadPdfJS() {
  return new Promise((resolve, reject) => {
    if (window['pdfjs-dist/build/pdf']) {
      resolve(window['pdfjs-dist/build/pdf']);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
    script.onload = () => {
      const pdfjs = window['pdfjs-dist/build/pdf'];
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      resolve(pdfjs);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function extractTextFromPDF(arrayBuffer) {
  const pdfjs = await loadPdfJS();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items;
    
    if (items.length === 0) continue;

    // Group items by vertical y coordinate (transform[5])
    // Note: PDF coordinate system y increases from bottom to top
    const linesMap = new Map();
    const yThreshold = 5; // tolerance for baseline alignment in points

    items.forEach(item => {
      if (!item.str || item.str.trim() === '') return;
      
      const y = item.transform[5];
      const x = item.transform[4];
      
      // Find an existing line group that is close to this y baseline
      let foundKey = null;
      for (const existingY of linesMap.keys()) {
        if (Math.abs(existingY - y) < yThreshold) {
          foundKey = existingY;
          break;
        }
      }
      
      if (foundKey !== null) {
        linesMap.get(foundKey).push({ x, str: item.str });
      } else {
        linesMap.set(y, [{ x, str: item.str }]);
      }
    });

    // Sort baselines from top to bottom (highest y is top of page)
    const sortedBaselines = Array.from(linesMap.keys()).sort((a, b) => b - a);
    
    let lastY = null;
    sortedBaselines.forEach(y => {
      const lineItems = linesMap.get(y);
      // Sort items on this line from left to right
      lineItems.sort((a, b) => a.x - b.x);
      
      // Merge items in the line with appropriate spacing
      let lineText = '';
      let lastX = null;
      
      lineItems.forEach(item => {
        if (lastX !== null) {
          const spacing = item.x - lastX;
          // If there is a noticeable gap between items on the same line, add a space
          if (spacing > 6) {
            lineText += ' ';
          }
        }
        lineText += item.str;
        // Estimate the end coordinate of this segment to determine spacing to next item
        // Approximate character width is ~5 points
        lastX = item.x + (item.str.length * 5);
      });
      
      // Check vertical gap to previous line to insert paragraph breaks
      if (lastY !== null) {
        const gap = lastY - y;
        if (gap > 18) { // standard line gap threshold for paragraphs
          fullText += '\n';
        }
      }
      
      fullText += lineText + '\n';
      lastY = y;
    });
    
    fullText += '\n\n'; // page break spacing
  }
  
  return fullText.trim();
}

async function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

  if (isPdf) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        try {
          const text = await extractTextFromPDF(e.target.result);
          masterCv.value.content = text;
          onContentChange(); // Trigger debounced auto-save to API
        } catch (err) {
          console.error('PDF parsing error:', err);
          alert('Failed to extract text from PDF. Please make sure the PDF has selectable text.');
        }
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        masterCv.value.content = e.target.result;
        onContentChange(); // Trigger debounced auto-save to API
      }
    };
    reader.readAsText(file);
  }
}

onMounted(() => {
  if (!masterCv.value.content) {
    fetchMasterCv();
  }
});

async function fetchMasterCv() {
  try {
    const data = await $fetch('/api/cv');
    if (data && data.length > 0) {
      masterCv.value = {
        id: data[0].id,
        title: data[0].title,
        content: data[0].content
      };
    }
  } catch (err) {
    console.error('Error fetching CV:', err);
  }
}

async function saveMasterCv() {
  if (!masterCv.value.content.trim()) return;
  try {
    if (masterCv.value.id) {
      await $fetch(`/api/cv/${masterCv.value.id}`, {
        method: 'PUT',
        body: {
          title: masterCv.value.title,
          content: masterCv.value.content
        }
      });
    } else {
      const created = await $fetch('/api/cv', {
        method: 'POST',
        body: {
          title: masterCv.value.title,
          content: masterCv.value.content
        }
      });
      masterCv.value.id = created.id;
    }
  } catch (err) {
    console.error('Failed to save master CV:', err);
  }
}

let debounceTimeout = null;
function onContentChange() {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    saveMasterCv();
  }, 1000);
}

async function navigateNext() {
  await saveMasterCv();
  router.push('/tailor');
}

const renderedMaster = computed(() => {
  if (!masterCv.value.content) {
    return '<p style="color: var(--colors-secondary); font-style: italic;">A clean styled preview of your resume will be displayed here in real-time as you write...</p>';
  }
  return marked.parse(masterCv.value.content);
});

function getWordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function loadDemoCV() {
  masterCv.value.content = `# Jane Doe
**Senior Full-Stack Software Engineer** | email@example.com | +1 (555) 123-4567 | github.com/janedoe | linkedin.com/in/janedoe

## Summary
Passion-driven and result-oriented Senior Fullstack Engineer with 6+ years of experience designing, building, and deploying highly scalable web applications. Expert in TypeScript, React, Node.js, and Cloud Infrastructure (AWS). Skilled in translating business goals into robust software architectures and leading collaborative teams.

## Skills
- **Frontend**: React, Next.js, Vue.js, TypeScript, CSS Grid/Flexbox, TailwindCSS
- **Backend**: Node.js, Express, Fastify, GraphQL, REST APIs, Python
- **Databases**: PostgreSQL, MongoDB, Redis, SQLite, Prisma ORM
- **DevOps**: Docker, AWS (S3, EC2, ECS, Lambda), CI/CD (GitHub Actions), Vercel

## Experience
### Senior Software Engineer | TechVantage Corp (2022 - Present)
- Led a team of 4 engineers to rebuild the enterprise dashboard in React and Next.js, resulting in a **40% increase in load speed** and **25% higher user retention**.
- Designed and implemented a serverless microservices backend in AWS Lambda and Node.js, reducing server operating costs by **30%**.
- Spearheaded the adoption of TypeScript across the company, leading to a **15% reduction in production bugs**.

### Software Engineer | InnovateTech Labs (2020 - 2022)
- Built and maintained several client-facing SaaS web applications utilizing Vue 3, Express, and PostgreSQL.
- Optimized database query performance, decreasing dashboard retrieval latency by **50%**.
- Implemented fully automated CI/CD pipelines via GitHub Actions, shortening deployment cycle times from days to minutes.

## Education
- **B.S. in Computer Science** | Stanford University (2016 - 2020)`;
  saveMasterCv();
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

.flex-editor {
  min-height: 100%;
}

.pane-preview-body {
  flex: 1;
  padding: var(--spacing-md);
  background-color: var(--colors-neutral);
}

.overflow-y-scroll {
  overflow-y: auto;
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
}

.editor-header-actions {
  display: flex;
  align-items: center;
}

.mr-6 {
  margin-right: 6px;
}

.validation-error {
  border: 1px solid var(--danger) !important;
  background-color: rgba(150, 75, 67, 0.03) !important;
}
</style>
