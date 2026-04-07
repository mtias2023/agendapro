export interface User {
  id: string;
  email: string;
  businessId: string;
  createdAt: Date;
}

export interface Business {
  id: string;
  name: string;
  type: 'barberia' | 'estetica' | 'unas' | 'peluqueria' | 'otro';
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

export interface BusinessSettings {
  businessId: string;
  schedule: Schedule[];
  serviceCategories?: string[];
  currency: string;
  timezone: string;
  appointmentDuration: number;
  bookingNotifications: boolean;
  reminderTime: number;
  updatedAt: Date;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  businessId: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  totalAppointments: number;
  lastAppointment?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  businessId: string;
  clientId: string;
  serviceId: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  startTime: Date;
  endTime: Date;
  notes?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicBookingLink {
  id: string;
  businessId: string;
  token: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  businessId: string;
  appointmentId: string;
  clientId: string;
  type: 'reminder' | 'confirmation' | 'cancellation';
  method: 'email' | 'whatsapp' | 'sms';
  sent: boolean;
  sentAt?: Date;
  createdAt: Date;
}
