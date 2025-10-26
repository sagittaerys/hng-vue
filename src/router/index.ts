import { createRouter, createWebHistory } from 'vue-router'
import type { SessionData } from '../types'


import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Dashboard from '../views/Dashboard.vue'
import Tickets from '../views/Tickets.vue'





// auth check function
function checkAuth(): SessionData | null {
  const session = localStorage.getItem('ticketapp_session')
  
  if (!session) return null
  
  try {
    const sessionData: SessionData = JSON.parse(session)
    
    if (new Date(sessionData.expiresAt) < new Date()) {
      localStorage.removeItem('ticketapp_session')
      return null
    }
    
    return sessionData
  } catch (err) {
    console.error('Session error:', err)
    localStorage.removeItem('ticketapp_session')
    return null
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: SignUp,
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: Tickets,
      meta: { requiresAuth: true }
    }
  ]
})

// Route guard - protects routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const user = checkAuth()
  
  if (requiresAuth && !user) {
    // Redirect to login if not authenticated
    next('/login')
  } else if (!requiresAuth && user && (to.path === '/login' || to.path === '/sign-up')) {
    // Redirect to dashboard if already logged in
    next('/dashboard')
  } else {
    next()
  }
})

export default router