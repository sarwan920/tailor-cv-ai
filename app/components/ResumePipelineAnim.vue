<template>
  <div 
    ref="viewport"
    class="w-full h-[880px] lg:h-[420px] relative flex justify-center items-center overflow-visible bg-transparent cursor-default py-2 lg:py-0"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Spotlight Mouse tracking glow -->
    <div 
      class="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(140,132,122,0.12)_0%,rgba(234,230,220,0)_70%)] blur-[40px] z-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-[left_0.25s_cubic-bezier(0.25,0.46,0.45,0.94),top_0.25s_cubic-bezier(0.25,0.46,0.45,0.94)]"
      :style="{ 
        left: `${glowX}px`, 
        top: `${glowY}px`
      }"
    ></div>

    <!-- SIDE-BY-SIDE RESUME PAPERS (3D Parallax Canvas) -->
    <div 
      class="w-full max-w-[640px] flex flex-col lg:flex-row justify-between items-center relative overflow-visible z-35 gap-4 lg:gap-4"
      :style="{ 
        transform: `perspective(1000px) rotateY(${tiltX}deg) rotateX(${tiltY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }"
    >
      
      <!-- LEFT CARD: MASTER BASELINE PROFILE -->
      <div class="w-full lg:w-[48%] h-[420px] bg-card-left border border-card-border rounded-lg shadow-[0_10px_30px_rgba(27,25,23,0.03)] relative flex flex-col p-5 lg:py-6 lg:px-5 box-border transition-all duration-500 transform-style-3d">
        <div class="absolute -top-2.5 left-5 font-sans text-[0.52rem] font-bold uppercase tracking-[0.15em] bg-primary text-surface py-0.5 px-2 rounded-sm shadow-[0_2px_6px_rgba(27,25,23,0.08)]">MASTER BASELINE</div>
        
        <!-- Synced vertical laser scan sweep line for left card ONLY -->
        <div class="card-scan-laser" :class="{ active: pipelineState === 'parsing' || pipelineState === 'mapping' }"></div>

        <div class="flex flex-col h-full justify-between">
          <!-- Candidate Header -->
          <div class="flex flex-col gap-0.5">
            <h4 class="font-serif text-[0.95rem] font-bold text-primary leading-tight m-0">Alex Carter</h4>
            <p class="font-sans text-[0.65rem] font-semibold text-secondary uppercase tracking-[0.08em] m-0">Systems Engineer</p>
          </div>
          
          <div class="h-[1px] bg-primary/6 my-2.5"></div>
          
          <!-- Career Narrative -->
          <div class="flex flex-col gap-1">
            <span class="font-sans text-[0.52rem] font-bold uppercase tracking-[0.1em] text-primary">Career Narrative</span>
            <p class="font-sans text-[0.65rem] text-secondary leading-normal font-light m-0">
              Systems engineer with baseline experience in maintaining virtual machines, configuring databases, and writing bash scripts.
            </p>
          </div>

          <!-- Technical Skills -->
          <div class="flex flex-col gap-1">
            <span class="font-sans text-[0.52rem] font-bold uppercase tracking-[0.1em] text-primary">Technical Skills</span>
            <div class="flex flex-wrap gap-1.5">
              <span class="font-sans text-[0.55rem] font-medium text-secondary bg-primary/3 border border-primary/8 py-0.5 px-1.5 rounded-sm">Linux</span>
              <span class="font-sans text-[0.55rem] font-medium text-secondary bg-primary/3 border border-primary/8 py-0.5 px-1.5 rounded-sm">SQL</span>
              <span class="font-sans text-[0.55rem] font-medium text-secondary bg-primary/3 border border-primary/8 py-0.5 px-1.5 rounded-sm">Bash</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT CARD: OPTIMIZED TAILORED PROFILE -->
      <div 
        class="w-full lg:w-[48%] h-[420px] bg-card-right border border-secondary rounded-lg shadow-[0_10px_30px_rgba(27,25,23,0.03)] relative flex flex-col p-5 lg:py-6 lg:px-5 box-border transition-all duration-500 transform-style-3d"
        :class="[
          pipelineState, 
          pipelineState === 'success' ? 'border-success! shadow-[0_12px_35px_rgba(95,107,86,0.08)]!' : ''
        ]"
      >
        <div 
          class="absolute -top-2.5 left-5 font-sans text-[0.52rem] font-bold uppercase tracking-[0.15em] text-surface py-0.5 px-2 rounded-sm shadow-[0_2px_6px_rgba(27,25,23,0.08)]"
          :class="pipelineState === 'success' ? 'bg-success' : 'bg-primary'"
        >GEMINI OPTIMIZED</div>

        <!-- Synced vertical laser scan sweep line for right card ONLY -->
        <div class="card-scan-laser" :class="{ active: pipelineState === 'mapping' }"></div>

        <!-- ATS Match Score Badge overlay in corner -->
        <div class="absolute top-3.5 right-3.5 width w-12 h-12 bg-surface border border-secondary rounded-full shadow-[0_4px_10px_rgba(27,25,23,0.05)] flex items-center justify-center z-5 transition-all duration-400" :class="{ 'border-success! shadow-[0_4px_12px_rgba(95,107,86,0.1)]!': pipelineState === 'success' }">
          <svg class="w-full h-full absolute top-0 left-0" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="rgba(27, 25, 23, 0.05)" stroke-width="3" />
            <circle 
              cx="18" 
              cy="18" 
              r="16" 
              class="score-fill-ring" 
              :stroke="pipelineState === 'success' ? 'var(--color-success)' : 'var(--color-secondary)'"
              stroke-width="3" 
              stroke-linecap="round"
              :stroke-dasharray="`${(atsScore / 100) * 100.5} 100.5`"
              transform="rotate(-90 18 18)"
            />
          </svg>
          <div class="flex flex-col items-center justify-center line-height-1">
            <span class="font-sans text-[0.62rem] font-bold" :class="pipelineState === 'success' ? 'text-success' : 'text-primary'">{{ atsScore }}%</span>
            <span class="text-[0.22rem] font-bold tracking-[0.02em] text-secondary mt-0.5">MATCH</span>
          </div>
        </div>
        
        <div class="flex flex-col h-full justify-between">
          <!-- Candidate Header -->
          <div class="flex flex-col gap-0.5">
            <h4 class="font-serif text-[0.95rem] font-bold text-primary leading-tight m-0">Alex Carter</h4>
            <!-- Role transitions automatically -->
            <p class="font-sans text-[0.65rem] font-semibold text-success uppercase tracking-[0.08em] m-0 animate-[fade-in-up_0.4s_ease_forwards]" v-if="pipelineState === 'success'">Staff Cloud Engineer</p>
            <p class="font-sans text-[0.65rem] font-semibold text-secondary uppercase tracking-[0.08em] m-0 loading-line" v-else-if="pipelineState === 'parsing' || pipelineState === 'mapping'"></p>
            <p class="font-sans text-[0.65rem] font-semibold text-secondary uppercase tracking-[0.08em] m-0" v-else>Systems Engineer</p>
          </div>
          
          <div class="h-[1px] bg-primary/6 my-2.5"></div>
          
          <!-- Career Narrative -->
          <div class="flex flex-col gap-1">
            <span class="font-sans text-[0.52rem] font-bold uppercase tracking-[0.1em] text-primary">Career Narrative</span>
            
            <p class="font-sans text-[0.65rem] text-secondary leading-normal font-light m-0" v-if="pipelineState === 'original'">
              Systems engineer with baseline experience in maintaining virtual machines, configuring databases, and writing bash scripts.
            </p>
            <div class="flex flex-col gap-1.5" v-else-if="pipelineState === 'parsing' || pipelineState === 'mapping'">
              <span class="loading-line w-full"></span>
              <span class="loading-line w-[85%]"></span>
              <span class="loading-line w-[55%]"></span>
            </div>
            <p class="font-sans text-[0.65rem] text-secondary leading-normal font-light m-0 animate-[fade-in-up_0.5s_ease_forwards]" v-else>
              Cloud-native <strong class="text-primary font-semibold bg-success/8 border-b border-dashed border-success px-0.5">Staff Cloud Engineer</strong> with 8+ years of expertise architecting high-availability <strong class="text-primary font-semibold bg-success/8 border-b border-dashed border-success px-0.5">AWS ECS</strong> container clusters and Terraform IaC deployments.
            </p>
          </div>

          <!-- Technical Skills -->
          <div class="flex flex-col gap-1">
            <span class="font-sans text-[0.52rem] font-bold uppercase tracking-[0.1em] text-primary">Technical Skills</span>
            
            <div class="flex flex-wrap gap-1.5" v-if="pipelineState === 'original'">
              <span class="font-sans text-[0.55rem] font-medium text-secondary bg-surface border border-primary/8 py-0.5 px-1.5 rounded-sm">Linux</span>
              <span class="font-sans text-[0.55rem] font-medium text-secondary bg-surface border border-primary/8 py-0.5 px-1.5 rounded-sm">SQL</span>
              <span class="font-sans text-[0.55rem] font-medium text-secondary bg-surface border border-primary/8 py-0.5 px-1.5 rounded-sm">Bash</span>
            </div>
            <div class="flex gap-1.5" v-else-if="pipelineState === 'parsing' || pipelineState === 'mapping'">
              <span class="loading-pill"></span>
              <span class="loading-pill"></span>
              <span class="loading-pill"></span>
            </div>
            <div class="flex flex-wrap gap-1.5 animate-[fade-in-up_0.5s_ease_forwards]" v-else>
              <span class="font-sans text-[0.55rem] font-semibold text-success bg-success/8 border border-success/30 py-0.5 px-1.5 rounded-sm">AWS ECS</span>
              <span class="font-sans text-[0.55rem] font-semibold text-success bg-success/8 border border-success/30 py-0.5 px-1.5 rounded-sm">Terraform</span>
              <span class="font-sans text-[0.55rem] font-semibold text-success bg-success/8 border border-success/30 py-0.5 px-1.5 rounded-sm">Kubernetes</span>
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
.transform-style-3d {
  transform-style: preserve-3d;
}
.line-height-1 {
  line-height: 1;
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
  box-shadow: 0 0 10px 2px var(--color-success);
  animation: vertical-laser-sweep 2.2s infinite linear;
}

@keyframes vertical-laser-sweep {
  0% { top: 0%; }
  100% { top: 100%; }
}

/* Shimmer / loading indicators on Right Card */
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

@keyframes shimmer-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .card-scan-laser {
    display: none; /* remove laser on stacked layout for clean view */
  }
}
</style>
