<template>
  <div class="marketing-page dot-matrix-bg fade-in">
    <!-- SVG Noise filter for film grain realism -->
    <svg style="display: none;">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.035 0" />
      </filter>
    </svg>
    <div class="noise-overlay"></div>

    <!-- Hero Section -->
    <section class="hero-section">
      <!-- Premium Ambient Glimmer behind copy -->
      <div class="left-ambient-glow"></div>

      <div class="hero-grid">
        <!-- Left Column: Copy & Actions -->
        <div class="hero-content-left">
          <!-- Tiny floating magnetic AI tags -->
          <div class="floating-ai-tag ft-left-1"><span>● Fact-Faithful</span></div>
          <div class="floating-ai-tag ft-left-2"><span>● ATS Optimized</span></div>

          <div class="hero-pill">
            <span class="pill-dot"></span>
            <span class="pill-text">INTRODUCING CV TAILOR AI V1.0</span>
          </div>
          
          <h1 class="display-title display-title-futuristic">
            <span class="reveal-line rl-1">Refine your</span>
            <span class="reveal-line rl-2">professional</span>
            <span class="reveal-line rl-3">narrative.</span>
          </h1>
          
          <p class="hero-subtitle subtitle-fade-up">
            An executive-grade CV adaptation engine designed for modern developers and architects. 
            Extract required keywords, align credentials with LinkedIn requisitions in real-time, and pass ATS checkpoints—with zero data fabrication.
          </p>
          
          <div class="hero-actions actions-fade-up">
            <NuxtLink to="/resume" class="btn btn-primary btn-liquid btn-lg flex-btn">
              ENTER WORKSPACE &rarr;
            </NuxtLink>
            <a href="#features" class="btn btn-secondary btn-liquid btn-lg flex-btn">
              EXPLORE FEATURES
            </a>
          </div>
        </div>
        
        <!-- Right Column: Interactive Parallax 3D Mockup -->
        <div class="hero-graphic-right">
          <ResumePipelineAnim />
        </div>
      </div>
    </section>

    <!-- Metrics Stats Section -->
    <section class="metrics-section">
      <div class="section-container">
        <div class="metrics-grid">
          <div class="metric-card glass-panel premium-card-3d scroll-reveal">
            <span class="metric-num extrude-child">99.4%</span>
            <span class="metric-label extrude-child">ATS Parse Success</span>
            <p class="metric-desc">Perfect compatibility with standard parsing engines (Workday, Greenhouse, Taleo).</p>
          </div>
          <div class="metric-card glass-panel premium-card-3d scroll-reveal reveal-delay-1">
            <span class="metric-num extrude-child">2.4x</span>
            <span class="metric-label extrude-child">More Interview Invites</span>
            <p class="metric-desc">Rephrased competencies immediately signal your relevance to hiring managers.</p>
          </div>
          <div class="metric-card glass-panel premium-card-3d scroll-reveal reveal-delay-2">
            <span class="metric-num extrude-child">0%</span>
            <span class="metric-label extrude-child">Fabricated Data</span>
            <p class="metric-desc">A strict fact-faithful translation policy. We optimize representation, never invent history.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="section-container">
        <div class="section-header scroll-reveal">
          <span class="section-tag">Capabilities</span>
          <h2 class="section-title">Architected for clarity. Built for conversion.</h2>
          <p class="section-desc">Traditional resume builders generate bloated templates. We focus on semantic optimization and high-fidelity output.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card glass-panel premium-card-3d scroll-reveal">
            <div class="feature-icon-wrapper extrude-child">
              <span class="material-icons feature-icon">auto_awesome</span>
            </div>
            <h4 class="extrude-child">Fact-Faithful Translation</h4>
            <p>Our custom-tuned Gemini prompts rewrite accomplishments to match job qualifications without fabricating skills, education, or companies.</p>
          </div>

          <div class="feature-card glass-panel premium-card-3d scroll-reveal reveal-delay-1">
            <div class="feature-icon-wrapper extrude-child">
              <span class="material-icons feature-icon">analytics</span>
            </div>
            <h4 class="extrude-child">Real-time ATS Keyword Mapping</h4>
            <p>Paste any LinkedIn or Indeed job description. The AI parses required skills, matching and highlighting your existing expertise dynamically.</p>
          </div>

          <div class="feature-card glass-panel premium-card-3d scroll-reveal reveal-delay-2">
            <div class="feature-icon-wrapper extrude-child">
              <span class="material-icons feature-icon">tune</span>
            </div>
            <h4 class="extrude-child">Interactive Custom Directives</h4>
            <p>Fine-tune the output tone to your exact standard. Request an "Executive Tone," double down on "Cloud Metrics," or restrict length easily.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="workflow" class="workflow-section">
      <div class="section-container">
        <div class="section-header scroll-reveal">
          <span class="section-tag">System Architecture</span>
          <h2 class="section-title">Three steps to your next interview.</h2>
        </div>

        <div class="workflow-timeline">
          <div class="workflow-step scroll-reveal">
            <div class="step-num-badge">01</div>
            <div class="step-content">
              <h5>Define Your Master Narrative</h5>
              <p>Input your baseline career history, education, and technologies into our markdown editor. This acts as your secure master database.</p>
            </div>
          </div>

          <div class="workflow-step scroll-reveal reveal-delay-1">
            <div class="step-num-badge">02</div>
            <div class="step-content">
              <h5>Sync Target Job Requisition</h5>
              <p>Paste the text specifications of the job you want. The AI instantly extracts the target skills, requirements, and keywords.</p>
            </div>
          </div>

          <div class="workflow-step scroll-reveal reveal-delay-2">
            <div class="step-num-badge">03</div>
            <div class="step-content">
              <h5>Refine & Print in Matte Studio</h5>
              <p>Compare the side-by-side original and tailored resume, review the integrated keyword scorecard, and export a clean PDF instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing-section">
      <div class="section-container">
        <div class="section-header scroll-reveal">
          <span class="section-tag">Investment</span>
          <h2 class="section-title">Transparent pricing for serious builders.</h2>
        </div>

        <div class="pricing-grid">
          <!-- Free Plan -->
          <div class="pricing-card glass-panel premium-card-3d scroll-reveal">
            <div class="pricing-header extrude-child">
              <span class="plan-name">Core Baseline</span>
              <span class="plan-price">$0</span>
              <span class="plan-desc">For developers preparing their initial outline.</span>
            </div>
            <ul class="plan-features">
              <li>
                <span class="material-icons">check</span>
                1 Master Resume Profile
              </li>
              <li>
                <span class="material-icons">check</span>
                Manual Markdown Editor
              </li>
              <li>
                <span class="material-icons">check</span>
                Live Side-by-Side Preview
              </li>
              <li>
                <span class="material-icons">check</span>
                Standard PDF Export
              </li>
            </ul>
            <NuxtLink to="/resume" class="btn btn-secondary btn-liquid w-100 mt-24">
              Get Started
            </NuxtLink>
          </div>

          <!-- Recommended Pro Plan (Single Tertiary Highlight Accent Button) -->
          <div class="pricing-card glass-panel popular-card premium-card-3d scroll-reveal reveal-delay-1">
            <div class="pricing-badge extrude-child">Recommended</div>
            <div class="pricing-header extrude-child">
              <span class="plan-name">Matte Studio Pro</span>
              <span class="plan-price">$9<span class="price-cycle">/mo</span></span>
              <span class="plan-desc">For active job seekers targeting multiple roles.</span>
            </div>
            <ul class="plan-features">
              <li>
                <span class="material-icons text-tertiary">check</span>
                <strong>Unlimited</strong> Master Profiles
              </li>
              <li>
                <span class="material-icons text-tertiary">check</span>
                <strong>Gemini AI</strong> Rephrasing Engine
              </li>
              <li>
                <span class="material-icons text-tertiary">check</span>
                ATS Keyword Integration Scorecard
              </li>
              <li>
                <span class="material-icons text-tertiary">check</span>
                Custom Tuning Guidelines & Directives
              </li>
              <li>
                <span class="material-icons text-tertiary">check</span>
                Priority Adaptation Log History
              </li>
            </ul>
            <NuxtLink to="/resume" class="btn btn-primary btn-liquid w-100 mt-24">
              Unlock Studio Pro
            </NuxtLink>
          </div>

          <!-- Enterprise Plan -->
          <div class="pricing-card glass-panel premium-card-3d scroll-reveal reveal-delay-2">
            <div class="pricing-header extrude-child">
              <span class="plan-name">Corporate</span>
              <span class="plan-price">Custom</span>
              <span class="plan-desc">For recruitment teams and career agencies.</span>
            </div>
            <ul class="plan-features">
              <li>
                <span class="material-icons">check</span>
                API Integrations
              </li>
              <li>
                <span class="material-icons">check</span>
                Batch Candidate Tailoring
              </li>
              <li>
                <span class="material-icons">check</span>
                Custom Brand Templates
              </li>
              <li>
                <span class="material-icons">check</span>
                Dedicated Support
              </li>
            </ul>
            <a href="mailto:support@cvtailorai.com" class="btn btn-secondary btn-liquid w-100 mt-24">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

