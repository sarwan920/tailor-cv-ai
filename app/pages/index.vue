<template>
  <div class="flex flex-col bg-neutral w-full fade-in">
    <!-- Hero Section -->
    <section 
      ref="heroSection"
      @mousemove="handleMouseMove"
      class="py-20 lg:py-24 px-0 bg-neutral border-b border-hairline relative overflow-hidden hero-section-grid"
    >
      <!-- Subtle Grid Pattern -->
      <div class="absolute inset-0 bg-grid-pattern opacity-80 dark:opacity-40 pointer-events-none z-0"></div>

      <!-- Interactive Hover Spotlight & Highlight Grid -->
      <div class="hero-spotlight"></div>
      <div class="hero-spotlight-grid"></div>

      <!-- Modern Ambient Glimmer/Glows -->
      <div class="absolute w-[600px] h-[600px] -left-[10%] -top-[20%] rounded-full bg-[radial-gradient(circle,rgba(0,212,164,0.12)_0%,rgba(0,212,164,0)_70%)] blur-[80px] pointer-events-none z-0"></div>
      <div class="absolute w-[500px] h-[500px] -right-[5%] bottom-0 rounded-full bg-[radial-gradient(circle,rgba(55,114,207,0.08)_0%,rgba(55,114,207,0)_70%)] blur-[80px] pointer-events-none z-0"></div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-[1200px] mx-auto px-8 relative z-10">
        <!-- Left Column: Copy & Actions -->
        <div class="text-center lg:text-left flex flex-col items-center lg:items-start self-center w-full">
          <div class="inline-flex items-center gap-2 border border-brand-green/30 bg-brand-green/10 py-1.5 px-3 rounded-full mb-4">
            <span class="w-1.5 h-1.5 bg-brand-green rounded-full"></span>
            <span class="font-sans text-[0.62rem] font-semibold tracking-[0.16em] uppercase text-primary">INTRODUCING VELLUM AI V1.0</span>
          </div>
          
          <h1 class="font-sans text-[2.5rem] lg:text-[3.8rem] font-bold tracking-tight leading-[1.05] text-primary mb-4 opacity-0 translate-y-4 animate-reveal-up [animation-delay:0.15s]">
            Refine your professional <span class="text-brand-green font-extrabold">narrative.</span>
          </h1>
          
          <p class="text-[0.98rem] leading-relaxed text-secondary mb-6 font-normal text-center lg:text-left opacity-0 translate-y-4 animate-reveal-up [animation-delay:0.35s]">
            An executive-grade CV adaptation engine designed for modern developers and architects. 
            Extract required keywords, align credentials with LinkedIn requisitions in real-time, and pass ATS checkpoints—with zero data fabrication.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full opacity-0 translate-y-4 animate-reveal-up [animation-delay:0.5s]">
            <BaseButton to="/resume" variant="primary" size="lg" liquid class="flex-btn">
              ENTER WORKSPACE &rarr;
            </BaseButton>
            <BaseButton to="#features" variant="secondary" size="lg" liquid class="flex-btn">
              EXPLORE FEATURES
            </BaseButton>
          </div>
        </div>
        
        <!-- Right Column: Interactive Product Mockup style container -->
        <div class="flex justify-center lg:justify-end items-center w-full relative self-center border border-hairline/40 rounded-lg p-2 bg-neutral/80 shadow-[rgba(0,0,0,0.12)_0px_24px_48px_-8px]">
          <ResumePipelineAnim :pipelineState="pipelineState" :atsScore="atsScore" />
        </div>
      </div>
    </section>

    <!-- Seamless Infinite Logo Marquee Section -->
    <section class="w-full py-8 bg-surface border-t border-b border-secondary/25 overflow-hidden text-center no-print">
      <div class="max-w-[1200px] mx-auto px-8">
        <div class="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-secondary mb-6">TRUSTED COMPATIBILITY WITH 10+ CORPORATE ATS PARSING ENGINES</div>
        <div class="relative w-full overflow-hidden flex items-center py-2 after:content-[''] after:absolute after:top-0 after:right-0 after:w-[15%] after:h-full after:bg-[linear-gradient(to_left,var(--color-surface),transparent)] after:z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[15%] before:h-full before:bg-[linear-gradient(to_right,var(--color-surface),transparent)] before:z-10">
          <div class="flex gap-10 w-max animate-marquee-scroll">
            <!-- First set -->
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-workday">cloud_queue</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">Workday</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-success">park</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">Greenhouse</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-primary">tune</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">Lever</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-[#E84D2A]">blur_on</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">Oracle Taleo</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-[#007BB6]">filter_tilt_shift</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">iCIMS</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-[#84BD00]">spa</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">BambooHR</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-[#00A651]">auto_awesome_mosaic</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">SmartRecruiters</span>
            </div>
            
            <!-- Second duplicated set for seamless looping -->
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-workday">cloud_queue</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">Workday</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-success">park</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">Greenhouse</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-primary">tune</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">Lever</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-[#E84D2A]">blur_on</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">Oracle Taleo</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-[#007BB6]">filter_tilt_shift</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">iCIMS</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-[#84BD00]">spa</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">BambooHR</span>
            </div>
            <div class="flex items-center gap-2.5 bg-neutral border border-secondary/25 rounded-sm py-2 px-5 hover:border-primary hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
              <span class="material-icons text-[16px]! text-[#00A651]">auto_awesome_mosaic</span>
              <span class="font-sans text-[0.75rem] font-semibold tracking-[0.08em] text-primary uppercase whitespace-nowrap">SmartRecruiters</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Metrics Stats Section -->
    <section class="py-10 lg:py-20">
      <div class="max-w-[1200px] mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-8 bg-surface border border-secondary/25 rounded-lg scroll-reveal premium-card-3d">
            <span class="font-sans text-[3rem] font-light text-primary block mb-1 extrude-child metric-num">99.4%</span>
            <span class="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-secondary block mb-3 extrude-child">ATS Parse Success</span>
            <p class="text-[0.85rem] text-secondary leading-relaxed">Perfect compatibility with standard parsing engines (Workday, Greenhouse, Taleo).</p>
          </div>
          <div class="text-center p-8 bg-surface border border-secondary/25 rounded-lg scroll-reveal premium-card-3d reveal-delay-1">
            <span class="font-sans text-[3rem] font-light text-primary block mb-1 extrude-child metric-num">2.4x</span>
            <span class="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-secondary block mb-3 extrude-child">More Interview Invites</span>
            <p class="text-[0.85rem] text-secondary leading-relaxed">Rephrased competencies immediately signal your relevance to hiring managers.</p>
          </div>
          <div class="text-center p-8 bg-surface border border-secondary/25 rounded-lg scroll-reveal premium-card-3d reveal-delay-2">
            <span class="font-sans text-[3rem] font-light text-primary block mb-1 extrude-child metric-num">0%</span>
            <span class="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-secondary block mb-3 extrude-child">Fabricated Data</span>
            <p class="text-[0.85rem] text-secondary leading-relaxed">A strict fact-faithful translation policy. We optimize representation, never invent history.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-surface border-t border-b border-secondary/25">
      <div class="max-w-[1200px] mx-auto px-8">
        <div class="text-center max-w-[680px] mx-auto mb-16 scroll-reveal">
          <span class="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-secondary block mb-3">Capabilities</span>
          <h2 class="text-[2.2rem] font-light text-primary mb-4">Architected for clarity. Built for conversion.</h2>
          <p class="text-[0.95rem] text-secondary leading-relaxed">Traditional resume builders generate bloated templates. We focus on semantic optimization and high-fidelity output.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-8 bg-neutral border border-secondary/25 rounded-lg scroll-reveal premium-card-3d">
            <div class="w-11 h-11 rounded border border-secondary bg-surface flex items-center justify-center mb-6 transition-transform duration-500 extrude-child feature-icon-wrapper">
              <span class="material-icons text-tertiary text-[20px] transition-transform duration-300 feature-icon">auto_awesome</span>
            </div>
            <h4 class="text-[1.15rem] font-normal mb-3 text-primary extrude-child">Fact-Faithful Translation</h4>
            <p class="text-[0.88rem] text-secondary leading-relaxed">Our custom-tuned Gemini prompts rewrite accomplishments to match job qualifications without fabricating skills, education, or companies.</p>
          </div>

          <div class="p-8 bg-neutral border border-secondary/25 rounded-lg scroll-reveal premium-card-3d reveal-delay-1">
            <div class="w-11 h-11 rounded border border-secondary bg-surface flex items-center justify-center mb-6 transition-transform duration-500 extrude-child feature-icon-wrapper">
              <span class="material-icons text-tertiary text-[20px] transition-transform duration-300 feature-icon">analytics</span>
            </div>
            <h4 class="text-[1.15rem] font-normal mb-3 text-primary extrude-child">Real-time ATS Keyword Mapping</h4>
            <p class="text-[0.88rem] text-secondary leading-relaxed">Paste any LinkedIn or Indeed job description. The AI parses required skills, matching and highlighting your existing expertise dynamically.</p>
          </div>

          <div class="p-8 bg-neutral border border-secondary/25 rounded-lg scroll-reveal premium-card-3d reveal-delay-2">
            <div class="w-11 h-11 rounded border border-secondary bg-surface flex items-center justify-center mb-6 transition-transform duration-500 extrude-child feature-icon-wrapper">
              <span class="material-icons text-tertiary text-[20px] transition-transform duration-300 feature-icon">tune</span>
            </div>
            <h4 class="text-[1.15rem] font-normal mb-3 text-primary extrude-child">Interactive Custom Directives</h4>
            <p class="text-[0.88rem] text-secondary leading-relaxed">Fine-tune the output tone to your exact standard. Request an "Executive Tone," double down on "Cloud Metrics," or restrict length easily.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="workflow" class="py-24">
      <div class="max-w-[1200px] mx-auto px-8">
        <div class="text-center max-w-[680px] mx-auto mb-16 scroll-reveal">
          <span class="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-secondary block mb-3">System Architecture</span>
          <h2 class="text-[2.2rem] font-light text-primary mb-4">Three steps to your next interview.</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div class="flex flex-col gap-4 relative group scroll-reveal workflow-step">
            <div class="w-11 h-11 rounded-full border border-primary flex items-center justify-center font-sans text-[0.85rem] font-medium text-primary bg-surface transition-all duration-300 step-num-badge">01</div>
            <div class="step-content">
              <h5 class="text-[1.05rem] font-medium mb-2 text-primary">Define Your Master Narrative</h5>
              <p class="text-[0.88rem] text-secondary leading-relaxed">Input your baseline career history, education, and technologies into our markdown editor. This acts as your secure master database.</p>
            </div>
          </div>

          <div class="flex flex-col gap-4 relative group scroll-reveal reveal-delay-1 workflow-step">
            <div class="w-11 h-11 rounded-full border border-primary flex items-center justify-center font-sans text-[0.85rem] font-medium text-primary bg-surface transition-all duration-300 step-num-badge">02</div>
            <div class="step-content">
              <h5 class="text-[1.05rem] font-medium mb-2 text-primary">Sync Target Job Requisition</h5>
              <p class="text-[0.88rem] text-secondary leading-relaxed">Paste the text specifications of the job you want. The AI instantly extracts the target skills, requirements, and keywords.</p>
            </div>
          </div>

          <div class="flex flex-col gap-4 relative group scroll-reveal reveal-delay-2 workflow-step">
            <div class="w-11 h-11 rounded-full border border-primary flex items-center justify-center font-sans text-[0.85rem] font-medium text-primary bg-surface transition-all duration-300 step-num-badge">03</div>
            <div class="step-content">
              <h5 class="text-[1.05rem] font-medium mb-2 text-primary">Refine & Print in Matte Studio</h5>
              <p class="text-[0.88rem] text-secondary leading-relaxed">Compare the side-by-side original and tailored resume, review the integrated keyword scorecard, and export a clean PDF instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-24 lg:py-36 bg-surface border-t border-secondary/25">
      <div class="max-w-[1200px] mx-auto px-8">
        <div class="text-center max-w-[680px] mx-auto mb-16 scroll-reveal">
          <span class="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-secondary block mb-3">Investment</span>
          <h2 class="text-[2.2rem] font-light text-primary mb-4">Transparent pricing for serious builders.</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <!-- Free Plan -->
          <div class="p-10 bg-neutral border border-secondary/25 rounded-lg flex flex-col justify-between relative scroll-reveal premium-card-3d">
            <div>
              <div class="border-b border-secondary/25 pb-6 mb-6 text-center extrude-child">
                <span class="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-secondary block mb-3">Core Baseline</span>
                <span class="font-sans text-[3.2rem] font-light leading-none text-primary block mb-3">$0</span>
                <span class="text-[0.82rem] text-secondary leading-relaxed">For developers preparing their initial outline.</span>
              </div>
              <ul class="list-none flex flex-col gap-3 mb-8">
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-[16px] text-secondary">check</span>
                  1 Master Resume Profile
                </li>
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-[16px] text-secondary">check</span>
                  Manual Markdown Editor
                </li>
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-[16px] text-secondary">check</span>
                  Live Side-by-Side Preview
                </li>
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-[16px] text-secondary">check</span>
                  Standard PDF Export
                </li>
              </ul>
            </div>
            <BaseButton to="/resume" variant="secondary" liquid class="w-full mt-6">
              Get Started
            </BaseButton>
          </div>

          <!-- Pro Plan -->
          <div class="p-10 bg-surface border border-primary rounded-lg flex flex-col justify-between relative scroll-reveal reveal-delay-1 premium-card-3d popular-card">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 translate-z-[1px] bg-primary text-on-primary font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] py-1 px-3 rounded-full transition-transform duration-500 z-10 pricing-badge">Recommended</div>
            <div>
              <div class="border-b border-secondary/25 pb-6 mb-6 text-center extrude-child">
                <span class="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-secondary block mb-3">Matte Studio Pro</span>
                <span class="font-sans text-[3.2rem] font-light leading-none text-primary block mb-3">$9<span class="text-[1rem] text-secondary font-normal">/mo</span></span>
                <span class="text-[0.82rem] text-secondary leading-relaxed">For active job seekers targeting multiple roles.</span>
              </div>
              <ul class="list-none flex flex-col gap-3 mb-8">
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-tertiary text-[16px]">check</span>
                  <strong>Unlimited</strong> Master Profiles
                </li>
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-tertiary text-[16px]">check</span>
                  <strong>Gemini AI</strong> Rephrasing Engine
                </li>
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-tertiary text-[16px]">check</span>
                  ATS Keyword Integration Scorecard
                </li>
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-tertiary text-[16px]">check</span>
                  Custom Tuning Guidelines & Directives
                </li>
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-tertiary text-[16px]">check</span>
                  Priority Adaptation Log History
                </li>
              </ul>
            </div>
            <BaseButton to="/resume" variant="primary" liquid class="w-full mt-6">
              Unlock Studio Pro
            </BaseButton>
          </div>

          <!-- Enterprise Plan -->
          <div class="p-10 bg-neutral border border-secondary/25 rounded-lg flex flex-col justify-between relative scroll-reveal reveal-delay-2 premium-card-3d">
            <div>
              <div class="border-b border-secondary/25 pb-6 mb-6 text-center extrude-child">
                <span class="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-secondary block mb-3">Corporate</span>
                <span class="font-sans text-[3.2rem] font-light leading-none text-primary block mb-3">Custom</span>
                <span class="text-[0.82rem] text-secondary leading-relaxed">For recruitment teams and career agencies.</span>
              </div>
              <ul class="list-none flex flex-col gap-3 mb-8">
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-[16px] text-secondary">check</span>
                  API Integrations
                </li>
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-[16px] text-secondary">check</span>
                  Batch Candidate Tailoring
                </li>
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-[16px] text-secondary">check</span>
                  Custom Brand Templates
                </li>
                <li class="text-[0.88rem] text-primary flex items-center gap-2">
                  <span class="material-icons text-[16px] text-secondary">check</span>
                  Dedicated Support
                </li>
              </ul>
            </div>
            <BaseButton to="mailto:support@cvtailorai.com" variant="secondary" liquid class="w-full mt-6">
              Contact Sales
            </BaseButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

definePageMeta({
  layout: 'default'
});

const heroSection = ref(null);

function handleMouseMove(e) {
  if (!heroSection.value) return;
  const rect = heroSection.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  heroSection.value.style.setProperty('--mouse-x', `${x}px`);
  heroSection.value.style.setProperty('--mouse-y', `${y}px`);
}

const pipelineState = ref('original'); // 'original' | 'parsing' | 'mapping' | 'success'
const atsScore = ref(45);

let loopInterval = null;
let scoreTimer = null;

// Synced animation loop
function startPipelineLoop() {
  const cycleDuration = 9000; // 9 seconds cycles
  
  const runCycle = () => {
    // 1. Initial State (0s - 2.5s)
    pipelineState.value = 'original';
    atsScore.value = 45;
    
    // 2. Start Parsing (at 2.5s)
    setTimeout(() => {
      pipelineState.value = 'parsing';
      
      // 3. Start Semantic Mapping (at 4s)
      setTimeout(() => {
        pipelineState.value = 'mapping';
        
        // Count up score smoothly from 45% to 98%
        const startScore = 45;
        const endScore = 98;
        const steps = 30;
        const stepDuration = 2000 / steps;
        let currentStep = 0;
        
        if (scoreTimer) clearInterval(scoreTimer);
        scoreTimer = setInterval(() => {
          currentStep++;
          if (currentStep >= steps) {
            clearInterval(scoreTimer);
            atsScore.value = endScore;
          } else {
            atsScore.value = Math.floor(startScore + (endScore - startScore) * (currentStep / steps));
          }
        }, stepDuration);
        
      }, 1500);

      // 4. Adaptation Success (at 6s)
      setTimeout(() => {
        pipelineState.value = 'success';
        atsScore.value = 98;
      }, 3500);
      
    }, 2500);
  };

  runCycle();
  loopInterval = setInterval(runCycle, cycleDuration);
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });

  startPipelineLoop();
});

