<template>
  <div class="auth-container-tall">
    <h2 class="auth-heading">Welcome Back!</h2>

    <div>
      <div v-if="errors.general" class="alert-error">
        {{ errors.general }}
      </div>

      <div class="form-group">
        <label for="email" class="form-label-spaced">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          v-model="formData.email"
          :class="['form-input', { error: errors.email }]"
        />
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label for="password" class="form-label-spaced">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          v-model="formData.password"
          :class="['form-input', 'mb-3', { error: errors.password }]"
        />
        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
      </div>
    </div>

    <div>
      <button
        type="button"
        @click="handleLogin"
        :disabled="isLoading"
        class="btn-primary"
      >
        {{ isLoading ? 'Signing in...' : 'Sign In' }}
      </button>

      <div class="auth-footer-spaced">
        <p class="auth-footer-text">Don't have an account?</p>
        <router-link to="/sign-up" class="btn-link">
          Register Here
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  email: '',
  password: ''
})

const errors = ref<Record<string, string>>({})
const isLoading = ref(false)

interface User {
  id: string
  email: string
  password: string
  name: string
}

interface SessionToken {
  userId: string
  email: string
  name: string
  loginTime: string
  expiresAt: string
}

function validateInputs(): boolean {
  const newErrors: Record<string, string> = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!formData.value.email.trim()) {
    newErrors.email = 'Email address is required.'
  } else if (!emailRegex.test(formData.value.email)) {
    newErrors.email = 'Please enter a valid email address.'
  }

  if (!formData.value.password) {
    newErrors.password = 'Password is required.'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

function handleLogin(): void {
  if (!validateInputs()) return

  isLoading.value = true
  errors.value = {}

  try {
    // get users from localStorage
    const users: User[] = JSON.parse(localStorage.getItem('ticketapp_users') || '[]')
    
    // find user with matching email and password
    const user: User | undefined = users.find(
      u => u.email === formData.value.email && u.password === formData.value.password
    )

    if (!user) {
      errors.value = { 
        general: 'Invalid credentials. Please check your email and password.' 
      }
      isLoading.value = false
      return
    }

    // Create session token
    const sessionToken: SessionToken = {
      userId: user.id,
      email: user.email,
      name: user.name,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }

    // store session in localStorage
    localStorage.setItem('ticketapp_session', JSON.stringify(sessionToken))

    // Show success and redirect
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)

  } catch (err: unknown) {
    console.error('Unexpected error:', err)
    errors.value = { 
      general: 'An unexpected error occurred. Please try again.' 
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>

</style>