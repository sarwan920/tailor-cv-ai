<template>
  <div 
    ref="viewport"
    class="viewport-cluster-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Spotlight Mouse tracking glow -->
    <div 
      class="spotlight-glow"
      :style="{ 
        left: `${glowX}px`, 
        top: `${glowY}px`
      }"
    ></div>

    <!-- SIDE-BY-SIDE RESUME PAPERS (3D Parallax Canvas) -->
    <div 
      class="comparison-canvas"
      :style="{ 
        transform: `perspective(1000px) rotateY(${tiltX}deg) rotateX(${tiltY}deg)` 
      }"
    >
      
      <!-- LEFT CARD: MASTER BASELINE PROFILE -->
      <div class="resume-card card-left">
        <div class="card-badge">MASTER BASELINE</div>
        
        <!-- Synced vertical laser scan sweep line for left card ONLY -->
        <div class="card-scan-laser" :class="{ active: pipelineState === 'parsing' || pipelineState === 'mapping' }"></div>

        <div class="cv-paper">
          <!-- Candidate Header -->
          <div class="cv-header">
            <h4 class="cv-name">Alex Carter</h4>
            <p class="cv-title">Systems Engineer</p>
          </div>
          
          <div class="cv-divider"></div>
          
          <!-- Career Narrative -->
          <div class="cv-section">
            <span class="section-lbl">Career Narrative</span>
            <p class="section-txt">
              Systems engineer with baseline experience in maintaining virtual machines, configuring databases, and writing bash scripts.
            </p>
          </div>

          <!-- Technical Skills -->
          <div class="cv-section">
            <span class="section-lbl">Technical Skills</span>
            <div class="skills-wrap">
              <span class="skill-tag">Linux</span>
              <span class="skill-tag">SQL</span>
              <span class="skill-tag">Bash</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT CARD: OPTIMIZED TAILORED PROFILE -->
      <div class="resume-card card-right" :class="pipelineState">
        <div class="card-badge highlight-badge">GEMINI OPTIMIZED</div>

        <!-- Synced vertical laser scan sweep line for right card ONLY -->
        <div class="card-scan-laser" :class="{ active: pipelineState === 'mapping' }"></div>

        <!-- ATS Match Score Badge overlay in corner -->
        <div class="ats-match-badge" :class="{ success: pipelineState === 'success' }">
          <svg class="score-svg" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" class="score-bg-ring" stroke="rgba(27, 25, 23, 0.05)" stroke-width="3" />
            <circle 
              cx="18" 
              cy="18" 
              r="16" 
              class="score-fill-ring" 
              :stroke="pipelineState === 'success' ? 'var(--success)' : 'var(--colors-secondary)'"
              stroke-width="3" 
              stroke-linecap="round"
              :stroke-dasharray="`${(atsScore / 100) * 100.5} 100.5`"
              transform="rotate(-90 18 18)"
            />
          </svg>
          <div class="score-text">
            <span class="score-num">{{ atsScore }}%</span>
            <span class="score-lbl">MATCH</span>
          </div>
        </div>
        
        <div class="cv-paper">
          <!-- Candidate Header -->
          <div class="cv-header">
            <h4 class="cv-name">Alex Carter</h4>
            <!-- Role transitions automatically -->
            <p class="cv-title title-animated" v-if="pipelineState === 'success'">Staff Cloud Engineer</p>
            <p class="cv-title loading-line" v-else-if="pipelineState === 'parsing' || pipelineState === 'mapping'"></p>
            <p class="cv-title" v-else>Systems Engineer</p>
          </div>
          
          <div class="cv-divider"></div>
          
          <!-- Career Narrative -->
          <div class="cv-section">
            <span class="section-lbl">Career Narrative</span>
            
            <p class="section-txt" v-if="pipelineState === 'original'">
              Systems engineer with baseline experience in maintaining virtual machines, configuring databases, and writing bash scripts.
            </p>
            <div class="loading-wrap" v-else-if="pipelineState === 'parsing' || pipelineState === 'mapping'">
              <span class="loading-line w-100"></span>
              <span class="loading-line w-85"></span>
              <span class="loading-line w-55"></span>
            </div>
            <p class="section-txt animation-reveal" v-else>
              Cloud-native <strong class="cv-highlight">Staff Cloud Engineer</strong> with 8+ years of expertise architecting high-availability <strong class="cv-highlight">AWS ECS</strong> container clusters and Terraform IaC deployments.
            </p>
          </div>

          <!-- Technical Skills -->
          <div class="cv-section">
            <span class="section-lbl">Technical Skills</span>
            
            <div class="skills-wrap" v-if="pipelineState === 'original'">
              <span class="skill-tag">Linux</span>
              <span class="skill-tag">SQL</span>
              <span class="skill-tag">Bash</span>
            </div>
            <div class="loading-wrap flex-row" v-else-if="pipelineState === 'parsing' || pipelineState === 'mapping'">
              <span class="loading-pill"></span>
              <span class="loading-pill"></span>
              <span class="loading-pill"></span>
            </div>
            <div class="skills-wrap animation-reveal" v-else>
              <span class="skill-tag success-tag">AWS ECS</span>
              <span class="skill-tag success-tag">Terraform</span>
              <span class="skill-tag success-tag">Kubernetes</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  pipelineState: {
    type: String,
    default: null
  },
  atsScore: {
    type: Number,
    default: null
  }
});