onUnmounted(() => {
  if (loopInterval) clearInterval(loopInterval);
  if (scoreTimer) clearInterval(scoreTimer);
});
</script>

<style scoped>
.hero-section-grid {
  --mouse-x: -1000px;
  --mouse-y: -1000px;
}

.hero-spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    rgba(0, 212, 164, 0.12),
    transparent 80%
  );
}

.hero-spotlight-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
  background-image: 
    linear-gradient(to right, rgba(0, 212, 164, 0.2) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 212, 164, 0.2) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(
    300px circle at var(--mouse-x) var(--mouse-y),
    black 20%,
    transparent 80%
  );
  -webkit-mask-image: radial-gradient(
    300px circle at var(--mouse-x) var(--mouse-y),
    black 20%,
    transparent 80%
  );
}

.hero-section-grid:hover .hero-spotlight,
.hero-section-grid:hover .hero-spotlight-grid {
  opacity: 1;
}

.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, var(--color-hairline) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-hairline) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%);
}

/* Universal Scroll Reveal properties - Awwwards Inset Mask Wipe */
.scroll-reveal {
  opacity: 0;
  clip-path: inset(8% 0 8% 0);
  transform: scale(0.97) translateY(16px);
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
              clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.scroll-reveal.reveal-active {
  opacity: 1;
  clip-path: inset(-20px 0 -20px 0);
  transform: scale(1) translateY(0);
}

/* Staggered Delay offsets */
.reveal-delay-1 { transition-delay: 0.14s !important; }
.reveal-delay-2 { transition-delay: 0.28s !important; }
.reveal-delay-3 { transition-delay: 0.42s !important; }

/* Micro-Interaction: Focal Lens Focus Blur reveal on metric stats */
.metric-num {
  letter-spacing: -0.03em;
  filter: blur(4px);
  transition: letter-spacing 1.4s cubic-bezier(0.16, 1, 0.3, 1), 
              filter 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.scroll-reveal.reveal-active .metric-num {
  letter-spacing: 0;
  filter: blur(0);
}

/* ==========================================
   3D LAYERED CARD EXTRUSION SYSTEM
   ========================================== */
.premium-card-3d {
  transform-style: preserve-3d;
  transform: perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0);
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), 
              border-color 0.4s ease, 
              background-color 0.4s ease, 
              box-shadow 0.5s ease !important;
}

