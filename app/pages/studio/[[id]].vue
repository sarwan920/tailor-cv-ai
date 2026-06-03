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

      <!-- ATS Scorecard Dashboard Widget (Mintlify Featured Card style) -->
      <section class="p-4 md:py-4 md:px-8 bg-surface border-2 border-brand-green rounded-lg shadow-[rgba(0,212,164,0.08)_0px_8px_24px]">
        <div class="flex justify-between items-center border-b border-hairline pb-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
            <h4 class="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-secondary">ATS Compatibility Report</h4>
          </div>
          <span class="bg-brand-green text-primary font-sans font-bold text-[0.68rem] tracking-[0.18em] py-1 px-2.5 rounded-full">96% ATS MATCH RATING</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="border-r-0 md:border-r border-hairline pr-0 md:pr-6">
            <h5 class="font-sans font-semibold text-[0.72rem] uppercase tracking-[0.18em] text-secondary mb-2.5">Matched Competencies</h5>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="skill in tailoredAnalysis.matchedSkills" :key="skill" class="bg-neutral border border-hairline text-primary text-[0.72rem] font-medium py-1 px-2 rounded-md inline-flex items-center">
                <span class="material-icons mr-1 text-brand-green" style="font-size: 13px;">check_circle</span>
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="border-r-0 md:border-r border-hairline pr-0 md:pr-6">
            <h5 class="font-sans font-semibold text-[0.72rem] uppercase tracking-[0.18em] text-secondary mb-2.5">Integrated Keywords</h5>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="kw in tailoredAnalysis.keywordsHighlighted" :key="kw" class="bg-brand-tag/10 border border-brand-tag/20 text-brand-tag font-mono text-[0.7rem] py-0.5 px-1.5 rounded-sm">
                {{ kw }}
              </span>
            </div>
          </div>

          <div>
            <h5 class="font-sans font-semibold text-[0.72rem] uppercase tracking-[0.18em] text-secondary mb-2.5">Revisions Summary</h5>
            <ul class="pl-0 list-none flex flex-col gap-1.5">
              <li v-for="adj in tailoredAnalysis.adjustmentsMade" :key="adj" class="text-[0.78rem] text-primary leading-normal flex items-start">
                <span class="material-icons mr-1.5 text-brand-green" style="font-size: 11px; margin-top: 3px;">arrow_right</span>
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
          <div class="py-2.5 px-4 border-b border-hairline bg-surface flex flex-wrap items-center justify-between gap-3">
            <div class="flex bg-primary/5 p-0.5 rounded-md border border-hairline items-center overflow-x-auto max-w-full sm:max-w-[365px] no-scrollbar shrink-0">
              <button 
                @click="setTab('preview')" 
                class="bg-transparent border-none font-sans font-medium text-[0.65rem] uppercase tracking-[0.12em] py-1.5 px-2.5 rounded-sm text-secondary cursor-pointer transition-colors duration-150 hover:text-primary [&.active]:text-primary [&.active]:bg-surface [&.active]:shadow-[0_1px_3px_rgba(27,25,23,0.08)] shrink-0" 
                :class="{ active: rightTab === 'preview' }"
              >Preview</button>
              <button 
                @click="setTab('diff')" 
                class="bg-transparent border-none font-sans font-medium text-[0.65rem] uppercase tracking-[0.12em] py-1.5 px-2.5 rounded-sm text-secondary cursor-pointer transition-colors duration-150 hover:text-primary [&.active]:text-primary [&.active]:bg-surface [&.active]:shadow-[0_1px_3px_rgba(27,25,23,0.08)] shrink-0" 
                :class="{ active: rightTab === 'diff' }"
              >GitHub Diff</button>
              <button 
                @click="setTab('ats')" 
                class="bg-transparent border-none font-sans font-medium text-[0.65rem] uppercase tracking-[0.12em] py-1.5 px-2.5 rounded-sm text-secondary cursor-pointer transition-colors duration-150 hover:text-primary [&.active]:text-primary [&.active]:bg-surface [&.active]:shadow-[0_1px_3px_rgba(27,25,23,0.08)] shrink-0" 
                :class="{ active: rightTab === 'ats' }"
              >ATS Parser</button>
              <button 
                @click="setTab('edit')" 
                class="bg-transparent border-none font-sans font-medium text-[0.65rem] uppercase tracking-[0.12em] py-1.5 px-2.5 rounded-sm text-secondary cursor-pointer transition-colors duration-150 hover:text-primary [&.active]:text-primary [&.active]:bg-surface [&.active]:shadow-[0_1px_3px_rgba(27,25,23,0.08)] shrink-0" 
                :class="{ active: rightTab === 'edit' }"
              >Edit Markdown</button>
            </div>

            <div class="flex items-center gap-1.5 flex-wrap shrink-0">
              <span class="font-sans text-[0.72rem] text-secondary mr-2 hidden sm:inline shrink-0">{{ getWordCount(tailoredContent) }} words</span>
              
              <BaseButton @click="downloadMarkdown" variant="secondary" size="sm" class="w-7! h-7! p-0! inline-flex! items-center! justify-center! rounded-md! shrink-0!" title="Download Markdown (.md)">
                <span class="material-icons" style="font-size: 16px;">download</span>
              </BaseButton>

              <BaseButton @click="copyMarkdown" variant="secondary" size="sm" class="w-7! h-7! p-0! inline-flex! items-center! justify-center! rounded-md! shrink-0!" title="Copy Raw Markdown">
                <span class="material-icons" style="font-size: 16px;">code</span>
              </BaseButton>

              <BaseButton @click="copyRichText" variant="secondary" size="sm" class="w-7! h-7! p-0! inline-flex! items-center! justify-center! rounded-md! shrink-0!" title="Copy Formatted Rich Text (for Google Docs/Word)">
                <span class="material-icons" style="font-size: 16px;">content_paste_go</span>
              </BaseButton>

              <BaseButton @click="triggerPrint" variant="primary" size="sm" class="px-3! h-7! inline-flex! items-center! gap-1.5! rounded-md! whitespace-nowrap! shrink-0!" title="Download PDF / Print">
                <span class="material-icons" style="font-size: 16px;">picture_as_pdf</span>
                <span class="font-sans text-[0.68rem] uppercase tracking-wider font-semibold whitespace-nowrap">Download PDF</span>
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

            <!-- ATS Parser Simulator View -->
            <div v-show="rightTab === 'ats'" class="h-full overflow-y-auto p-4 bg-neutral flex flex-col gap-4">
              <!-- Validator Alerts -->
              <div class="p-3 bg-surface border border-secondary/25 rounded-md text-[0.8rem]">
                <div class="font-medium text-primary mb-2 flex items-center gap-1.5">
                  <span class="material-icons text-tertiary" style="font-size: 16px;">gavel</span>
                  ATS Parser Compliance Checklist
                </div>
                <ul class="flex flex-col gap-1.5 pl-0 list-none">
                  <li class="flex items-center gap-2 text-[0.75rem]" :class="atsChecks.hasContactInfo ? 'text-success' : 'text-danger'">
                    <span class="material-icons text-[14px]">{{ atsChecks.hasContactInfo ? 'check_circle' : 'warning' }}</span>
                    <span>Contact Info Header: {{ atsChecks.hasContactInfo ? 'Contact details isolated in the first 5 lines' : 'Missing email/phone in first 5 lines (ATS engines may fail to parse contact details)' }}</span>
                  </li>
                  <li class="flex items-center gap-2 text-[0.75rem]" :class="atsChecks.noTableMarkers ? 'text-success' : 'text-warning'">
                    <span class="material-icons text-[14px]">{{ atsChecks.noTableMarkers ? 'check_circle' : 'info' }}</span>
                    <span>Layout Stability: {{ atsChecks.noTableMarkers ? 'No structural HTML tables or markdown pipes' : 'Contains table grid layouts which might disrupt line flow in some parser engines' }}</span>
                  </li>
                  <li class="flex items-center gap-2 text-[0.75rem]" :class="atsChecks.wordCountHealthy ? 'text-success' : 'text-warning'">
                    <span class="material-icons text-[14px]">{{ atsChecks.wordCountHealthy ? 'check_circle' : 'warning' }}</span>
                    <span>Total Length: {{ atsChecks.wordCountHealthy ? 'Optimized size (400 - 1000 words)' : 'Word count outside standard 400-1000 guidelines' }}</span>
                  </li>
                </ul>
              </div>

              <!-- Plain Text Render -->
              <div class="flex-1 bg-surface border border-secondary/25 rounded-md p-4 overflow-y-auto font-mono text-[0.75rem] text-primary whitespace-pre-wrap select-all leading-normal" title="Click to copy all plain text">
                {{ atsPlainText }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resume Trust & Interview Readiness Console -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <!-- Left Pane: Trust & Integrity Guardrails (7 cols) -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="p-6 bg-surface border border-secondary/25 rounded-lg flex flex-col gap-5">
            <div class="flex items-center justify-between border-b border-secondary/25 pb-3">
              <h3 class="font-sans font-medium text-[0.95rem] uppercase tracking-[0.18em] text-primary flex items-center gap-2">
                <span class="material-icons text-secondary">security</span>
                AI & Factual Safety Console
              </h3>
              <span class="bg-transparent border text-secondary font-sans font-medium text-[0.62rem] tracking-[0.12em] py-0.5 px-2 rounded-sm border-secondary/40">REALTIME CHECK</span>
            </div>

            <!-- Double Grid: Factual Integrity & AI Shield -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Card 1: Factual Integrity Guardrail -->
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                  <span class="material-icons" :class="factualGuardrail.safe ? 'text-success' : 'text-warning'">
                    {{ factualGuardrail.safe ? 'verified_user' : 'report_problem' }}
                  </span>
                  <h4 class="font-sans font-semibold text-[0.82rem] uppercase tracking-[0.08em] text-primary">Factual Integrity</h4>
                </div>
                
                <p class="text-[0.78rem] text-secondary leading-relaxed">Cross-references numbers and skill keywords between original and tailored CVs to detect hallucinated AI metrics.</p>
                
                <div class="mt-2 flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                  <div v-if="factualGuardrail.safe" class="p-3 bg-success/8 text-success border border-success/20 rounded text-[0.75rem] flex items-start gap-1.5">
                    <span class="material-icons text-[14px] mt-0.5">check_circle</span>
                    <span>No unexplained metrics or skills found. All tailoring lines correspond directly with baseline CV.</span>
                  </div>
                  <template v-else>
                    <div v-for="num in factualGuardrail.hallucinatedNums" :key="'num-'+num" class="p-2.5 bg-warning/8 text-warning border border-warning/20 rounded text-[0.72rem] flex items-start gap-2">
                      <span class="material-icons text-[13px] mt-0.5">warning</span>
                      <span>Metric <strong>"{{ num }}"</strong> was introduced. Please verify that this quantitative impact matches your achievements.</span>
                    </div>
                    <div v-for="skill in factualGuardrail.hallucinatedSkills" :key="'skill-'+skill" class="p-2.5 bg-warning/8 text-warning border border-warning/20 rounded text-[0.72rem] flex items-start gap-2">
                      <span class="material-icons text-[13px] mt-0.5">warning</span>
                      <span>Skill <strong>"{{ skill }}"</strong> was added. Ensure you have working competency with this stack before sending.</span>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Card 2: AI Detection Shield -->
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                  <span class="material-icons" :class="aiShieldReport.level === 'High' ? 'text-danger' : (aiShieldReport.level === 'Medium' ? 'text-warning' : 'text-success')">
                    {{ aiShieldReport.level === 'High' ? 'analytics' : (aiShieldReport.level === 'Medium' ? 'bolt' : 'verified') }}
                  </span>
                  <h4 class="font-sans font-semibold text-[0.82rem] uppercase tracking-[0.08em] text-primary">AI Detection Shield</h4>
                </div>

                <p class="text-[0.78rem] text-secondary leading-relaxed">Scans vocabulary and sentence variance indicators. Resumes that read too uniform can trigger AI rejection filters.</p>

                <div class="mt-2 p-3 bg-neutral border border-secondary/25 rounded flex flex-col gap-2.5 text-[0.75rem]">
                  <div class="flex justify-between items-center">
                    <span class="text-secondary font-medium uppercase tracking-wider text-[0.68rem]">AI Likeness Risk:</span>
                    <span class="font-semibold px-2 py-0.5 rounded text-[0.68rem]" :class="aiShieldReport.level === 'High' ? 'bg-danger/12 text-danger' : (aiShieldReport.level === 'Medium' ? 'bg-warning/12 text-warning' : 'bg-success/12 text-success')">
                      {{ aiShieldReport.level }} Risk ({{ aiShieldReport.score }}%)
                    </span>
                  </div>

                  <div class="w-full bg-secondary/15 h-1.5 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-300" :class="aiShieldReport.level === 'High' ? 'bg-danger' : (aiShieldReport.level === 'Medium' ? 'bg-warning' : 'bg-success')" :style="{ width: aiShieldReport.score + '%' }"></div>
                  </div>

                  <div class="flex justify-between text-[0.7rem] text-secondary border-t border-secondary/15 pt-2">
                    <span>Burstiness (Variance): <strong>{{ aiShieldReport.sentenceVar }}</strong></span>
                    <span>Cliche count: <strong>{{ aiShieldReport.clichesFound.length }}</strong></span>
                  </div>

                  <div v-if="aiShieldReport.clichesFound.length > 0" class="text-[0.68rem] text-secondary leading-normal">
                    AI vocabulary flagged: 
                    <span v-for="cl in aiShieldReport.clichesFound" :key="cl.word" class="inline-block bg-primary/5 px-1 py-0.2 mx-0.5 rounded border border-secondary/15 text-[0.65rem] font-mono text-primary">
                      {{ cl.word }} (x{{ cl.count }})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Pane: Recruiter Grill Room Chatbot (5 cols) -->
        <div class="lg:col-span-5">
          <div class="p-6 bg-surface border border-secondary/25 rounded-lg flex flex-col gap-4 h-full min-h-[380px]">
            <div class="flex items-center justify-between border-b border-secondary/25 pb-3">
              <h3 class="font-sans font-medium text-[0.95rem] uppercase tracking-[0.18em] text-primary flex items-center gap-2">
                <span class="material-icons text-secondary">forum</span>
                Recruiter Grill Room
              </h3>
              <span class="bg-primary text-on-primary font-sans font-medium text-[0.6rem] tracking-[0.12em] py-0.5 px-1.5 rounded-sm">INTERVIEW PREP</span>
            </div>

            <!-- State 1: Choose Bullet to grill -->
            <div v-if="!grillQuestion && !isGrillLoading" class="flex-1 flex flex-col justify-center gap-3">
              <p class="text-[0.8rem] text-secondary leading-relaxed text-center mb-2">AI-tailored accomplishments look great on paper, but can you defend them verbally? Select a tailored point to simulate a tough recruiter inspection.</p>
              
              <div class="flex flex-col gap-2">
                <label class="block font-sans text-[0.68rem] font-medium uppercase tracking-wider text-secondary">Select a CV accomplishment:</label>
                <select v-model="selectedBullet" class="w-full bg-neutral border border-secondary/25 text-primary text-[0.82rem] p-2.5 rounded outline-none focus:border-primary">
                  <option value="" disabled>-- Choose a Bullet Point --</option>
                  <option v-for="(bullet, idx) in extractedBullets" :key="idx" :value="bullet">
                    {{ bullet.length > 80 ? bullet.slice(0, 80) + '...' : bullet }}
                  </option>
                </select>
              </div>

              <BaseButton @click="startGrill" :disabled="!selectedBullet" variant="primary" class="w-full flex-btn mt-2">
                <span class="material-icons">psychology</span>
                Start Mock Interview
              </BaseButton>
            </div>

            <!-- State 2: Active grill chat -->
            <div v-else class="flex-1 flex flex-col justify-between gap-3 overflow-hidden">
              <div class="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 text-[0.82rem] leading-relaxed">
                <!-- Bullet under review -->
                <div class="p-2.5 bg-neutral border-l-2 border-secondary rounded-r text-[0.75rem] text-secondary">
                  <strong>Selected point:</strong> "{{ selectedBullet }}"
                </div>

                <!-- Recruiter Question -->
                <div v-if="grillQuestion" class="flex gap-2">
                  <span class="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 text-[12px] font-semibold text-primary">R</span>
                  <div class="bg-neutral p-3 rounded-lg border border-secondary/25 text-primary font-serif italic">
                    "{{ grillQuestion }}"
                  </div>
                </div>

                <!-- AI Response / Grade -->
                <div v-if="grillCritique" class="flex flex-col gap-3 mt-1 border-t border-secondary/15 pt-3">
                  <div class="flex justify-between items-center bg-primary/5 p-2 rounded border border-secondary/15">
                    <span class="font-medium text-[0.78rem] text-primary">Readiness Grade:</span>
                    <span class="font-bold text-[0.98rem]" :class="grillCritique.score >= 8 ? 'text-success' : (grillCritique.score >= 5 ? 'text-warning' : 'text-danger')">
                      {{ grillCritique.score }}/10
                    </span>
                  </div>

                  <div class="flex flex-col gap-2">
                    <div class="text-[0.75rem]">
                      <strong class="text-success uppercase tracking-wider text-[0.62rem] block mb-0.5">Strengths:</strong>
                      <span class="text-secondary">{{ grillCritique.strengths }}</span>
                    </div>
                    <div class="text-[0.75rem]">
                      <strong class="text-danger uppercase tracking-wider text-[0.62rem] block mb-0.5">Weaknesses / Red Flags:</strong>
                      <span class="text-secondary">{{ grillCritique.weaknesses }}</span>
                    </div>
                    <div class="text-[0.75rem] bg-success/5 p-2.5 rounded border border-success/15 mt-1">
                      <strong class="text-success uppercase tracking-wider text-[0.62rem] block mb-0.5">Suggested Verbal Answer:</strong>
                      <span class="text-primary italic">"{{ grillCritique.suggestedAnswer }}"</span>
                    </div>
                  </div>
                </div>

                <!-- Loading State inside panel -->
                <div v-if="isGrillLoading" class="flex items-center justify-center py-6 gap-2 text-secondary">
                  <span class="material-icons animate-spin" style="font-size: 16px;">refresh</span>
                  <span>Recruiter is thinking...</span>
                </div>
              </div>

              <!-- Chat Input / Actions -->
              <div class="border-t border-secondary/25 pt-3 flex flex-col gap-2">
                <textarea 
                  v-if="grillQuestion && !grillCritique"
                  v-model="userGrillAnswer"
                  class="w-full bg-neutral border border-secondary/25 text-primary text-[0.82rem] p-2.5 rounded outline-none focus:border-primary resize-none h-[64px]"
                  placeholder="Type how you would explain this bullet..."
                  @keydown.enter.prevent="submitGrillAnswer"
                ></textarea>

                <div class="flex gap-2">
                  <BaseButton @click="resetGrill" variant="secondary" size="sm" class="flex-1 flex-btn">
                    <span class="material-icons">close</span>
                    {{ grillCritique ? 'Done' : 'Cancel' }}
                  </BaseButton>
                  <BaseButton 
                    v-if="grillQuestion && !grillCritique"
                    @click="submitGrillAnswer" 
                    :disabled="!userGrillAnswer.trim() || isGrillLoading"
                    variant="primary" 
                    size="sm"
                    class="flex-1 flex-btn"
                  >
                    <span class="material-icons">send</span>
                    Submit Answer
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invisible Direct Print Layout painted only during printing -->
    <div class="print-wrapper-offscreen">
      <div v-if="isPrintLayoutActive" class="print-mode-layout-only">
        <div class="markdown-preview" v-html="renderedPrintContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

definePageMeta({
  layout: 'dashboard'
});
import { marked } from 'marked';
import {
  useMasterCv,
  useTailoredResult,
  useTailoredContent,
  useTailoredAnalysis,
  useJobForm
} from '~/composables/useCvState';

const router = useRouter();
const route = useRoute();

const masterCv = useMasterCv();
const tailoredResult = useTailoredResult();
const tailoredContent = useTailoredContent();
const tailoredAnalysis = useTailoredAnalysis();

onMounted(() => {
  if (route.params.id) {
    loadTailoredCvFromId(route.params.id);
  }
});

async function loadTailoredCvFromId(cvId) {
  try {
    const data = await $fetch(`/api/history/${cvId}`);
    if (data) {
      tailoredResult.value = data;
      tailoredContent.value = data.tailoredContent;
      const form = useJobForm();
      form.value.jobTitle = data.jobTitle;
      form.value.company = data.company;
      form.value.jobDescription = data.jobDescription;
      
      try {
        tailoredAnalysis.value = JSON.parse(data.aiAnalysis || '{}');
      } catch {
        tailoredAnalysis.value = { matchedSkills: [], keywordsHighlighted: [], adjustmentsMade: [] };
      }
      
      // Load master CV if empty to render comparison panel
      if (!masterCv.value.content) {
        fetchMasterCv();
      }
    }
  } catch (err) {
    console.error('Error fetching tailored CV:', err);
    alert('Failed to load tailored CV from ID.');
  }
}

async function fetchMasterCv() {
  try {
    const data = await $fetch('/api/cv');
    if (data && data.length > 0) {
      masterCv.value = data[0];
    }
  } catch (err) {
    console.error('Error fetching master CV:', err);
  }
}

const rightTab = ref('preview');
const diffHtml = ref('');
const isPrintLayoutActive = ref(false);
const printContent = ref('');

const atsPlainText = computed(() => {
  if (!tailoredContent.value) return '';
  return tailoredContent.value
    .replace(/^#+\s+/gm, '')
    .replace(/[\*_]{1,3}([^\*_]+)[\*_]{1,3}/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/^\s*[\-\*_]{3,}\s*$/gm, '')
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
});

const atsChecks = computed(() => {
  const text = atsPlainText.value;
  const first5Lines = text.split('\n').slice(0, 5).join('\n').toLowerCase();
  
  const hasEmail = /[\w\.-]+@[\w\.-]+\.\w+/.test(first5Lines);
  const hasPhone = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(first5Lines);
  const hasContactInfo = hasEmail || hasPhone;
  
  const noTableMarkers = !/[\|]/.test(tailoredContent.value);
  const wordCount = getWordCount(tailoredContent.value);
  const wordCountHealthy = wordCount >= 400 && wordCount <= 1000;
  
  return {
    hasContactInfo,
    noTableMarkers,
    wordCountHealthy
  };
});

const factualGuardrail = computed(() => {
  const originalText = masterCv.value.content || '';
  const tailoredText = tailoredContent.value || '';
  
  const extractNumbers = (text) => {
    const regex = /(?:\d+(?:\.\d+)?%|\$\d+(?:\.\d+)?[kKmM]?|\b\d{2,}\b|\b\d+\+\b)/g;
    const matches = text.match(regex) || [];
    return new Set(matches.map(m => m.trim().toLowerCase()));
  };

  const originalNums = extractNumbers(originalText);
  const tailoredNums = extractNumbers(tailoredText);
  
  const hallucinatedNums = [];
  tailoredNums.forEach(num => {
    if (!originalNums.has(num)) {
      hallucinatedNums.push(num);
    }
  });

  const originalTextLower = originalText.toLowerCase();
  const hallucinatedSkills = [];
  
  const allSkillsToCheck = new Set([
    ...(tailoredAnalysis.value?.matchedSkills || []),
    ...(tailoredAnalysis.value?.keywordsHighlighted || [])
  ]);
  
  allSkillsToCheck.forEach(skill => {
    if (skill && skill.trim().length > 1) {
      const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp('\\b' + escapedSkill + '\\b', 'i');
      if (!regex.test(originalTextLower)) {
        hallucinatedSkills.push(skill);
      }
    }
  });

  return {
    hallucinatedNums,
    hallucinatedSkills,
    safe: hallucinatedNums.length === 0 && hallucinatedSkills.length === 0
  };
});

const aiShieldReport = computed(() => {
  const text = tailoredContent.value || '';
  if (!text) return { score: 0, level: 'Low', clichesFound: [], sentenceVar: 0 };
  
  const cliches = [
    'spearhead', 'spearheaded', 'leverage', 'leveraged', 'robust', 'synergy', 
    'synergized', 'orchestrate', 'orchestrated', 'streamline', 'streamlined',
    'dynamic', 'transformative', 'innovative', 'testament', 'tapestry'
  ];
  
  const clichesFound = [];
  cliches.forEach(cliche => {
    const count = (text.toLowerCase().match(new RegExp('\\b' + cliche + '\\b', 'g')) || []).length;
    if (count > 0) {
      clichesFound.push({ word: cliche, count });
    }
  });
  
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
  let sentenceVar = 0;
  if (sentences.length > 1) {
    const wordCounts = sentences.map(s => s.split(/\s+/).length);
    const mean = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
    const sqDiffs = wordCounts.map(wc => Math.pow(wc - mean, 2));
    sentenceVar = sqDiffs.reduce((a, b) => a + b, 0) / sqDiffs.length;
  }
  
  let score = 0;
  score += Math.min(clichesFound.length * 12, 50);
  
  if (sentenceVar < 10) {
    score += 50;
  } else if (sentenceVar < 25) {
    score += 30;
  } else if (sentenceVar < 45) {
    score += 10;
  }
  
  let level = 'Low';
  if (score > 60) level = 'High';
  else if (score > 30) level = 'Medium';
  
  return {
    score,
    level,
    clichesFound,
    sentenceVar: Math.round(sentenceVar),
    sentencesAnalyzed: sentences.length
  };
});

const selectedBullet = ref('');
const grillQuestion = ref('');
const userGrillAnswer = ref('');
const isGrillLoading = ref(false);
const grillCritique = ref(null);

const extractedBullets = computed(() => {
  if (!tailoredContent.value) return [];
  const lines = tailoredContent.value.split('\n');
  const bullets = [];
  lines.forEach(line => {
    const match = line.trim().match(/^[-*]\s+(.+)/);
    if (match && match[1].trim().length > 10) {
      const cleanBullet = match[1].replace(/[\*_]/g, '').trim();
      bullets.push(cleanBullet);
    }
  });
  return bullets;
});

async function startGrill() {
  if (!selectedBullet.value) return;
  grillQuestion.value = '';
  userGrillAnswer.value = '';
  grillCritique.value = null;
  isGrillLoading.value = true;
  
  const geminiApiKey = localStorage.getItem('gemini_api_key') || '';
  
  try {
    const response = await $fetch('/api/grill', {
      method: 'POST',
      body: {
        bulletPoint: selectedBullet.value,
        geminiApiKey
      }
    });
    grillQuestion.value = response.question;
  } catch (err) {
    alert('Failed to generate interview question: ' + (err.statusMessage || err.message));
  } finally {
    isGrillLoading.value = false;
  }
}

async function submitGrillAnswer() {
  if (!userGrillAnswer.value.trim()) return;
  isGrillLoading.value = true;
  grillCritique.value = null;
  
  const geminiApiKey = localStorage.getItem('gemini_api_key') || '';
  
  try {
    const response = await $fetch('/api/grill', {
      method: 'POST',
      body: {
        bulletPoint: selectedBullet.value,
        question: grillQuestion.value,
        userResponse: userGrillAnswer.value,
        geminiApiKey
      }
    });
    grillCritique.value = response;
  } catch (err) {
    alert('Failed to grade answer: ' + (err.statusMessage || err.message));
  } finally {
    isGrillLoading.value = false;
  }
}

function resetGrill() {
  selectedBullet.value = '';
  grillQuestion.value = '';
  userGrillAnswer.value = '';
  grillCritique.value = null;
}

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
  if (!masterCv.value.content) return '<p style="color: var(--colors-secondary); font-style: italic;">No master resume loaded...</p>';
  return marked.parse(convertRawToMarkdown(masterCv.value.content));
});

