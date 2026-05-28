<template>
  <div 
    ref="viewport"
    class="viewport-cluster-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    
    <!-- 1. Spotlight Ambient Glow reacting to mouse coordinates -->
    <div 
      class="spotlight-glow"
      :style="{ 
        left: `${glowX}px`, 
        top: `${glowY}px`
      }"
    ></div>

    <!-- 2. STUNNING SVG NEURAL NETWORK GRAPH (Behind the card) -->
    <svg class="neural-network-svg" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
      <!-- Defs for glowing shadow filters -->
      <defs>
        <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Connecting Active Neural Pathways -->
      <path class="path-glow p-route-1" d="M 80 120 L 220 200 L 380 130" />
      <path class="path-glow p-route-2" d="M 120 320 L 220 200 L 410 280" />
      <path class="path-glow p-route-3" d="M 220 200 L 220 50" />

      <!-- Network Nodes (Pulsing circles) -->
      <circle cx="80" cy="120" r="3" class="node-circle" />
      <circle cx="380" cy="130" r="3" class="node-circle" />
      <circle cx="120" cy="320" r="3" class="node-circle" />
      <circle cx="410" cy="280" r="3" class="node-circle" />
      <circle cx="220" cy="50" r="3.5" class="node-circle center-node" />
    </svg>

    <!-- 3. Floating Background Constellation Tags -->
    <div class="constellation-tag skill-docker"><span>Docker</span></div>
    <div class="constellation-tag skill-kube"><span>Kubernetes</span></div>
    <div class="constellation-tag skill-tf"><span>Terraform</span></div>
    <div class="constellation-tag skill-pg"><span>PostgreSQL</span></div>

    <!-- 4. Layered 3D Parallax Card Cluster -->
    <div 
      class="card-cluster"
      :style="{ 
        transform: `perspective(1000px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) translateZ(10px)` 
      }"
    >
      
      <!-- MAIN CV CARD (Bobbing, Holographic Scanning, White Paper shadow) -->
      <div class="main-cv-card">
        
        <!-- Translucent Scanning ATS Holographic Light Beam Sweep -->
        <div class="scan-beam"></div>

        <div class="cv-page">
          <!-- CV Header -->
          <div class="cv-header">
            <div class="avatar-circle">AC</div>
            <div class="profile-details">
              <h4 class="candidate-name">Alex Carter</h4>
              <p class="candidate-title">Staff Cloud Engineer</p>
            </div>
          </div>

          <div class="cv-divider"></div>

          <!-- Professional Summary section with bolded keywords -->
          <div class="cv-section">
            <h5 class="section-title">Professional Profile</h5>
            <p class="section-text">
              Cloud-native <strong class="keyword-highlight">Staff Systems Engineer</strong> with 8+ years of expertise architecting high-availability <strong class="keyword-highlight">AWS ECS</strong> microservices. Fact-faithful narrative optimized for executive parsed credentials.
            </p>
          </div>

          <!-- Core Skills Row -->
          <div class="cv-section">
            <h5 class="section-title">Technical Skills</h5>
            <div class="skills-row">
              <span class="skill-pill">AWS ECS</span>
              <span class="skill-pill">Terraform</span>
              <span class="skill-pill">Kubernetes</span>
            </div>
          </div>
        </div>

        <!-- ATS SCORE BADGE (Overlaps top-right of main card, carries expanding green ripples) -->
        <div class="ats-badge-wrapper">
          <div class="ripple-ring r1"></div>
          <div class="ripple-ring r2"></div>
          <div class="ats-chip">
            <span class="ats-number">98%</span>
            <span class="ats-label">ATS Rank</span>
          </div>
        </div>

      </div>

      <!-- KEYWORD EXTRACTION OVERLAY (Semi-transparent dark glass panel) -->
      <div class="keyword-overlay-panel">
        <div class="overlay-header">
          <span class="material-icons overlay-icon">auto_awesome</span>
          <span class="overlay-title">ATS Extraction</span>
        </div>
        <div class="extracted-tags-list">
          <div class="tag-outline t1">
            <span class="dot"></span>
            AWS ECS
          </div>
          <div class="tag-outline t2">
            <span class="dot"></span>
            TERRAFORM
          </div>
          <div class="tag-outline t3">
            <span class="dot"></span>
            KUBERNETES
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const viewport = ref(null);
const tiltX = ref(0);
const tiltY = ref(0);
const glowX = ref(0);
const glowY = ref(0);

// Reactive Parallax 3D mouse track hook
const handleMouseMove = (e) => {
  if (!viewport.value) return;
  const rect = viewport.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Normalize cursor positions between -1 and 1
  const normX = (x / rect.width) * 2 - 1;
  const normY = (y / rect.height) * 2 - 1;
  
  // Dynamic rotate angles (max 10 degrees)
  tiltX.value = Number((normX * 10).toFixed(2));
  tiltY.value = Number((normY * -10).toFixed(2));
  
  // Glow spotlight tracking coordinates
  glowX.value = x;
  glowY.value = y;
};

