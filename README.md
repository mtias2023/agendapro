# AgendaPro - SaaS de Gestión de Turnos

AgendaPro es una aplicación web SaaS moderna y profesional para la gestión de turnos y reservas en negocios de servicios personales como barberías, estéticas, peluquerías y centros de belleza.

## Características Principales

### 1. Autenticación Multi-tenant
- Registro e inicio de sesión seguro
- Cada negocio tiene su propia cuenta y datos aislados
- Basado en Firebase Authentication

### 2. Dashboard Inteligente
- Estadísticas en tiempo real (turnos totales, clientes, servicios)
- Vista rápida de turnos del día
- Próximos turnos programados
- Diseño limpio y profesional

### 3. Gestión de Negocio
- Configuración del nombre y tipo de negocio
- Definición de horarios de atención (por día de la semana)
- Información de contacto y ubicación
- Generación automática de link público de reservas

### 4. Servicios
- Crear, editar y eliminar servicios
- Definir duración y precio de cada servicio
- Categorizar servicios
- Descripciones detalladas

### 5. Gestión de Turnos
- Calendario interactivo con vista mensual
- Crear, editar y eliminar turnos
- Asignar cliente y servicio a cada turno
- Marcar estado del turno (programado, completado, cancelado)
- Notas adicionales por turno

### 6. Gestión de Clientes
- Base de datos de clientes con información de contacto
- Registro de historial de turnos
- Notas personalizadas por cliente
- Buscar y filtrar clientes

### 7. Portal Público de Reservas
- Link compartible con clientes
- Selección de servicio con duración y precio
- Selección de fecha y hora disponible
- Información del cliente (nombre, teléfono, email)
- Confirmación automática de reserva
- Nuevo cliente se registra automáticamente

### 8. Notificaciones
- Centro de notificaciones en tiempo real
- Recordatorios de turnos
- Confirmaciones de reservas
- Cancelaciones de turnos
- Métodos: Email, WhatsApp, SMS (preparado para integración)

## Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilities-first
- **React Router** - Enrutamiento
- **Lucide React** - Iconografía profesional
- **Vite** - Build tool rápido

### Backend & Base de Datos
- **Firebase Authentication** - Autenticación segura
- **Firebase Firestore** - Base de datos NoSQL en tiempo real
- **Funciones de Firebase** - Para lógica backend (opcional)

## Estructura del Proyecto

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   └── notifications/
│       └── NotificationCenter.tsx
├── config/
│   └── firebase.ts
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── AuthPage.tsx
│   ├── Dashboard.tsx
│   ├── Appointments.tsx
│   ├── Services.tsx
│   ├── Clients.tsx
│   ├── Settings.tsx
│   ├── Profile.tsx
│   └── PublicBooking.tsx
├── services/
│   ├── authService.ts
│   ├── businessService.ts
│   ├── serviceService.ts
│   ├── clientService.ts
│   ├── appointmentService.ts
│   ├── bookingLinkService.ts
│   └── notificationService.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Instalación

### 1. Clonar o Descargar el Proyecto

