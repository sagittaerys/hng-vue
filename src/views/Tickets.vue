<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import type { Ticket, SessionData, FormErrors, TicketFormData, ToastState } from '@/types'
import { Tickets } from 'lucide-vue-next';

const router = useRouter()

// All reactive state
const user = ref<SessionData | null>(null)
const tickets = ref<Ticket[]>([])
const showModal = ref(false)
const editingTicket = ref<Ticket | null>(null)
const showDeleteConfirm = ref(false)
const ticketToDelete = ref<Ticket | null>(null)
const toast = ref<ToastState>({ show: false, message: '', type: 'info' })

const formData = ref<TicketFormData>({
  title: '',
  description: '',
  status: 'open',
  priority: 'medium'
})

const formErrors = ref<FormErrors>({})

onMounted(() => {
  const session = localStorage.getItem('ticketapp_session')

  if (!session) {
    router.push('/login')
    return
  }

  try {
    const sessionData: SessionData = JSON.parse(session)

    if (new Date(sessionData.expiresAt) < new Date()) {
      localStorage.removeItem('ticketapp_session')
      router.push('/login')
      return
    }

    user.value = sessionData
    loadTickets(sessionData.userId)
  } catch (err) {
    console.error('Session error:', err)
    localStorage.removeItem('ticketapp_session')
    router.push('/login')
  }
})

function loadTickets(userId: string): void {
  const allTickets: Ticket[] = JSON.parse(
    localStorage.getItem('ticketapp_tickets') || '[]'
  )
  const userTickets: Ticket[] = allTickets.filter((t) => t.userId === userId)
  tickets.value = userTickets
}

function validateForm(): boolean {
  const errors: FormErrors = {}

  if (!formData.value.title.trim()) {
    errors.title = 'Title is required.'
  }

  if (!formData.value.status) {
    errors.status = 'Status is required.'
  } else if (!['open', 'in_progress', 'closed'].includes(formData.value.status)) {
    errors.status = "Status must be 'open', 'in_progress', or 'closed'."
  }

  if (formData.value.description && formData.value.description.length > 500) {
    errors.description = 'Description must be less than 500 characters.'
  }

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

function showToast(message: string, type: 'success' | 'error' | 'info'): void {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value = { show: false, message: '', type: 'info' }
  }, 3000)
}

function handleCreate(): void {
  editingTicket.value = null
  formData.value = {
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  }
  formErrors.value = {}
  showModal.value = true
}

function handleEdit(ticket: Ticket): void {
  editingTicket.value = ticket
  formData.value = {
    title: ticket.title,
    description: ticket.description || '',
    status: ticket.status,
    priority: ticket.priority || 'medium'
  }
  formErrors.value = {}
  showModal.value = true
}

function handleSave(): void {
  if (!validateForm()) {
    showToast('Please fix the errors in the form.', 'error')
    return
  }

  const allTickets: Ticket[] = JSON.parse(
    localStorage.getItem('ticketapp_tickets') || '[]'
  )

  if (editingTicket.value && user.value) {
    const updatedTickets = allTickets.map((t) =>
      t.id === editingTicket.value!.id
        ? { ...t, ...formData.value, updatedAt: new Date().toISOString() }
        : t
    )
    localStorage.setItem('ticketapp_tickets', JSON.stringify(updatedTickets))
    showToast('Ticket updated successfully!', 'success')
  } else if (user.value) {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      userId: user.value.userId,
      title: formData.value.title,
      description: formData.value.description,
      status: formData.value.status,
      priority: formData.value.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    allTickets.push(newTicket)
    localStorage.setItem('ticketapp_tickets', JSON.stringify(allTickets))
    showToast('Ticket created successfully!', 'success')
  }

  showModal.value = false
  if (user.value) loadTickets(user.value.userId)
}

function handleDeleteClick(ticket: Ticket): void {
  ticketToDelete.value = ticket
  showDeleteConfirm.value = true
}