definePageMeta({
  layout: 'default'
});

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
});
</script>

<style scoped>
.marketing-page {
  display: flex;
  flex-direction: column;
  background-color: var(--colors-neutral);
  width: 100%;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* Hero Styles */
.hero-section {
  padding: 80px 0 40px;
  background-color: var(--colors-neutral);
}

.hero-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: var(--spacing-lg);
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.hero-content-left {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  border: 1px solid rgba(27, 25, 23, 0.18);
  padding: 5px 12px;
  border-radius: 100px;
  margin-bottom: 24px;
}

.pill-dot {
  width: 5px;
  height: 5px;
  background-color: var(--colors-primary);
  border-radius: 50%;
}

.pill-text {
  font-family: var(--font-family);
  font-size: 0.62rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--colors-primary);
}

.left-ambient-glow {
  position: absolute;
  width: 450px;
  height: 450px;
  left: -12%;
  top: 0%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(140, 132, 122, 0.12) 0%, rgba(234, 230, 220, 0) 75%);
  filter: blur(45px);
  pointer-events: none;
  z-index: 0;
}

.floating-ai-tag {
  position: absolute;
  z-index: 5;
  pointer-events: none;
  animation: magnetic-drift 6s infinite ease-in-out alternate;
}

.floating-ai-tag span {
  font-family: var(--font-family);
  font-size: 0.55rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 100px;
  background-color: transparent;
  border: 1px solid rgba(27, 25, 23, 0.12);
  color: var(--colors-primary);
}