const renderedTailored = computed(() => {
  return marked.parse(convertRawToMarkdown(tailoredContent.value || ''));
});

const renderedPrintContent = computed(() => {
  return marked.parse(convertRawToMarkdown(printContent.value || ''));
});

function downloadMarkdown() {
  const element = document.createElement('a');
  const file = new Blob([tailoredContent.value], {type: 'text/markdown'});
  element.href = URL.createObjectURL(file);
  const companyName = (useJobForm().value.company || 'Tailored').replace(/[^a-zA-Z0-9]/g, '_');
  const jobTitle = (useJobForm().value.jobTitle || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
  element.download = `CV_${companyName}_${jobTitle}.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

async function copyMarkdown() {
  try {
    await navigator.clipboard.writeText(tailoredContent.value);
    alert('Raw Markdown copied to clipboard!');
  } catch {
    alert('Failed to copy.');
  }
}

async function copyRichText() {
  try {
    const htmlContent = marked.parse(convertRawToMarkdown(tailoredContent.value || ''));
    const wrappedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333333; }
          h1 { font-size: 20pt; border-bottom: 2px solid #111; padding-bottom: 3px; margin-bottom: 12px; }
          h2 { font-size: 13pt; border-bottom: 1px solid #777; padding-bottom: 2px; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
          p, li { margin-bottom: 5px; }
          ul { margin-bottom: 8px; padding-left: 20px; }
          strong { font-weight: bold; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    const blobHtml = new Blob([wrappedHtml], { type: 'text/html' });
    const blobText = new Blob([tailoredContent.value], { type: 'text/plain' });
    const item = new ClipboardItem({
      'text/html': blobHtml,
      'text/plain': blobText
    });
    
    await navigator.clipboard.write([item]);
    alert('Formatted Rich Text copied! You can paste directly into Microsoft Word or Google Docs.');
  } catch (err) {
    console.error('Failed to copy rich text:', err);
    try {
      await navigator.clipboard.writeText(tailoredContent.value);
      alert('Rich text copy failed. Raw Markdown copied to clipboard instead.');
    } catch {
      alert('Failed to copy.');
    }
  }
}

function triggerPrint() {
  let content = tailoredContent.value || '';
  
  // Clean up contact details: find lines with bullet points and normalize them
  // E.g., replace multiple bullets or bullets with missing spaces
  content = content.replace(/•+/g, ' • ');
  content = content.replace(/\s*•\s*/g, '  •  ');
  
  // Trim the first few lines to ensure headers align correctly
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const trimmed = lines[i].trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('*') && !trimmed.startsWith('-') && !trimmed.startsWith('1.')) {
      lines[i] = trimmed;
    }
  }
  content = lines.join('\n');

  printContent.value = content;
  isPrintLayoutActive.value = true;

  // Dynamically load html2pdf.js if not already loaded
  if (typeof html2pdf === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      nextTick(() => {
        generateDirectPDF();
      });
    };
    script.onerror = () => {
      console.error('Failed to load html2pdf.js, falling back to window.print()');
      window.print();
      isPrintLayoutActive.value = false;
    };
    document.head.appendChild(script);
  } else {
    nextTick(() => {
      generateDirectPDF();
    });
  }
}

function generateDirectPDF() {
  const element = document.querySelector('.print-mode-layout-only');
  if (!element) {
    isPrintLayoutActive.value = false;
    return;
  }
  
  const companyName = (useJobForm().value.company || 'Tailored').replace(/[^a-zA-Z0-9]/g, '_');
  const jobTitle = (useJobForm().value.jobTitle || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
  
  const opt = {
    margin:       0, // Zero margin so CSS padding dictates margins perfectly without doubling
    filename:     `CV_${companyName}_${jobTitle}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { 
      scale: 2.2, // High resolution density
      useCORS: true, 
      letterRendering: true,
      logging: false,
      scrollY: 0, // Reset scroll offsets to fix pushed-down content bugs
      scrollX: 0
    },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save().then(() => {
    isPrintLayoutActive.value = false;
  }).catch((err) => {
    console.error('html2pdf generation failed, falling back to print:', err);
    window.print();
    isPrintLayoutActive.value = false;
  });
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

</style>

<style>
/* One-Page Direct Printing Styles - Scoped to .print-mode-layout-only */
.print-wrapper-offscreen {
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  width: 8.5in !important;
  height: 0 !important;
  overflow: visible !important;
  z-index: -9999 !important;
  pointer-events: none !important;
  display: block !important;
}

.print-mode-layout-only {
  position: relative !important; /* Standard layout flow for perfect html2canvas capture */
  width: 8.5in !important; /* Full Letter page width */
  background: #FFFFFF !important;
  color: #111111 !important;
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0.3in 0.45in !important; /* Tighter margins to maximize vertical space */
  display: block !important;
}

.print-mode-layout-only .markdown-preview {
  font-family: 'Inter', sans-serif !important;
  font-size: 9pt !important;
  line-height: 1.22 !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
  background: #FFFFFF !important;
  color: #111111 !important;
}

/* Custom Resume Header Sizing & Alignment */
.print-mode-layout-only .resume-header-custom {
  text-align: center !important;
  margin-top: 0 !important;
  margin-bottom: 8pt !important;
  border-bottom: 0.5pt solid #dddddd !important;
  padding-bottom: 6pt !important;
}

.print-mode-layout-only .resume-name-custom {
  font-size: 16pt !important;
  font-weight: 700 !important;
  color: #000000 !important;
  line-height: 1.1 !important;
  margin-bottom: 2pt !important;
  text-transform: none !important;
}

.print-mode-layout-only .resume-title-custom {
  font-size: 10pt !important;
  font-weight: 600 !important;
  color: #444444 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  margin-bottom: 3pt !important;
}

.print-mode-layout-only .resume-contacts-custom {
  font-size: 8.5pt !important;
  color: #555555 !important;
  line-height: 1.3 !important;
}

/* Section Headings */
.print-mode-layout-only .markdown-preview h1 {
  font-size: 11pt !important;
  font-weight: 700 !important;
  margin-top: 10pt !important;
  margin-bottom: 4pt !important;
  padding-bottom: 2pt !important;
  border-bottom: 0.75pt solid #111111 !important;
  color: #000000 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.06em !important;
}

.print-mode-layout-only .markdown-preview h2 {
  font-size: 10.2pt !important;
  font-weight: 700 !important;
  margin-top: 8pt !important;
  margin-bottom: 3pt !important;
  border-bottom: 0.5pt solid #888888 !important;
  padding-bottom: 1.5pt !important;
  color: #000000 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.04em !important;
}

.print-mode-layout-only .markdown-preview p {
  font-size: 9pt !important;
  margin-top: 0 !important;
  margin-bottom: 3pt !important;
  color: #222222 !important;
  line-height: 1.22 !important;
}

/* Job entry styling helper: paragraph containing bold metadata */
.print-mode-layout-only .markdown-preview p > strong:first-child {
  font-size: 9.2pt !important;
  color: #000000 !important;
}

/* Lists and Bullet Points styling (resets Tailwind reset) */
.print-mode-layout-only .markdown-preview ul {
  list-style-type: disc !important;
  margin-top: 0 !important;
  margin-bottom: 4pt !important;
  padding-left: 13pt !important;
}

.print-mode-layout-only .markdown-preview ol {
  list-style-type: decimal !important;
  margin-top: 0 !important;
  margin-bottom: 4pt !important;
  padding-left: 13pt !important;
}

.print-mode-layout-only .markdown-preview li {
  font-size: 9pt !important;
  margin-bottom: 1.5pt !important;
  color: #222222 !important;
  line-height: 1.22 !important;
}

.print-mode-layout-only .markdown-preview strong {
  font-weight: 600 !important;
  color: #111111 !important;
}

.print-mode-layout-only .markdown-preview hr {
  margin: 6pt 0 !important;
  border: none !important;
  border-top: 0.5pt solid #dddddd !important;
}

@media print {
  /* Hide all interactive, dashboard, sidebar, and layout elements */
  header, aside, footer, .no-print {
    display: none !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }

  /* Force print wrapper to display and position at top left */
  .print-mode-layout-only,
  .print-mode-layout-only * {
    visibility: visible !important;
    display: block !important;
  }

  .print-mode-layout-only {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #FFFFFF !important;
    color: #000000 !important;
  }

  body, html {
    background: #FFFFFF !important;
    color: #000000 !important;
  }

  @page {
    size: portrait;
    margin: 0.25in 0.35in 0.25in 0.35in !important;
  }
}
</style>
