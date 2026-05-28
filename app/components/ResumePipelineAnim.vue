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

      <!-- LAYER 1: ORIGINAL (Carbon-style dark IDE editor - Right side of scan) -->
      <div class="document-layer layer-original">
        <div class="ide-window">
          <!-- IDE Header with macOS-style window controls -->
          <div class="ide-header">
            <div class="window-controls">
              <span class="ctrl-dot red"></span>
              <span class="ctrl-dot yellow"></span>
              <span class="ctrl-dot green"></span>
            </div>
            <span class="ide-title">master_cv.json</span>
            <div class="ats-badge-weak">
              <span class="score-num-weak">45%</span>
              <span class="score-lbl-weak">ATS</span>
            </div>
          </div>
          
          <!-- Code Syntax Highlighted Body -->
          <div class="ide-body">
            <div class="line-numbers">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
            </div>
            <pre class="code-block"><code><span class="syntax-bracket">{</span>
  <span class="syntax-key">"name"</span>: <span class="syntax-string">"Alex Carter"</span>,
  <span class="syntax-key">"role"</span>: <span class="syntax-string error-squiggly">"Developer"</span>,
  <span class="syntax-key">"summary"</span>: <span class="syntax-string">"Experienced dev. Responsible</span>
             <span class="syntax-string">for microservice deploy."</span>,
  <span class="syntax-key">"experience"</span>: <span class="syntax-bracket">[</span>
    <span class="syntax-string">"Optimized database. Rewrote SQL</span>
     <span class="syntax-string">so page loaded faster."</span>
  <span class="syntax-bracket">]</span>,
  <span class="syntax-key">"skills"</span>: <span class="syntax-bracket">[</span><span class="syntax-string">"Java"</span>, <span class="syntax-string">"SQL"</span>, <span class="syntax-string">"Containers"</span><span class="syntax-bracket">]</span>
<span class="syntax-bracket">}</span></code></pre>
          </div>
        </div>
      </div>

      <!-- LAYER 2: TAILORED (Pristine executive CV page - Left side of scan) -->
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
              Cloud-native <strong class="keyword-highlight">Staff Systems Engineer</strong> with 8+ years of expertise architecting high-availability <strong class="keyword-highlight">AWS ECS</strong> microservices. Spearheaded ScyllaDB migration, reducing API latency by <strong class="keyword-highlight">42%</strong>.
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
  max-width: 440px;
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

/* Synthesized double layer split view */
.layer-original {
  background-color: var(--colors-primary); /* Graphite Core Primary Dark */
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
    rgba(95, 107, 86, 0.1) 0%, 
    var(--colors-secondary) 25%, 
    #FFFFFF 50%, 
    var(--colors-secondary) 75%, 
    rgba(95, 107, 86, 0.1) 100%
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
  background: radial-gradient(circle at center, rgba(140, 132, 122, 0.15) 0%, rgba(140, 132, 122, 0) 65%);
}

.laser-dot {
  position: absolute;
  left: -2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #FFFFFF;
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

/* CARBON IDE STYLINGS (Dark editor layout) */
.ide-window {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #171513; /* Deep Slate Graphite */
  font-family: 'Consolas', 'Monaco', monospace;
  box-sizing: border-box;
}

.ide-header {
  height: 38px;
  background-color: #110F0E;
  border-bottom: 1px solid rgba(140, 132, 122, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.window-controls {
  display: flex;
  gap: 6px;
}

.ctrl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.ctrl-dot.red { background-color: #964B43; }
.ctrl-dot.yellow { background-color: #B38F4D; }
.ctrl-dot.green { background-color: #5F6B56; }

.ide-title {
  color: var(--colors-secondary);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.05em;
}

.ats-badge-weak {
  border: 1px solid rgba(140, 132, 122, 0.3);
  border-radius: 2px;
  padding: 1px 4px;
  display: flex;
  gap: 4px;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.03);
}

.score-num-weak {
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--colors-secondary);
}

.score-lbl-weak {
  font-size: 0.45rem;
  text-transform: uppercase;
  color: var(--colors-secondary);
  opacity: 0.8;
}

.ide-body {
  flex: 1;
  display: flex;
  padding: 16px;
  overflow: hidden;
  gap: 12px;
}

.line-numbers {
  display: flex;
  flex-direction: column;
  color: rgba(140, 132, 122, 0.35);
  font-size: 0.68rem;
  text-align: right;
  user-select: none;
  line-height: 1.5;
}

.code-block {
  margin: 0;
  font-family: inherit;
  font-size: 0.68rem;
  line-height: 1.5;
  color: #ECE6D9; /* Oat Cream Code */
  overflow: hidden;
}

/* Syntax Highlighting */
.syntax-bracket { color: #8C847A; }
.syntax-key { color: #B38F4D; }     /* Ochre Key */
.syntax-string { color: #A6A097; }  /* Light Grey String */
.error-squiggly {
  border-bottom: 1.5px dotted var(--danger);
  color: var(--danger);
}

/* PRISTINE TAILORED DOCUMENT STYLINGS (Light paper layout) */
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

.tailored-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--colors-primary);
}

.subtitle-strong {
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--colors-tertiary);
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

.a4-divider {
  height: 1px;
  background-color: var(--border-light);
  margin: 8px 0;
}

.divider-active {
  background-color: var(--colors-secondary);
}

.a4-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-heading-strong {
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--colors-primary);
}

.text-strong {
  font-size: 0.65rem;
  color: var(--colors-primary);
  line-height: 1.45;
  font-weight: 400;
}

.highlighted-success-bg {
  border-left: 2px solid var(--success);
  background-color: rgba(95, 107, 86, 0.03);
  padding: 4px 8px;
  border-radius: 0 3px 3px 0;
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

/* Background Decorative Floating Badges */
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