// Return to equilibrium on cursor leave
const handleMouseLeave = () => {
  tiltX.value = 0;
  tiltY.value = 0;
};

onMounted(() => {
  // Set default spotlight coordinates inside the viewport center
  if (viewport.value) {
    const rect = viewport.value.getBoundingClientRect();
    glowX.value = rect.width / 2;
    glowY.value = rect.height / 2;
  }
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

/* 1. Mouse-Tracking Spotlight Ambient Glow */
.spotlight-glow {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(140, 132, 122, 0.12) 0%, rgba(234, 230, 220, 0) 70%);
  filter: blur(40px);
  z-index: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: left 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 2. INTRICATE GLOWING NEURAL NETWORK SVG GRAPH */
.neural-network-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.8;
}

.path-glow {
  fill: none;
  stroke: rgba(140, 132, 122, 0.25);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: draw-and-flow 8s infinite linear;
}

.p-route-1 { animation-delay: 0s; }
.p-route-2 { animation-duration: 10s; animation-delay: -2s; }
.p-route-3 { stroke: rgba(95, 107, 86, 0.4); stroke-width: 2; filter: url(#glow-line); animation-duration: 6s; }

@keyframes draw-and-flow {
  0% { stroke-dashoffset: 400; }
  100% { stroke-dashoffset: 0; }
}

.node-circle {
  fill: var(--colors-secondary);
  opacity: 0.4;
  animation: node-pulse 3s infinite ease-in-out;
}

.center-node {
  fill: var(--success);
  opacity: 0.8;
  animation: center-node-pulse 2s infinite ease-in-out;
}

@keyframes node-pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.4); opacity: 0.6; }
}

@keyframes center-node-pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; box-shadow: 0 0 4px var(--success); }
  50% { transform: scale(1.6); opacity: 1; }
}

/* 3. Floating Constellation Background Tags */
.constellation-tag {
  position: absolute;
  z-index: 2;
  pointer-events: none;
  opacity: 0.6;
  animation: constellation-drift 10s infinite ease-in-out alternate;
}

.constellation-tag span {
  font-family: var(--font-family);
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 5px 12px;
  border-radius: 100px;
  background-color: var(--colors-surface);
  border: 1px solid var(--border-light);
  color: var(--colors-primary);
  box-shadow: 0 4px 16px rgba(27, 25, 23, 0.02);
}

.skill-docker { top: 10%; left: -2%; animation-duration: 9s; animation-delay: 0s; }
.skill-kube { top: 78%; left: -6%; animation-duration: 11s; animation-delay: -2s; }
.skill-tf { top: 12%; right: -6%; animation-duration: 10s; animation-delay: -1.5s; }
.skill-pg { top: 82%; right: 4%; animation-duration: 12s; animation-delay: -3.5s; }

@keyframes constellation-drift {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(8px, -12px) rotate(1deg); }
  100% { transform: translate(-6px, 4px) rotate(-1deg); }
}

/* 4. Layered 3D Parallax Card Cluster */
.card-cluster {
  position: relative;
  width: 100%;
  max-width: 440px;
  height: 380px;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 3A. MAIN CV CARD */
.main-cv-card {
  position: absolute;
  width: 320px;
  height: 280px;
  left: 10px;
  top: 40px;
  background-color: #FFFFFF;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: 0 25px 60px rgba(27, 25, 23, 0.08);
  overflow: hidden;
  z-index: 4;
  transform: translateZ(20px); /* 3D depth push */
  animation: gentle-bob 6s ease-in-out infinite alternate;
}

@keyframes gentle-bob {
  0% { transform: translateZ(20px) translateY(0); }
  100% { transform: translateZ(20px) translateY(-8px); }
}

/* ATS Translucent Sweep Light beam */
.scan-beam {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(95, 107, 86, 0) 0%, 
    rgba(95, 107, 86, 0.7) 40%, 
    rgba(95, 107, 86, 0.7) 60%, 
    rgba(95, 107, 86, 0) 100%
  );
  box-shadow: 0 0 10px 1px rgba(95, 107, 86, 0.5);
  z-index: 5;
  animation: scan-sweep 3.5s linear infinite;
  pointer-events: none;
}

@keyframes scan-sweep {
  0% { top: -2%; opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: 102%; opacity: 0; }
}

/* Document inside Main CV Card */
.cv-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  justify-content: space-between;
  text-align: left;
}

.cv-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--colors-surface);
  border: 1px solid var(--border-color);
  color: var(--colors-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.profile-details {
  display: flex;
  flex-direction: column;
}

.candidate-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--colors-primary);
  line-height: 1.2;
}

.candidate-title {
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--colors-secondary);
}

.cv-divider {
  height: 1px;
  background-color: var(--border-light);
  margin: 4px 0;
}

