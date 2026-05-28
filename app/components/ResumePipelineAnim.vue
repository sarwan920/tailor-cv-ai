<template>
  <div class="animation-viewport">
    
    <!-- Compact Floating Decorative Tech Badges -->
    <div class="decor-badge b1"><span>AWS ECS</span></div>
    <div class="decor-badge b2"><span>98% ATS Rank</span></div>
    <div class="decor-badge b3"><span>Terraform</span></div>

    <!-- The Compact A4 Document Card Container -->
    <div class="a4-document-container">
      
      <!-- Synchronized Glowing Vertical Scan Line -->
      <div class="scanner-bar">
        <div class="laser-glow"></div>
        <div class="laser-dot dot-top"></div>
        <div class="laser-dot dot-bottom"></div>
      </div>

      <!-- LAYER 1: ORIGINAL (Underneath layer - Right side of scan) -->
      <div class="document-layer layer-original">
        <div class="a4-page">
          <!-- Page Header -->
          <div class="a4-header">
            <div class="profile-block">
              <div class="avatar-outline">AC</div>
              <div class="meta-block">
                <h3 class="original-title">Alex Carter</h3>
                <p class="subtitle-weak">Developer</p>
              </div>
            </div>
            <div class="stats-badge-weak">
              <span class="score-num-weak">45%</span>
              <span class="score-lbl-weak">ATS</span>
            </div>
          </div>

          <div class="a4-divider"></div>

          <!-- Section: Professional Summary -->
          <div class="a4-section">
            <h4 class="section-heading-weak">Professional Profile</h4>
            <p class="text-weak highlighted-weak-bg">
              Experienced developer responsible for deploying microservices and writing cloud scripts. Worked on database updates and maintenance.
            </p>
          </div>

          <!-- Section: Technical Skills -->
          <div class="a4-section">
            <h4 class="section-heading-weak">Technical Skills</h4>
            <div class="pills-row-weak">
              <span class="pill-weak">Java</span>
              <span class="pill-weak">Python</span>
              <span class="pill-weak">Javascript</span>
              <span class="pill-weak">SQL</span>
              <span class="pill-weak">Cloud Platforms</span>
              <span class="pill-weak">Containers</span>
            </div>
          </div>
        </div>
      </div>

      <!-- LAYER 2: TAILORED (Clipped Overlay layer - Left side of scan) -->
      <div class="document-layer layer-tailored">
        <div class="a4-page tailored-bg">
          <!-- Page Header -->
          <div class="a4-header">
            <div class="profile-block">
              <div class="avatar-outline avatar-active">AC</div>
              <div class="meta-block">
                <h3 class="tailored-title">Alex Carter</h3>
                <p class="subtitle-strong">Staff Systems Engineer (AWS & K8s)</p>
              </div>
            </div>
            <div class="stats-badge-strong">
              <span class="score-num-strong">98%</span>
              <span class="score-lbl-strong">ATS Match</span>
            </div>
          </div>

          <div class="a4-divider divider-active"></div>

          <!-- Section: Professional Summary -->
          <div class="a4-section">
            <h4 class="section-heading-strong">Professional Profile</h4>
            <p class="text-strong highlighted-success-bg">
              Cloud-native <strong class="keyword-highlight">Staff Systems Engineer</strong> with 8+ years of expertise architecting high-availability <strong class="keyword-highlight">AWS ECS</strong> microservices. Spearheaded database optimization, reducing API latency by <strong class="keyword-highlight">42%</strong>.
            </p>
          </div>

          <!-- Section: Technical Skills -->
          <div class="a4-section">
            <h4 class="section-heading-strong">Technical Skills</h4>
            <div class="pills-row-strong">
              <span class="pill-strong">AWS ECS</span>
              <span class="pill-strong">Terraform</span>
              <span class="pill-strong">Docker</span>
              <span class="pill-strong">Kubernetes</span>
              <span class="pill-strong">ScyllaDB</span>
              <span class="pill-strong">PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// Pure synchronized GPU-accelerated CSS animations. 
// Requires zero JavaScript execution overhead.
</script>

<style scoped>
.animation-viewport {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  background-color: transparent;
  min-height: 400px;
}

/* Compact A4 Page Mockup Container */
.a4-document-container {
  width: 100%;
  max-width: 430px;
  height: 350px;
  position: relative;
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 30px rgba(27, 25, 23, 0.05);
  overflow: hidden;
}

.document-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.layer-original {
  background-color: var(--colors-surface);
  z-index: 1;
}

.layer-tailored {
  background-color: #FFFFFF;
  z-index: 2;
  animation: sweep-reveal 6.5s infinite ease-in-out alternate;
}

/* Beautiful synchronized vertical laser scan line */
.scanner-bar {
  position: absolute;
  top: -2px;
  bottom: -2px;
  width: 2px;
  z-index: 10;
  background: linear-gradient(180deg, 
    rgba(140, 132, 122, 0.1) 0%, 
    var(--colors-secondary) 25%, 
    var(--colors-primary) 50%, 
    var(--colors-secondary) 75%, 
    rgba(140, 132, 122, 0.1) 100%
  );
  animation: sweep-line 6.5s infinite ease-in-out alternate;
  pointer-events: none;
}