.ft-left-1 { top: -2%; left: 42%; animation-duration: 7s; }
.ft-left-2 { top: 68%; left: -8%; animation-duration: 8s; animation-delay: -2.2s; }

@keyframes magnetic-drift {
  0% { transform: translate(0, 0); }
  50% { transform: translate(8px, -10px); }
  100% { transform: translate(-6px, 4px); }
}

.display-title-futuristic {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 4.8rem !important;
  font-weight: 700;
  letter-spacing: -0.015em !important;
  line-height: 1.05 !important;
  color: var(--colors-primary);
  margin-bottom: 24px;
  position: relative;
  z-index: 2;
}

.reveal-line {
  display: block;
  opacity: 0;
  transform: translateY(28px);
  animation: reveal-up-anim 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.rl-1 { animation-delay: 0.15s; }
.rl-2 { animation-delay: 0.3s; }
.rl-3 { animation-delay: 0.45s; }

@keyframes reveal-up-anim {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-subtitle {
  font-size: 1.02rem;
  line-height: 1.7;
  color: var(--colors-secondary);
  margin-bottom: var(--spacing-lg);
  font-weight: 300;
  text-align: left;
}

.subtitle-fade-up {
  opacity: 0;
  transform: translateY(18px);
  animation: reveal-up-anim 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  animation-delay: 0.65s;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  width: 100%;
}

.actions-fade-up {
  opacity: 0;
  transform: translateY(18px);
  animation: reveal-up-anim 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  animation-delay: 0.8s;
}

.hero-graphic-right {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
}

/* Metrics Section */
.metrics-section {
  padding: 40px 0 80px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.metric-card {
  text-align: center;
  padding: var(--spacing-lg) !important;
}

.metric-num {
  font-family: var(--font-family);
  font-size: 3rem;
  font-weight: 300;
  color: var(--colors-primary);
  display: block;
  margin-bottom: 4px;
}

.metric-label {
  font-family: var(--font-family);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--colors-secondary);
  display: block;
  margin-bottom: 12px;
}

.metric-desc {
  font-size: 0.85rem;
  color: var(--colors-secondary);
  line-height: 1.6;
}

/* Section Header styling */
.section-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 60px;
}

.section-tag {
  font-family: var(--font-family);
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  color: var(--colors-secondary);
  display: block;
  margin-bottom: 12px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 300;
  color: var(--colors-primary);
  margin-bottom: 16px;
}

.section-desc {
  font-size: 0.95rem;
  color: var(--colors-secondary);
  line-height: 1.6;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  background-color: var(--colors-surface);
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.feature-card {
  padding: var(--spacing-lg) !important;
  background-color: var(--colors-neutral) !important;
  border-color: var(--border-light) !important;
}

.feature-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--colors-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.feature-icon {
  color: var(--colors-tertiary);
  font-size: 20px;
}

.feature-card h4 {
  font-size: 1.15rem;
  font-weight: 400;
  margin-bottom: 12px;
  color: var(--colors-primary);
}

.feature-card p {
  font-size: 0.88rem;
  color: var(--colors-secondary);
  line-height: 1.6;
}

/* Workflow Section */
.workflow-section {
  padding: 100px 0;
}

.workflow-timeline {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  position: relative;
}

.workflow-step {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.workflow-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 22px;
  right: -16px;
  width: 32px;
  height: 1px;
  background-color: var(--colors-secondary);
  opacity: 0.3;
}

.step-num-badge {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--colors-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--colors-primary);
  background-color: var(--colors-surface);
}

.step-content h5 {
  font-size: 1.05rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--colors-primary);
}