const viewport = ref(null);
const tiltX = ref(0);
const tiltY = ref(0);
const glowX = ref(0);
const glowY = ref(0);

// Fallback internal loop states if parent props are not passed
const localPipelineState = ref('original'); // 'original' | 'parsing' | 'mapping' | 'success'
const localAtsScore = ref(45);

const pipelineState = computed(() => props.pipelineState !== null ? props.pipelineState : localPipelineState.value);
const atsScore = computed(() => props.atsScore !== null ? props.atsScore : localAtsScore.value);

let loopInterval = null;
let scoreTimer = null;

// Synced animation loop (running locally ONLY when component is decoupled/standalone)
function startPipelineLoop() {
  const cycleDuration = 9000; // 9 seconds cycles
  
  const runCycle = () => {
    localPipelineState.value = 'original';
    localAtsScore.value = 45;
    
    setTimeout(() => {
      localPipelineState.value = 'parsing';
      
      setTimeout(() => {
        localPipelineState.value = 'mapping';
        
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
            localAtsScore.value = endScore;
          } else {
            localAtsScore.value = Math.floor(startScore + (endScore - startScore) * (currentStep / steps));
          }
        }, stepDuration);
        
      }, 1500);

      setTimeout(() => {
        localPipelineState.value = 'success';
        localAtsScore.value = 98;
      }, 3500);
      
    }, 2500);
  };

  runCycle();
  loopInterval = setInterval(runCycle, cycleDuration);
}

// 3D Parallax mouse tracker
const handleMouseMove = (e) => {
  if (!viewport.value) return;
  const rect = viewport.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const normX = (x / rect.width) * 2 - 1;
  const normY = (y / rect.height) * 2 - 1;
  
  tiltX.value = Number((normX * 4).toFixed(2));
  tiltY.value = Number((normY * -4).toFixed(2));
  
  glowX.value = x;
  glowY.value = y;
};

const handleMouseLeave = () => {
  tiltX.value = 0;
  tiltY.value = 0;
};

onMounted(() => {
  if (viewport.value) {
    const rect = viewport.value.getBoundingClientRect();
    glowX.value = rect.width / 2;
    glowY.value = rect.height / 2;
  }
  if (props.pipelineState === null) {
    startPipelineLoop();
  }
});

onUnmounted(() => {
  if (loopInterval) clearInterval(loopInterval);
  if (scoreTimer) clearInterval(scoreTimer);
});
</script>

<style scoped>
.viewport-cluster-container {
  width: 100%;
  height: 480px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  background-color: transparent;
  cursor: default;
}

/* Premium Spotlight mouse tracking glow */
.spotlight-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(140, 132, 122, 0.12) 0%, rgba(234, 230, 220, 0) 70%);
  filter: blur(40px);
  z-index: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: left 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 3D Parallax comparison canvas */
.comparison-canvas {
  width: 100%;
  max-width: 580px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: visible;
  z-index: 3;
  transform-style: preserve-3d;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  gap: var(--spacing-md);
}

/* Clean Resume Card Layout */
.resume-card {
  width: 48%;
  height: 380px;
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 30px rgba(27, 25, 23, 0.03);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24px 20px 20px;
  box-sizing: border-box;
  transition: all 0.5s ease;
  transform-style: preserve-3d;
}

.card-left {
  background-color: #F8F5EE; /* Baseline premium warm cream */
  border-color: rgba(27, 25, 23, 0.08);
}

.card-right.success {
  border-color: var(--success);
  box-shadow: 0 12px 35px rgba(95, 107, 86, 0.08);
}