.premium-card-3d:hover {
  transform: perspective(800px) rotateX(5deg) rotateY(-5deg) translateY(-8px);
  border-color: var(--color-primary) !important;
  background-color: var(--color-card-hover) !important;
  box-shadow: 0 16px 40px rgba(27, 25, 23, 0.05) !important;
}

/* Layered child elements pushed further in Z space on hover */
.premium-card-3d .extrude-child {
  transform: translateZ(0px);
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), color 0.3s ease;
}

.premium-card-3d:hover .extrude-child {
  transform: translateZ(20px);
}

.premium-card-3d:hover .feature-icon-wrapper {
  transform: translateZ(25px) scale(1.05);
  box-shadow: 0 6px 16px rgba(27, 25, 23, 0.04);
}

.feature-card:hover .feature-icon {
  transform: scale(1.18) rotate(6deg);
  color: var(--color-primary);
}

.popular-card {
  box-shadow: 0 8px 30px rgba(95, 107, 86, 0.03) !important;
}

.popular-card:hover {
  box-shadow: 0 12px 36px rgba(95, 107, 86, 0.08) !important;
}

/* Dynamic workflow timeline indicators pulse */
.workflow-step:hover .step-num-badge {
  border-color: var(--color-success);
  background-color: var(--color-neutral);
  transform: scale(1.08);
}

/* Moving dotted connector lines representing AI flow */
.workflow-step:not(:last-child)::after {
  background: linear-gradient(90deg, var(--color-secondary) 60%, transparent 40%) !important;
  background-size: 8px 1px !important;
  animation: flow-line-dots 0.8s linear infinite !important;
}

@keyframes flow-line-dots {
  0% { background-position: 0px 0px; }
  100% { background-position: -8px 0px; }
}

@keyframes fade-in-scale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse-dot-ping {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.6); opacity: 1; }
}

/* Seamless Marquee Styles */
.marquee-logo-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.text-workday { color: #005CB9; }
.text-greenhouse { color: var(--color-success); }
.text-lever { color: var(--color-primary); }
.text-taleo { color: #E84D2A; }
.text-icims { color: #007BB6; }
.text-bamboohr { color: #84BD00; }
.text-smartrecruiters { color: #00A651; }

.price-cycle {
  font-size: 1rem;
  color: var(--color-secondary);
  font-weight: 400;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .hero-section-grid > div {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

@media (max-width: 900px) {
  .workflow-step:not(:last-child)::after {
    display: none;
  }
}
</style>
