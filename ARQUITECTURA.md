# Arquitectura de AgendaPro

Documento técnico detallado de la arquitectura de la aplicación.

## Diagrama General de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (Frontend)                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                  React + TypeScript                     │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │            Componentes de UI                      │   │  │
│  │  │  - AuthPage, Dashboard, Appointments, etc        │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         Context (AuthContext)                    │   │  │
│  │  │  - Gestiona estado de autenticación              │   │  │
│  │  │  - Proporciona usuario y negocio a la app        │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │     Servicios (authService, appointmentService)  │   │  │
│  │  │  - Lógica de negocios                            │   │  │
│  │  │  - Comunicación con Firebase                     │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────┬─────────────────────────────────────────────┘
                 │
         ┌───────▼────────────────┐
         │   Firebase SDK         │
         │   (@firebase/*)        │
         └───────┬────────────────┘
                 │
┌────────────────▼──────────────────────────────────────┐
│              Backend (Firebase)                        │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │   Firebase Authentication                    │    │
│  │   - Email/Password auth                      │    │
│  │   - Session management                       │    │
│  │   - User tokens                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │   Firestore Database                         │    │
│  │   - Collections: users, businesses, services│    │
│  │   - appointments, clients, notifications    │    │
│  │   - Real-time synchronization                │    │
│  │   - Auto-scaling                             │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │   Firestore Security Rules                   │    │
│  │   - RLS (Row Level Security)                 │    │
│  │   - Multi-tenant isolation                   │    │
│  │   - Data validation                          │    │
│  └──────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### Autenticación

```
Usuario
   │
   ▼
┌──────────────────┐
│  AuthPage        │
│  LoginForm       │
│  RegisterForm    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  authService             │
│  - registerBusiness()    │
│  - login()               │
│  - logout()              │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Firebase Auth           │
│  - createUserWithEmail   │
│  - signInWithPassword    │
│  - signOut               │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Firestore               │
│  - Crear usuario         │
│  - Crear negocio         │
│  - Crear settings        │
└────────┬─────────────────┘
         │
         ▼
   AuthContext
   (Usuario autenticado)
```

### Creación de Turnos

```
Usuario en Appointments
   │
   ▼
┌───────────────────┐
│ Llenar formulario │
│ - Cliente         │
│ - Servicio        │
│ - Fecha/Hora      │
└────────┬──────────┘
         │
         ▼
┌─────────────────────────────┐
│  appointmentService         │
│  createAppointment()        │
│  - Validar datos            │
│  - Calcular endTime         │
│  - Crear objeto Appointment │
└────────┬────────────────────┘
         │
         ▼
┌───────────────────────┐
│  Firestore            │
│  - Agregar documento  │
│  - Actualizar cliente │
└────────┬──────────────┘
         │
         ▼
┌─────────────────────────┐
│  notificationService    │
│  - Crear recordatorio   │
│  - Crear confirmación   │
└─────────────────────────┘
```

### Reserva Pública

```
Cliente Externo
   │
   ▼
┌────────────────────────┐
│  PublicBooking Page    │
│  (/booking/:token)     │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────────┐
│  bookingLinkService        │
│  getLinkByToken()          │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────┐
│  Firestore             │
│  - Validar token       │
│  - Obtener businessId  │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  businessService       │
│  serviceService        │
│  - Obtener datos       │
│  - Obtener servicios   │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  Cliente selecciona    │
│  - Servicio            │
│  - Fecha/Hora          │
│  - Datos personales    │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  clientService         │
│  - Crear o buscar      │
│  - cliente existente    │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  appointmentService    │
│  createAppointment()   │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  Turno creado          │
│  Confirmación mostrada │
└────────────────────────┘
```

## Estructura de Componentes

### Componentes Principales

```
App.tsx (Router)
├── AuthPage
│   ├── LoginForm
│   └── RegisterForm
├── MainLayout
│   ├── Sidebar
│   │   └── NotificationCenter
│   └── [Páginas protegidas]
├── Dashboard
├── Appointments
├── Services
├── Clients
├── Settings
├── Profile
└── PublicBooking
```

### Componentes Reutilizables

- `MainLayout` - Layout con sidebar para páginas autenticadas
- `Sidebar` - Navegación principal
- `NotificationCenter` - Centro de notificaciones
- Formularios reutilizables (inputs, selects, textareas)

## Servicios (Business Logic)

### authService
- `registerBusiness()` - Registrar nuevo negocio
- `login()` - Iniciar sesión
- `logout()` - Cerrar sesión
- `getCurrentUser()` - Obtener usuario actual

### businessService
- `getBusiness()` - Obtener info del negocio
- `updateBusiness()` - Actualizar info
- `getBusinessSettings()` - Obtener configuración
- `updateBusinessSettings()` - Actualizar configuración

### serviceService
- `getServices()` - Obtener servicios
- `createService()` - Crear servicio
- `updateService()` - Actualizar servicio
- `deleteService()` - Eliminar (soft delete)

### clientService
- `getClients()` - Obtener clientes
- `createClient()` - Crear cliente
- `updateClient()` - Actualizar cliente
- `deleteClient()` - Eliminar cliente

### appointmentService
- `getAppointments()` - Obtener turnos (con filtros)
- `createAppointment()` - Crear turno
- `updateAppointment()` - Actualizar turno
- `deleteAppointment()` - Eliminar turno
- `cancelAppointment()` - Cancelar turno

### bookingLinkService
- `getOrCreateLink()` - Obtener o crear link público
- `getLinkByToken()` - Obtener link por token
- `toggleLink()` - Activar/desactivar link

### notificationService
- `createNotification()` - Crear notificación
- `getNotifications()` - Obtener notificaciones
- `markAsSent()` - Marcar como enviada
- `sendReminderNotifications()` - Enviar recordatorios

## Tipos de Datos (TypeScript)

```typescript
User {
  id: string
  email: string
  businessId: string
  createdAt: Date
}

Business {
  id: string
  name: string
  type: 'barberia' | 'estetica' | 'unas' | 'peluqueria' | 'otro'
  phone?: string
  email?: string
  address?: string
  website?: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

Service {
  id: string
  businessId: string
  name: string
  description?: string
  duration: number (minutos)
  price: number
  category?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

Appointment {
  id: string
  businessId: string
  clientId: string
  serviceId: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  startTime: Date
  endTime: Date
  notes?: string
  reminderSent: boolean
  createdAt: Date
  updatedAt: Date
}

Client {
  id: string
  businessId: string
  name: string
  phone?: string
  email?: string
  notes?: string
  totalAppointments: number
  lastAppointment?: Date
  createdAt: Date
  updatedAt: Date
}

Notification {
  id: string
  businessId: string
  appointmentId: string
  clientId: string
  type: 'reminder' | 'confirmation' | 'cancellation'
  method: 'email' | 'whatsapp' | 'sms'
  sent: boolean
  sentAt?: Date
  createdAt: Date
}
```

## Contexto de Autenticación

```
AuthContext
├── firebaseUser (User | null)
│   └── Usuario autenticado de Firebase
├── user (User | null)
│   └── Documento del usuario en Firestore
├── business (Business | null)
│   └── Negocio asociado al usuario
├── loading (boolean)
│   └── Estado de carga
└── logout () => Promise<void>
    └── Función para cerrar sesión
```

## Rutas

```
/auth                    - Página de autenticación (pública)
/booking/:token          - Portal público de reservas (público)
/dashboard               - Dashboard principal (protegida)
/appointments            - Gestión de turnos (protegida)
/services                - Gestión de servicios (protegida)
/clients                 - Gestión de clientes (protegida)
/settings                - Configuración del negocio (protegida)
/profile                 - Perfil del usuario (protegida)
/                        - Redirige a /dashboard o /auth
```

## Seguridad

### Multi-tenancy
- Cada negocio tiene un `businessId` único
- Todas las queries incluyen filtro `businessId`
- Solo el propietario puede acceder a sus datos
- Firestore Rules validan esto en la base de datos

### Autenticación
- Firebase Auth maneja usuarios y sesiones
- Tokens JWT automáticos
- Solo usuarios autenticados acceden a datos protegidos

### Validación
- TypeScript previene errores en tiempo de compilación
- Validación en componentes antes de enviar datos
- Firestore Rules validan datos en escritura

## Escalabilidad

### Optimizaciones
- React.memo para componentes que no cambian
- Lazy loading de rutas (potencial mejora)
- Queries optimizadas con índices en Firestore

### Límites
- Firestore permite millones de documentos
- Firebase Auth escala automáticamente
- No hay límite de usuarios (dentro del plan)

### Base de Datos
- Documentos pequeños por eficiencia
- Índices automáticos para queries frecuentes
- Soft delete para clientes y servicios

## Modificaciones Futuras

### Fácil de Agregar
1. Nuevas páginas - Crear componente + servicio + ruta
2. Nuevos campos - Actualizar tipos + formularios
3. Nuevos servicios - Copiar patrón de servicios existentes
4. Integraciones - Agregar Edge Functions o webhooks

### Ejemplos de Extensión

**Agregar Empleados:**
```typescript
// Nuevo tipo
type StaffMember = {
  id: string
  businessId: string
  name: string
  specialty?: string
  availability: Schedule[]
}

// Nuevo servicio
const staffService = { ... }

// Nueva página
<Staff />

// Actualizar Appointment
serviceId -> staffId
```

**Agregar Pagos:**
```typescript
// Integración con Stripe
// Edge Function para webhook
// Actualizar Appointment con estado de pago
```

**Agregar Reportes:**
```typescript
// Nuevos queries en appointmentService
// Nuevas páginas con gráficos
// Export a CSV/PDF
```

## Rendimiento

### Frontend
- Build size: ~714KB (sin gzip), ~181KB (con gzip)
- Carga rápida con Vite
- Renderizado eficiente con React

### Backend
- Firestore consultas sub-segundo
- Sin servidor (serverless)
- Auto-scaling automático

### Optimizaciones Recomendadas
1. Implementar paginación en listas largas
2. Usar índices compositos en Firestore
3. Implementar caché local con IndexedDB
4. Lazy loading de imágenes

## Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
vercel deploy
// o
firebase deploy
```

### Checklist Pre-Deploy
- [ ] Firestore Rules configuradas
- [ ] Variables de entorno en producción
- [ ] HTTPS habilitado
- [ ] Backup de datos
- [ ] Testing completado
- [ ] Dominio custom configurado

---

**Versión**: 1.0.0
**Última actualización**: 2024
