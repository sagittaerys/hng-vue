<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { SessionData } from '../types'

const router = useRouter()
const route = useRoute()

const isMenuOpen = ref(false)
const isLoggedIn = ref(false)
const userName = ref('')

onMounted(() => {
  checkAuthStatus()
})

// Watch for route changes to update auth status
watch(() => route.path, () => {
  checkAuthStatus()
})

function checkAuthStatus() {
  const session = localStorage.getItem('ticketapp_session')
  
  if (session) {
    try {
      const sessionData: SessionData = JSON.parse(session)
      
      if (new Date(sessionData.expiresAt) > new Date()) {
        isLoggedIn.value = true
        userName.value = sessionData.name?.split(' ')[0] || 'User'
      } else {
        localStorage.removeItem('ticketapp_session')
        isLoggedIn.value = false
        userName.value = ''
      }
    } catch (err) {
      console.error('Session error:', err)
      isLoggedIn.value = false
      userName.value = ''
    }
  } else {
    isLoggedIn.value = false
    userName.value = ''
  }
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function handleNavigation(path: string) {
  isMenuOpen.value = false
  router.push(path)
}
</script>

<template>
  <nav class="container navbar">
    <div class="navbar-container">
      <!-- Brand -->
      <div 
        class="navbar-brand" 
        @click="handleNavigation(isLoggedIn ? '/dashboard' : '/')"
      >
        TicketApp
      </div>

      <!-- Desktop Navigation -->
      <div class="navbar-desktop">
        <template v-if="isLoggedIn">
          <span class="user-greeting">Hi, {{ userName }}!</span>
          <button 
            class="nav-button nav-button-dashboard"
            @click="handleNavigation('/dashboard')"
          >
            Dashboard
          </button>
        </template>
        <template v-else>
          <button 
            class="nav-button nav-button-secondary"
            @click="handleNavigation('/login')"
          >
            Login
          </button>
          <button 
            class="nav-button nav-button-primary"
            @click="handleNavigation('/sign-up')"
          >
            Get Started
          </button>
        </template>
      </div>

      <!-- Hamburger - Only show when NOT logged in -->
      <div 
        v-if="!isLoggedIn"
        :class="['hamburger', { active: isMenuOpen }]"
        @click="toggleMenu"
      >
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
      </div>
    </div>

    <!-- Mobile Menu - Only show when NOT logged in -->
    <div 
      v-if="!isLoggedIn" 
      :class="['mobile-menu', { open: isMenuOpen }]"
    >
      <button 
        class="nav-button nav-button-secondary"
        @click="handleNavigation('/login')"
      >
        Login
      </button>
      <button 
        class="nav-button nav-button-primary"
        @click="handleNavigation('/sign-up')"
      >
        Get Started
      </button>
    </div>
  </nav>
</template>