.cv-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--colors-primary);
}

.section-text {
  font-size: 0.68rem;
  color: var(--colors-secondary);
  line-height: 1.45;
  font-weight: 300;
}

.keyword-highlight {
  color: var(--colors-primary);
  font-weight: 600;
  border-bottom: 1.5px dashed var(--success);
}

.skills-row {
  display: flex;
  gap: 6px;
}

.skill-pill {
  font-size: 0.58rem;
  font-weight: 500;
  color: var(--colors-primary);
  background-color: var(--colors-surface);
  border: 1px solid var(--colors-secondary);
  padding: 1px 6px;
  border-radius: 2px;
}

/* 3B. ATS SCORE BADGE */
.ats-badge-wrapper {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transform: translateZ(40px); /* Extruded 3D depth */
}

.ats-chip {
  position: relative;
  background-color: var(--colors-surface);
  border: 1px solid var(--colors-primary);
  border-radius: 50%;
  width: 52px;
  height: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(27, 25, 23, 0.1);
  z-index: 2;
}

.ats-number {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--colors-primary);
  line-height: 1;
  margin-bottom: 2px;
}

.ats-label {
  font-size: 0.42rem;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--success);
  letter-spacing: 0.05em;
}

/* Green Ripple Expanding Pulse Rings */
.ripple-ring {
  position: absolute;
  border: 1.5px solid var(--success);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
}

.r1 {
  animation: ripple-expand 2.6s infinite ease-out;
}

.r2 {
  animation: ripple-expand 2.6s infinite ease-out;
  animation-delay: 1.3s;
}

@keyframes ripple-expand {
  0% {
    transform: scale(0.9);
    opacity: 0.75;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

/* 3C. KEYWORD EXTRACTION OVERLAY (Semi-transparent dark glass panel) */
.keyword-overlay-panel {
  position: absolute;
  width: 170px;
  height: 190px;
  right: 15px;
  bottom: 30px;
  background-color: rgba(27, 25, 23, 0.93); /* Deep Charcoal Glassmorphism */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(140, 132, 122, 0.25);
  border-radius: var(--radius-lg);
  box-shadow: 0 15px 35px rgba(27, 25, 23, 0.2);
  padding: 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: 5;
  transform: translateZ(30px); /* 3D perspective push */
  animation: overlay-bob 6s ease-in-out infinite alternate;
  animation-delay: -1s;
}

@keyframes overlay-bob {
  0% { transform: translateZ(30px) translateY(0); }
  100% { transform: translateZ(30px) translateY(-5px); }
}

.overlay-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(140, 132, 122, 0.15);
  padding-bottom: 6px;
}

.overlay-icon {
  font-size: 11px;
  color: var(--colors-neutral);
  animation: pulse-gear 2.5s infinite ease-in-out;
}

@keyframes pulse-gear {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.15) rotate(45deg); opacity: 1; }
}

.overlay-title {
  color: var(--colors-secondary);
  font-size: 0.58rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.extracted-tags-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.tag-outline {
  font-family: var(--font-family);
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--colors-neutral);
  border: 1px solid rgba(236, 230, 217, 0.2);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  animation: fade-in-up-loop 7.5s infinite ease-in-out;
}

.tag-outline .dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--success);
  box-shadow: 0 0 6px 1.5px var(--success);
}

/* Staggered Delay parameters for fadeInUp tag highlights */
.t1 { animation-delay: 0.6s; }
.t2 { animation-delay: 1.8s; }
.t3 { animation-delay: 3s; }

@keyframes fade-in-up-loop {
  0%, 10% {
    opacity: 0;
    transform: translateY(8px);
    border-color: rgba(236, 230, 217, 0.2);
  }
  20%, 80% {
    opacity: 1;
    transform: translateY(0);
    border-color: rgba(95, 107, 86, 0.4);
  }
  90%, 100% {
    opacity: 0;
    transform: translateY(-4px);
    border-color: rgba(236, 230, 217, 0.2);
  }
}

/* Responsive viewports scaling */
@media (max-width: 900px) {
  .viewport-cluster-container {
    height: 380px;
  }

  .card-cluster {
    max-width: 96%;
    height: 320px;
  }

  .main-cv-card {
    width: 270px;
    height: 240px;
    left: 0;
    top: 30px;
  }

  .cv-page {
    padding: 14px;
  }

  .candidate-name { font-size: 0.78rem; }
  .candidate-title { font-size: 0.6rem; }
  .section-text { font-size: 0.6rem; }
  .skill-pill { font-size: 0.52rem; }

  .ats-badge-wrapper {
    top: -16px;
    right: -16px;
  }

  .keyword-overlay-panel {
    width: 140px;
    height: 160px;
    right: 5px;
    bottom: 20px;
  }

  .constellation-tag, .neural-network-svg {
    display: none; /* Clean up layout on mobile devices */
  }
}
</style>