function handleDeleteConfirm(): void {
  if (!ticketToDelete.value || !user.value) return

  const allTickets: Ticket[] = JSON.parse(
    localStorage.getItem('ticketapp_tickets') || '[]'
  )
  const updatedTickets = allTickets.filter((t) => t.id !== ticketToDelete.value!.id)
  localStorage.setItem('ticketapp_tickets', JSON.stringify(updatedTickets))

  showToast('Ticket deleted successfully!', 'success')
  showDeleteConfirm.value = false
  ticketToDelete.value = null
  loadTickets(user.value.userId)
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'open':
      return '#10b981'
    case 'in_progress':
      return '#f59e0b'
    case 'closed':
      return '#6b7280'
    default:
      return '#6b7280'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'open':
      return 'Open'
    case 'in_progress':
      return 'In Progress'
    case 'closed':
      return 'Closed'
    default:
      return status
  }
}
</script>

<template>
  <div v-if="user" class="tickets-wrapper">
    <div class="tickets-container">
      <div class="tickets-header">
        <h1 class="tickets-title">Manage Tickets</h1>
        <div class="duex-btns">
          <button class="back-btn" @click="router.push('/dashboard')">
            ← Back to Dashboard
          </button>
          <button class="create-btn" @click="handleCreate">
            + Create Ticket
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="tickets.length === 0" class="empty-state">
        <div class="empty-state-icon"> <Tickets />  </div>
        <h2 class="empty-state-title">No tickets yet</h2>
        <p class="empty-state-text">Create your first ticket to get started</p>
        <button class="create-btn" @click="handleCreate">
          Create Ticket
        </button>
      </div>

      <!-- Tickets Grid - v-for is like .map() in React -->
      <div v-else class="tickets-grid">
        <div 
          v-for="ticket in tickets" 
          :key="ticket.id" 
          class="ticket-card"
        >
          <div class="ticket-header">
            <h3 class="ticket-title">{{ ticket.title }}</h3>
            <!-- :style is like style prop in React -->
            <span
              class="status-badge"
              :style="{ backgroundColor: getStatusColor(ticket.status) }"
            >
              {{ getStatusLabel(ticket.status) }}
            </span>
          </div>
          <p v-if="ticket.description" class="ticket-description">
            {{ ticket.description }}
          </p>
          <div class="ticket-meta">
            <span class="priority-badge">Priority: {{ ticket.priority }}</span>
            <div class="ticket-actions">
              <button class="action-btn edit-btn" @click="handleEdit(ticket)">
                Edit
              </button>
              <button class="action-btn delete-btn" @click="handleDeleteClick(ticket)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <div v-if="showModal" class="modal-overlay" @click="showModal = false">
    <!-- @click.stop prevents event bubbling (like e.stopPropagation()) -->
    <div class="modal" @click.stop>
      <h2 class="modal-header">
        {{ editingTicket ? 'Edit Ticket' : 'Create New Ticket' }}
      </h2>

      <div class="form-group">
        <label class="form-label">
          Title <span class="required">*</span>
        </label>
        <input
          type="text"
          :class="['form-input', { error: formErrors.title }]"
          v-model="formData.title"
          placeholder="Enter ticket title"
        />
        <p v-if="formErrors.title" class="error-message">{{ formErrors.title }}</p>
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea
          :class="['form-textarea', { error: formErrors.description }]"
          v-model="formData.description"
          placeholder="Enter ticket description"
        />
        <p v-if="formErrors.description" class="error-message">
          {{ formErrors.description }}
        </p>
      </div>

      <div class="form-group">
        <label class="form-label">
          Status <span class="required">*</span>
        </label>
        <select
          :class="['form-select', { error: formErrors.status }]"
          v-model="formData.status"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <p v-if="formErrors.status" class="error-message">{{ formErrors.status }}</p>
      </div>

      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" v-model="formData.priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div class="modal-actions">
        <button class="modal-btn modal-btn-secondary" @click="showModal = false">
          Cancel
        </button>
        <button class="modal-btn modal-btn-primary" @click="handleSave">
          {{ editingTicket ? 'Update' : 'Create' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
    <div class="confirm-modal" @click.stop>
      <h3 class="confirm-title">Delete Ticket</h3>
      <p class="confirm-text">
        Are you sure you want to delete "{{ ticketToDelete?.title }}"? This action cannot be undone.
      </p>
      <div class="confirm-actions">
        <button class="confirm-btn confirm-btn-cancel" @click="showDeleteConfirm = false">
          Cancel
        </button>
        <button class="confirm-btn confirm-btn-danger" @click="handleDeleteConfirm">
          Delete
        </button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div v-if="toast.show" :class="['toast', toast.type]">
    {{ toast.message }}
  </div>
</template>