```bash
cd project
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Crear una aplicación web en Firebase
3. Copiar las credenciales en el archivo `.env`:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_dominio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 4. Ejecutar la Aplicación en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Construir para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Uso

### Primer Acceso

1. Ir a la página de autenticación
2. Hacer clic en "Registrarse"
3. Completar formulario con:
   - Email
   - Contraseña (mínimo 6 caracteres)
   - Nombre del negocio
   - Tipo de negocio (barbería, estética, etc.)
4. Se redirige automáticamente al dashboard

### Configuración Inicial

1. Ir a **Configuración** en el menú
2. Completar información del negocio
3. Definir horarios de atención
4. Guardar cambios

### Crear Servicios

1. Ir a **Servicios**
2. Hacer clic en "Nuevo Servicio"
3. Completar:
   - Nombre (ej: Corte de cabello)
   - Categoría (ej: Cortes)
   - Duración en minutos
   - Precio
   - Descripción opcional
4. Guardar

### Crear Clientes

1. Ir a **Clientes**
2. Hacer clic en "Nuevo Cliente"
3. Completar:
   - Nombre
   - Teléfono
   - Email
   - Notas (opcional)
4. Guardar

### Crear Turnos

1. Ir a **Turnos**
2. Hacer clic en "Nuevo Turno"
3. Seleccionar:
   - Cliente
   - Servicio
   - Fecha
   - Hora
4. Agregar notas si es necesario
5. Guardar

### Compartir Link de Reservas

1. Ir a **Configuración**
2. En sección "Link de Reservas Públicas"
3. Hacer clic en "Copiar"
4. Compartir con clientes por WhatsApp, email, etc.

## Modelo de Datos Firestore

### Collections

#### users
```javascript
{
  id: string,
  email: string,
  businessId: string,
  createdAt: timestamp
}
```

#### businesses
```javascript
{
  id: string,
  name: string,
  type: 'barberia' | 'estetica' | 'unas' | 'peluqueria' | 'otro',
  phone?: string,
  email?: string,
  address?: string,
  website?: string,
  ownerId: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### businessSettings
```javascript
{
  businessId: string,
  schedule: [
    {
      dayOfWeek: 0-6,
      startTime: string (HH:mm),
      endTime: string (HH:mm),
      isOpen: boolean
    }
  ],
  currency: string,
  timezone: string,
  appointmentDuration: number,
  bookingNotifications: boolean,
  reminderTime: number,
  updatedAt: timestamp
}
```

#### services
```javascript
{
  id: string,
  businessId: string,
  name: string,
  description?: string,
  duration: number,
  price: number,
  category?: string,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### clients
```javascript
{
  id: string,
  businessId: string,
  name: string,
  phone?: string,
  email?: string,
  notes?: string,
  totalAppointments: number,
  lastAppointment?: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### appointments
```javascript
{
  id: string,
  businessId: string,
  clientId: string,
  serviceId: string,
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show',
  startTime: timestamp,
  endTime: timestamp,
  notes?: string,
  reminderSent: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### bookingLinks
```javascript
{
  id: string,
  businessId: string,
  token: string,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### notifications
```javascript
{
  id: string,
  businessId: string,
  appointmentId: string,
  clientId: string,
  type: 'reminder' | 'confirmation' | 'cancellation',
  method: 'email' | 'whatsapp' | 'sms',
  sent: boolean,
  sentAt?: timestamp,
  createdAt: timestamp
}
```

## Estrategia de Seguridad

### Multi-tenancy
- Cada negocio es aislado a nivel de base de datos
- Todas las queries incluyen filtro `businessId`
- Autenticación de Firebase garantiza que cada usuario solo vea su negocio

### Validación
- Validación en frontend (React)
- Validación en backend (Firestore Rules - implementar en producción)
- Tipado con TypeScript para prevenir errores

### Best Practices
- Variables de entorno para configuración sensible
- Sin datos sensibles en localStorage
- Sesiones seguras con Firebase Auth
- CORS habilitado solo para dominios autorizados (en producción)

## Integraciones Futuras

### Notificaciones
- **WhatsApp**: Integración con Twilio o API de WhatsApp Business
- **Email**: Sendgrid, AWS SES o similar
- **SMS**: Twilio o similar

### Pagos
- Stripe para pagos de servicios
- Facturación automática de suscripción

### Calendario
- Sincronización con Google Calendar
- Sincronización con Outlook Calendar

### Analytics
- Google Analytics para dashboards
- Reportes de rendimiento

## Personalización

### Cambiar Nombre de la App
1. Buscar "AgendaPro" en el proyecto
2. Reemplazar con tu nombre deseado
3. Afecta: Sidebar, AuthPage, títulos

### Cambiar Colores
1. Modificar clases Tailwind en componentes
2. O actualizar tailwind.config.js para cambios globales
3. Colores principales: blue-600, blue-50, gray-X

### Agregar Más Tipos de Negocio
1. Actualizar enum en `src/types/index.ts`
2. Agregar opción en formulario de registro
3. Actualizar Settings

## Troubleshooting

### Error: "Firebase configuration missing"
- Verificar variables en `.env`
- Asegurarse que Firebase project existe
- Reiniciar dev server

### Error: "Permission denied" en Firestore
- Implementar Firestore Rules en Firebase Console
- Regla de prueba: permitir lectura/escritura para usuarios autenticados

### Turnos no aparecen en calendario
- Verificar que la fecha está dentro del mes mostrado
- Verificar que businessId coincide
- Revisar console en navegador para errores

## Deployment

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Luego conectar repo a Netlify
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

## Licencia

Este proyecto es de código abierto y está disponible bajo licencia MIT.

## Soporte

Para reportar bugs o sugerir mejoras, abrir un issue en el repositorio.

## Roadmap

- [ ] App móvil con React Native
- [ ] Integración con WhatsApp Business API
- [ ] Reportes y análisis avanzados
- [ ] Sistema de pagos integrado
- [ ] Sincronización con Google Calendar
- [ ] Sistema de empleados/staff
- [ ] Multi-idioma
- [ ] Tema oscuro

---

**Versión**: 1.0.0
**Última actualización**: 2024
**Autor**: Tu Nombre / Tu Empresa