.laser-glow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -15px;
  width: 32px;
  background: radial-gradient(circle at center, rgba(140, 132, 122, 0.12) 0%, rgba(140, 132, 122, 0) 65%);
}

.laser-dot {
  position: absolute;
  left: -2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--colors-primary);
  box-shadow: 0 0 6px 1px var(--colors-secondary);
}

.dot-top { top: 12%; }
.dot-bottom { bottom: 12%; }

/* Synchronized Keyframe Animations */
@keyframes sweep-line {
  0% { left: 0%; }
  100% { left: 100%; }
}

@keyframes sweep-reveal {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0% 0 0); }
}

/* Compact Document Formatting Styles */
.a4-page {
  padding: var(--spacing-md) var(--spacing-md) 12px;
  font-family: var(--font-family);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  justify-content: space-between;
}

.tailored-bg {
  background-color: #FFFFFF;
}

/* Compact Header */
.a4-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-outline {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--colors-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--colors-secondary);
  background-color: rgba(140, 132, 122, 0.04);
}

.avatar-active {
  border-color: var(--colors-primary);
  color: var(--colors-primary);
  background-color: var(--colors-surface);
  border-width: 1.2px;
}

.meta-block {
  display: flex;
  flex-direction: column;
}

.original-title {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--colors-secondary);
}

.tailored-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--colors-primary);
}

.subtitle-weak {
  font-size: 0.65rem;
  color: var(--colors-secondary);
  opacity: 0.7;
}

.subtitle-strong {
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--colors-tertiary);
}

/* Compact Stats Badges */
.stats-badge-weak {
  border: 1px solid var(--border-light);
  border-radius: 3px;
  padding: 2px 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.score-num-weak {
  font-size: 0.8rem;
  font-weight: 300;
  color: var(--colors-secondary);
}

.score-lbl-weak {
  font-size: 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--colors-secondary);
}

.stats-badge-strong {
  border: 1px solid var(--colors-primary);
  border-radius: 3px;
  padding: 2px 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  background-color: var(--colors-surface);
}

.score-num-strong {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--colors-primary);
}

.score-lbl-strong {
  font-size: 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--success);
  font-weight: 700;
}

/* Horizontal Dividers */
.a4-divider {
  height: 1px;
  background-color: var(--border-light);
  margin: 8px 0;
}

.divider-active {
  background-color: var(--colors-secondary);
}

/* A4 Sections */
.a4-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-heading-weak {
  font-size: 0.58rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--colors-secondary);
}

.section-heading-strong {
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--colors-primary);
}

/* Body Text blocks */
.text-weak {
  font-size: 0.65rem;
  color: var(--colors-secondary);
  line-height: 1.45;
  font-weight: 300;
}

.text-strong {
  font-size: 0.65rem;
  color: var(--colors-primary);
  line-height: 1.45;
  font-weight: 400;
}

/* Block highlighting fades */
.highlighted-weak-bg {
  border-left: 1.5px solid var(--warning);
  padding-left: 6px;
}

.highlighted-success-bg {
  border-left: 2px solid var(--success);
  background-color: rgba(95, 107, 86, 0.03);
  padding: 4px 8px;
  border-radius: 0 3px 3px 0;
}

/* Skills Pills Row */
.pills-row-weak {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.pill-weak {
  font-size: 0.58rem;
  color: var(--colors-secondary);
  background-color: rgba(140, 132, 122, 0.04);
  border: 1px solid var(--border-light);
  padding: 1px 4px;
  border-radius: 2px;
}

.pills-row-strong {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.pill-strong {
  font-size: 0.58rem;
  font-weight: 500;
  color: var(--colors-primary);
  background-color: var(--colors-surface);
  border: 1px solid var(--colors-secondary);
  padding: 1px 5px;
  border-radius: 2px;
}

.keyword-highlight {
  color: var(--colors-primary);
  font-weight: 600;
  border-bottom: 1px dashed var(--success);
}

/* Background Decorative Floating Badges - Centered closer to compact container */
.decor-badge {
  position: absolute;
  z-index: 0;
  opacity: 0.65;
  pointer-events: none;
  animation: drift-float 7s infinite ease-in-out alternate;
}

.decor-badge span {
  font-family: var(--font-family);
  font-size: 0.62rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  border-radius: 100px;
  background-color: var(--colors-surface);
  border: 1px solid var(--border-light);
  color: var(--colors-primary);
  box-shadow: 0 4px 12px rgba(27, 25, 23, 0.02);
}

.b1 { top: 8%; left: 0%; animation-delay: 0s; }
.b2 { top: 78%; left: -4%; animation-delay: 2s; }
.b3 { top: 16%; right: 0%; animation-delay: 1.5s; }

@keyframes drift-float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(1deg); }
  100% { transform: translateY(2px) rotate(-0.5deg); }
}

/* Responsive Scaling */
@media (max-width: 900px) {
  .animation-viewport {
    min-height: 370px;
  }
  
  .a4-document-container {
    max-width: 92%;
    height: 320px;
  }

  .a4-page {
    padding: 12px 12px 10px;
  }

  .decor-badge {
    display: none;
  }
}
</style>
