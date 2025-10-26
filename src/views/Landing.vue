<script setup lang="ts">
import { Target, Zap, ChartNoAxesColumnIncreasing } from 'lucide-vue-next';
import { useRouter } from 'vue-router'
import WaveSVG from '../assets/wave-haikei.svg'

const router = useRouter()

const features = [
  {
    icon: Target , 
    title: 'Easy Tracking',
    content: 'Monitor all your tickets in one centralized dashboard with real-time updates and notifications.'
  },
  {
    icon: Zap ,
    title: 'Fast Resolution',
    content: 'Prioritize and resolve issues quickly with our intuitive workflow system and smart automation.'
  },
  {
    icon: ChartNoAxesColumnIncreasing ,
    title: 'Detailed Analytics',
    content: 'Get insights into ticket patterns and team performance with comprehensive reporting tools.'
  }
]

function handleNavigation(path: string) {
  router.push(path)
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="container hero-section">
      <!-- Decorative circles -->
      <div class="decorative-circle circle-1"></div>
      <div class="decorative-circle circle-2"></div>

      <!-- Hero content -->
      <div class="hero-container">
        <div class="hero-content flex flex-col items-center text-center">
          <h1 class="hero-title">Manage all your tickets in one place</h1>
          <p class="hero-subtitle">
            Streamline your ticketing process with our all-in-one solution designed for efficiency and ease of use.
          </p>

          <div class="hero-buttons">
            <button class="hero-button-secondary" @click="handleNavigation('/login')">
              Login
            </button>
            <button class="hero-button-primary" @click="handleNavigation('/sign-up')">
              Get Started
            </button>
          </div>
        </div>
      </div>

      <!-- Wavy thingy -->
      <img 
        :src="WaveSVG" 
        alt="" 
        class="hero-wave"
        style="position: absolute; bottom: 0; left: 0; width: 100%; height: auto; z-index: -100;"
      />
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <!-- Decorative circle -->
      <div class="features-decorative-circle"></div>

      <div class="features-container">
        <h2 class="section-title">Features</h2>

        <div class="features-grid">
          <div 
            v-for="(feature, index) in features" 
            :key="index" 
            class="feature-card"
          >
            <div class="feature-icon">
             <component :is="feature.icon" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-content">{{ feature.content }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>