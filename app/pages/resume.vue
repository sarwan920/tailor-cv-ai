<template>
  <div class="flex flex-col gap-6 fade-in">
    <div class="step-instruction">
      <h2 class="text-[1.5rem] font-light text-primary">
        <span class="material-icons mr-2 text-secondary align-bottom">folder_open</span>
        Master Resume Editor
      </h2>
      <p class="text-[0.88rem] text-secondary mt-1">This is your baseline resume experience. AI will reference this text to re-write and highlight key competencies—nothing is fabricated or invented.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[68vh]">
      <!-- Write CV -->
      <div class="flex flex-col h-full overflow-hidden p-0 bg-surface border border-hairline rounded-lg">
        <div class="py-3.5 px-5 border-b border-hairline bg-surface flex items-center justify-between">
          <span class="font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary">Markdown / Plain Text</span>
          <div class="flex items-center">
            <BaseButton @click="triggerFileInput" variant="secondary" size="xs" class="flex-btn mr-1.5">
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
          class="w-full flex-1 bg-transparent border-none text-primary font-mono text-[0.88rem] p-5 leading-relaxed resize-none outline-none min-h-[240px] lg:min-h-full"
          :class="showValidationError && !masterCv.content.trim() ? 'border border-danger bg-danger/5' : ''"
          placeholder="Paste or write your master CV here..."
        ></textarea>
      </div>

      <!-- Preview CV -->
      <div class="flex flex-col h-full overflow-hidden p-0 bg-surface border border-hairline rounded-lg">
        <div class="py-3.5 px-5 border-b border-hairline bg-surface flex items-center justify-between">
          <span class="font-sans font-medium text-[0.72rem] uppercase tracking-[0.18em] text-secondary">Live CV Preview</span>
          <span class="font-sans text-[0.72rem] text-secondary">{{ getWordCount(masterCv.content) }} words</span>
        </div>
        <div class="flex-1 p-4 bg-neutral overflow-y-auto h-[320px] lg:h-auto">
          <div class="markdown-preview dark-preview" v-html="renderedMaster"></div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mt-2.5 border-t border-hairline pt-8">
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

function convertRawToMarkdown(text) {
  if (!text) return '';
  
  // Clean up carriage returns
  text = text.replace(/\r\n/g, '\n');
  
  let rawLines = text.split('\n');
  const sections = ['summary', 'experience', 'education', 'skills', 'projects', 'languages', 'certifications', 'adaptation logs'];
  
  // Find first few non-empty lines before any section headers
  let nonBriefLines = [];
  let headerIndexes = [];
  
  for (let i = 0; i < rawLines.length; i++) {
    const trimmed = rawLines[i].trim();
    if (trimmed) {
      const normalized = trimmed.toLowerCase().replace(/[^a-z]/g, '');
      if (sections.includes(normalized)) {
        break;
      }
      if (nonBriefLines.length < 3) {
        nonBriefLines.push(trimmed);
        headerIndexes.push(i);
      }
    }
  }
  
  let headerHtml = '';
  if (nonBriefLines.length >= 1) {
    let name = nonBriefLines[0].replace(/^#+\s*/, '').trim();
    let title = '';
    let contacts = '';
    
    // Check if the first line itself contains a separator (e.g. Name | Title)
    const separators = [' | ', ' - ', ' – '];
    let separatorUsed = separators.find(sep => name.includes(sep));
    if (separatorUsed) {
      let parts = name.split(separatorUsed);
      name = parts[0].trim();
      title = parts.slice(1).join(separatorUsed).trim();
      contacts = nonBriefLines[1] ? nonBriefLines[1].replace(/^#+\s*/, '').trim() : '';
      
      // Clear the original header lines in rawLines so they aren't parsed
      rawLines[headerIndexes[0]] = '';
      if (headerIndexes[1] !== undefined) {
        rawLines[headerIndexes[1]] = '';
      }
    } else {
      // Standard structure: Line 0 is Name
      title = nonBriefLines[1] ? nonBriefLines[1].replace(/^#+\s*/, '').trim() : '';
      
      // Check if second line is actually contacts instead of a job title
      const isContacts = /@|\+?\d[\d\s-]{6,}|\b(?:gmail|linkedin|github|netlify|portfolio)\b/i.test(title);
      if (isContacts) {
        contacts = title;
        title = '';
      } else {
        contacts = nonBriefLines[2] ? nonBriefLines[2].replace(/^#+\s*/, '').trim() : '';
      }
      
      // Clear the original header lines in rawLines so they aren't parsed
      rawLines[headerIndexes[0]] = '';
      if (headerIndexes[1] !== undefined) {
        rawLines[headerIndexes[1]] = '';
      }
      if (headerIndexes[2] !== undefined && !isContacts) {
        rawLines[headerIndexes[2]] = '';
      }
    }
    
    // Build clean HTML header block
    name = name.replace(/[\*_]/g, '').trim();
    title = title.replace(/[\*_]/g, '').trim();
    contacts = contacts.replace(/\*/g, '').trim();

    headerHtml = `<div class="resume-header-custom">` +
      `<div class="resume-name-custom">${name}</div>` +
      (title ? `<div class="resume-title-custom">${title}</div>` : '') +
      (contacts ? `<div class="resume-contacts-custom">${contacts}</div>` : '') +
      `</div>\n\n`;
  }
  
  // Process the rest of the lines normally
  let lines = rawLines;
  let foundFirstSection = false;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let trimmed = line.trim();
    if (!trimmed) continue;
    
    // Convert plain sections to markdown headers
    const normalized = trimmed.toLowerCase().replace(/[^a-z]/g, '');
    if (sections.includes(normalized)) {
      foundFirstSection = true;
      const leadingSpaces = line.match(/^\s*/)[0];
      lines[i] = leadingSpaces + '# ' + trimmed.replace(/^#+\s*/, '');
      continue;
    }

    // Clear horizontal rules occurring before the first section
    if (!foundFirstSection && /^[-*_]{3,}$/.test(trimmed)) {
      lines[i] = '';
      continue;
    }
    
    // Convert Unicode bullets • to markdown lists *
    if (trimmed.startsWith('•') || trimmed.startsWith('·')) {
      const leadingSpaces = line.match(/^\s*/)[0];
      lines[i] = leadingSpaces + '* ' + trimmed.substring(1).trim();
      continue;
    }
    
    // Convert lines with company name/title and date to markdown subheading ##
    if (
      (trimmed.includes(' – ') || trimmed.includes(' - ') || trimmed.includes(' | ')) && 
      (trimmed.toLowerCase().includes('remote') || trimmed.toLowerCase().includes('developer') || trimmed.toLowerCase().includes('engineer') || trimmed.toLowerCase().includes('manager') || trimmed.toLowerCase().includes('specialist') || /\b(19|20)\d{2}\b/.test(trimmed))
    ) {
      if (!trimmed.startsWith('#') && !trimmed.startsWith('*') && !trimmed.startsWith('-') && !trimmed.startsWith('1.') && !trimmed.startsWith('**')) {
        const leadingSpaces = line.match(/^\s*/)[0];
        lines[i] = leadingSpaces + '## ' + trimmed;
      }
    }
  }
  return headerHtml + lines.join('\n');
}

const renderedMaster = computed(() => {
  if (!masterCv.value.content) {
    return '<p style="color: var(--colors-secondary); font-style: italic;">A clean styled preview of your resume will be displayed here in real-time as you write...</p>';
  }
  return marked.parse(convertRawToMarkdown(masterCv.value.content));
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