.step-content p {
  font-size: 0.88rem;
  color: var(--colors-secondary);
  line-height: 1.6;
}

/* Pricing Section */
.pricing-section {
  padding: 100px 0 140px;
  background-color: var(--colors-surface);
  border-top: 1px solid var(--border-light);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  align-items: stretch;
}

.pricing-card {
  padding: 40px var(--spacing-lg) !important;
  background-color: var(--colors-neutral) !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-color: var(--border-light) !important;
  position: relative;
}

.popular-card {
  border: 1px solid var(--colors-primary) !important;
  background-color: var(--colors-surface) !important;
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--colors-primary);
  color: var(--colors-on-primary);
  font-family: var(--font-family);
  font-size: 0.62rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  padding: 4px 12px;
  border-radius: 100px;
}

.pricing-header {
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 24px;
  margin-bottom: 24px;
  text-align: center;
}

.plan-name {
  font-family: var(--font-family);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--colors-secondary);
  display: block;
  margin-bottom: 12px;
}

.plan-price {
  font-family: var(--font-family);
  font-size: 3.2rem;
  font-weight: 300;
  line-height: 1;
  color: var(--colors-primary);
  display: block;
  margin-bottom: 12px;
}

.price-cycle {
  font-size: 1rem;
  color: var(--colors-secondary);
  font-weight: 400;
}

.plan-desc {
  font-size: 0.82rem;
  color: var(--colors-secondary);
  line-height: 1.5;
}

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.plan-features li {
  font-size: 0.88rem;
  color: var(--colors-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.plan-features li .material-icons {
  font-size: 16px;
  color: var(--colors-secondary);
}

.w-100 {
  width: 100%;
}

.mt-24 {
  margin-top: 24px;
}

/* Mobile Responsive */
@media (max-width: 900px) {
  .display-title {
    font-size: 2.5rem;
  }
  
  .hero-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    text-align: center;
  }

  .hero-content-left {
    text-align: center;
    align-items: center;
  }

  .hero-subtitle {
    text-align: center;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }

  .metrics-grid, 
  .features-grid, 
  .workflow-timeline, 
  .pricing-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .workflow-step:not(:last-child)::after {
    display: none;
  }
}

/* ==========================================
   SCROLL REVEAL & MICRO-ANIMATION SYSTEMS
   ========================================== */

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
  clip-path: inset(0% 0 0% 0);
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
  border-color: var(--colors-primary) !important;
  background-color: #FFFFFF !important;
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

/* Specific extrusions details */
.feature-icon-wrapper {
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
}

.premium-card-3d:hover .feature-icon-wrapper {
  transform: translateZ(25px) scale(1.05);
  box-shadow: 0 6px 16px rgba(27, 25, 23, 0.04);
}

.feature-icon {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.18) rotate(6deg);
  color: var(--colors-primary);
}

.popular-card {
  box-shadow: 0 8px 30px rgba(95, 107, 86, 0.03) !important;
}

.popular-card:hover {
  box-shadow: 0 12px 36px rgba(95, 107, 86, 0.08) !important;
}

/* Dynamic workflow timeline indicators pulse */
.step-num-badge {
  transition: border-color 0.3s ease, background-color 0.3s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.workflow-step:hover .step-num-badge {
  border-color: var(--success);
  background-color: var(--colors-neutral);
  transform: scale(1.08);
}

/* Moving dotted connector lines representing AI flow */
.workflow-step:not(:last-child)::after {
  background: linear-gradient(90deg, var(--colors-secondary) 60%, transparent 40%) !important;
  background-size: 8px 1px !important;
  animation: flow-line-dots 0.8s linear infinite !important;
}

@keyframes flow-line-dots {
  0% { background-position: 0px 0px; }
  100% { background-position: -8px 0px; }
}

</style>
