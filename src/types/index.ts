// src/types/index.ts

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface FormErrors {
  title?: string;
  status?: string;
  description?: string;
}

export interface SessionData {
  userId: string;
  name?: string;
  email: string;
  expiresAt: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface TicketFormData {
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
}