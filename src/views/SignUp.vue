<template>
  <div>
    <section class="signup-container">
      <h2 class="signup-heading">Create Account</h2>

      <div v-if="errors.general" class="alert-error">
        {{ errors.general }}
      </div>

      <div v-if="successMessage" class="alert-success">
        {{ successMessage }}
      </div>

      <div>
        <div class="form-group">
          <label for="name" class="form-label">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            v-model="formData.name"
            :class="['form-input', { error: errors.name }]"
          />
          <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            v-model="formData.email"
            :class="['form-input', { error: errors.email }]"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password (8+ characters)"
            v-model="formData.password"
            :class="['form-input', { error: errors.password }]"
          />
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>

        <div class="form-group-last">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            v-model="formData.confirmPassword"
            :class="['form-input', { error: errors.confirmPassword }]"
          />
          <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
        </div>

        <button
          type="button"
          class="sign-up-btn"
          @click="handleSignup"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <div class="login-route">
          <p>Already have an account?</p>
          <router-link class="linking" to="/login">
            Sign In
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

const errors = ref<FormErrors>({})
const successMessage = ref('')
const isLoading = ref(false)

function validateInputs(): boolean {
  const newErrors: FormErrors = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!formData.value.name.trim()) newErrors.name = 'Full name is required.'
  if (!formData.value.email.trim()) newErrors.email = 'Email address is required.'
  else if (!emailRegex.test(formData.value.email)) newErrors.email = 'Please enter a valid email address.'

  if (!formData.value.password) newErrors.password = 'Password is required.'
  else if (formData.value.password.length < 8) newErrors.password = 'Password must be at least 8 characters.'

  if (!formData.value.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.'
  else if (formData.value.password !== formData.value.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.'

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

function handleSignup(): void {
  if (!validateInputs()) return

  isLoading.value = true
  successMessage.value = ''

  try {
    const users = JSON.parse(localStorage.getItem('ticketapp_users') || '[]') as User[]
    const existingUser = users.find((u: User) => u.email === formData.value.email)

    if (existingUser) {
      errors.value = { email: 'Email already exists. Please sign in instead.' }
      isLoading.value = false
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem('ticketapp_users', JSON.stringify(users))

    successMessage.value = 'Account created successfully! Redirecting to login...'
    formData.value.name = ''
    formData.value.email = ''
    formData.value.password = ''
    formData.value.confirmPassword = ''
    errors.value = {}

    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    console.error('Unexpected error:', err)
    errors.value = { general: 'An unexpected error occurred. Please try again.' }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.signup-container {
  max-width: 28rem;
  margin: 2.5rem auto;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.signup-heading {
  font-size: 2rem;
  color: #a78bfa;
  font-weight: 900;
  text-align: center;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .signup-heading {
    font-size: 2.25rem;
  }
}

/* Alert Messages */
.alert-error {
  color: #dc2626;
  border: 1px solid #fca5a5;
  background-color: #fee2e2;
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.alert-success {
  color: #059669;
  border: 1px solid #6ee7b7;
  background-color: #d1fae5;
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

/* Form Group Styles */
.form-group {
  margin-bottom: 1rem;
}

.form-group-last {
  margin-bottom: 1.5rem;
}

/* Label Styles */
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #a78bfa;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Input Styles */
.form-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #a78bfa;
}

.form-input.error {
  border-color: #a78bfa;
}

.form-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

/* Error Message Styles */
.error-message {
  color: #a78bfa;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Button Styles */
.sign-up-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #a78bfa;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sign-up-btn:hover:not(:disabled) {
  background-color: #8b5cf6;
}

.sign-up-btn:disabled {
  background-color: #c4b5fd;
  cursor: not-allowed;
}

/* Login Route Links */
.login-route {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-size: 0.875rem;
  justify-content: center;
  margin-top: 1rem;
}

.login-route p {
  color: white;
  margin: 0;
}

.linking {
  color: #a78bfa;
  font-weight: 700;
  text-decoration: none;
}

.linking:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 640px) {
  .signup-container {
    margin: 1rem;
    padding: 1rem;
  }

  .signup-heading {
    font-size: 1.5rem;
  }
}
</style>