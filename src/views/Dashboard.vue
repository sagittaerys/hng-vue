<template>
  <div v-if="user" class="dashboard-wrapper">
    <!-- Main Content -->
    <main class="dashboard-main">
      <div class="dashboard-container">
        <div class="dashboard-title-section">
          <div>
            <h1 class="dashboard-title">Dashboard</h1>
            <p class="dashboard-subtitle">
              Welcome back, {{ user.name?.split(' ')[0] || 'User' }}!
            </p>
          </div>
          <button 
            class="manage-btn"
            @click="router.push('/tickets')"
          >
            Manage Tickets
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Tickets</div>
            <div class="stat-value">{{ stats.total.toLocaleString() }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Open Tickets</div>
            <div class="stat-value">{{ stats.open.toLocaleString() }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Resolved Tickets</div>
            <div class="stat-value">{{ stats.resolved.toLocaleString() }}</div>
          </div>
        </div>

        <!-- Logout Section -->
        <div class="logout-section">
          <button class="logout-btn" @click="handleLogout">
            Logout
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Ticket, SessionData } from '@/types'

const router = useRouter()

const user = ref<SessionData | null>(null)
const stats = ref({
  total: 0,
  open: 0,
  resolved: 0
})

onMounted(() => {
  // checking authentication
  const session = localStorage.getItem('ticketapp_session')
  
  // if not in session this gets routed to login
  if (!session) {
    router.push('/login')
    return
  }

  try {
    const sessionData: SessionData = JSON.parse(session)
    
    // check if session is expired
    if (new Date(sessionData.expiresAt) < new Date()) {
      localStorage.removeItem('ticketapp_session')
      router.push('/login')
      return
    }

    user.value = sessionData

    // Load tickets and calculate stats
    const tickets: Ticket[] = JSON.parse(localStorage.getItem('ticketapp_tickets') || '[]')
    
    const userTickets: Ticket[] = tickets.filter((t: Ticket) => t.userId === sessionData.userId)
    
    const openCount: number = userTickets.filter((t: Ticket) => t.status === 'open').length
    const resolvedCount: number = userTickets.filter((t: Ticket) => t.status === 'closed').length
    
    stats.value = {
      total: userTickets.length,
      open: openCount,
      resolved: resolvedCount
    }
  } catch (err) {
    console.error('Session error:', err)
    localStorage.removeItem('ticketapp_session')
    router.push('/login')
  }
})

function handleLogout(): void {
  localStorage.removeItem('ticketapp_session')
  router.push('/')
}
</script>

<style scoped>

</style>