.card-badge {
  position: absolute;
  top: -10px;
  left: 20px;
  font-family: var(--font-family);
  font-size: 0.52rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  background-color: var(--colors-primary);
  color: var(--colors-surface);
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  box-shadow: 0 2px 6px rgba(27, 25, 23, 0.08);
}

.highlight-badge {
  background-color: var(--colors-primary);
}

.card-right.success .highlight-badge {
  background-color: var(--success);
}

/* Inner CV Paper Styling */
.cv-paper {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.cv-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cv-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--colors-primary);
  line-height: 1.1;
  margin: 0;
}

.cv-title {
  font-family: var(--font-family);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--colors-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
}

.cv-title.title-animated {
  color: var(--success);
  animation: fade-in-up 0.4s ease forwards;
}

.cv-divider {
  height: 1px;
  background-color: rgba(27, 25, 23, 0.06);
  margin: 10px 0;
}

.cv-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-lbl {
  font-family: var(--font-family);
  font-size: 0.52rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--colors-primary);
}

.section-txt {
  font-family: var(--font-family);
  font-size: 0.65rem;
  color: var(--colors-secondary);
  line-height: 1.45;
  font-weight: 300;
  margin: 0;
}

.cv-highlight {
  color: var(--colors-primary);
  font-weight: 600;
  background-color: rgba(95, 107, 86, 0.08);
  border-bottom: 1px dashed var(--success);
  padding: 0 1px;
}

/* Skills section tags */
.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  font-family: var(--font-family);
  font-size: 0.55rem;
  font-weight: 500;
  color: var(--colors-secondary);
  background-color: var(--colors-surface);
  border: 1px solid rgba(27, 25, 23, 0.08);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}

.card-left .skill-tag {
  background-color: rgba(27, 25, 23, 0.03);
}

.success-tag {
  color: #2F382A !important;
  background-color: rgba(95, 107, 86, 0.08) !important;
  border: 1px solid rgba(95, 107, 86, 0.3) !important;
  font-weight: 600;
}

/* Micro-animations & sweeps */
.animation-reveal {
  animation: fade-in-up 0.5s ease forwards;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Center Sweep Laser */
.card-scan-laser {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: var(--radius-lg);
}

.card-scan-laser.active {
  opacity: 1;
}

.card-scan-laser::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, rgba(95, 107, 86, 0), rgba(95, 107, 86, 0.7), rgba(95, 107, 86, 0));
  box-shadow: 0 0 10px 2px var(--success);
  animation: vertical-laser-sweep 2.2s infinite linear;
}

@keyframes vertical-laser-sweep {
  0% { top: 0%; }
  100% { top: 100%; }
}

/* Shimmer / loading indicators on Right Card */
.loading-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.loading-wrap.flex-row {
  flex-direction: row;
  gap: 6px;
}

.loading-line {
  height: 6px;
  background: linear-gradient(90deg, #F0EAE1 25%, #E5DCCE 50%, #F0EAE1 75%);
  background-size: 200% 100%;
  animation: shimmer-pulse 1.4s infinite;
  border-radius: var(--radius-xs);
  display: block;
}

.loading-pill {
  width: 32px;
  height: 12px;
  background: linear-gradient(90deg, #F0EAE1 25%, #E5DCCE 50%, #F0EAE1 75%);
  background-size: 200% 100%;
  animation: shimmer-pulse 1.4s infinite;
  border-radius: var(--radius-xs);
}

.w-100 { width: 100%; }
.w-85 { width: 85%; }
.w-55 { width: 55%; }

@keyframes shimmer-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Simple Circular Score Overlay Badge */
.ats-match-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 48px;
  height: 48px;
  background-color: var(--colors-surface);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(27, 25, 23, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transition: all 0.4s ease;
}

.ats-match-badge.success {
  border-color: var(--success);
  box-shadow: 0 4px 12px rgba(95, 107, 86, 0.1);
}

.score-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.score-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.score-num {
  font-family: var(--font-family);
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--colors-primary);
}

.score-lbl {
  font-size: 0.22rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--colors-secondary);
  margin-top: 1px;
}

.ats-match-badge.success .score-num {
  color: var(--success);
}

/* Tablet & Mobile constraints */
@media (max-width: 900px) {
  .viewport-cluster-container {
    height: auto;
    padding: var(--spacing-sm) 0;
  }

  .comparison-canvas {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    gap: var(--spacing-md);
  }

  .resume-card {
    width: 100%;
    height: 350px;
  }

  .scan-sweep-laser {
    display: none; /* remove laser on stacked layout for clean view */
  }
}
</style>
