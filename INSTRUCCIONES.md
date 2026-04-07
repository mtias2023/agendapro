# Instrucciones de Ejecución de AgendaPro

Guía paso a paso para ejecutar la aplicación AgendaPro en tu máquina.

## Requisitos Previos

- Node.js v16 o superior instalado
- npm (viene con Node.js)
- Una cuenta de Firebase (es gratis)
- Un editor de código (recomendado: VS Code)

## Instalación y Configuración

### 1. Clonar o Descargar el Proyecto

Si tienes el proyecto en una carpeta:

```bash
cd ruta/del/proyecto
```

### 2. Instalar Dependencias

Instala todas las librerías necesarias:

```bash
npm install
```

Esto creará una carpeta `node_modules` con todas las dependencias. Puede tomar unos minutos.

### 3. Configurar Firebase (Muy Importante)

Sigue los pasos en `FIREBASE_SETUP.md` para:
- Crear un proyecto en Firebase Console
- Obtener tus credenciales de Firebase
- Configurar las variables en el archivo `.env`

Archivo `.env` debe verse así:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_dominio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 4. Ejecutar la Aplicación en Desarrollo

```bash
npm run dev
```

Verás un mensaje como:

```
VITE v5.4.8  ready in 324 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

Abre `http://localhost:5173/` en tu navegador.

## Primer Uso

### Crear una Cuenta

1. Haz clic en "Registrarse"
2. Completa el formulario:
   - Email: tu@email.com
   - Contraseña: minimo 6 caracteres
   - Nombre del Negocio: Mi Barbería
   - Tipo de Negocio: Barbería
3. Haz clic en "Crear Cuenta"
4. Automáticamente irás al Dashboard

### Configuración Inicial

1. Haz clic en "Configuración" en el menú izquierdo
2. Edita la información de tu negocio
3. Define tus horarios de atención
4. Guarda los cambios

### Crear Servicios

1. Ve a "Servicios"
2. Haz clic en "Nuevo Servicio"
3. Crea servicios como:
   - Corte de cabello (30 minutos, $15)
   - Barba (15 minutos, $8)
   - Combo (45 minutos, $20)
4. Guarda

### Crear Clientes

1. Ve a "Clientes"
2. Haz clic en "Nuevo Cliente"
3. Agrega clientes con:
   - Nombre
   - Teléfono
   - Email (opcional)
   - Notas
4. Guarda

### Crear Turnos

1. Ve a "Turnos"
2. Haz clic en "Nuevo Turno"
3. Selecciona:
   - Cliente
   - Servicio
   - Fecha
   - Hora
4. Guarda

### Compartir Link de Reservas

1. Ve a "Configuración"
2. Busca "Link de Reservas Públicas"
3. Haz clic en "Copiar"
4. Comparte el link con tus clientes

Los clientes pueden reservar sin registrarse:
- Seleccionan servicio
- Eligen fecha y hora
- Ingresan su información
- El turno se reserva automáticamente

## Comandos Disponibles

```bash
npm run dev        # Inicia servidor de desarrollo
npm run build      # Compila para producción
npm run preview    # Vista previa de la build
npm run lint       # Verifica el código
npm run typecheck  # Verifica tipos TypeScript
```

## Estructura de Carpetas Importante

```
project/
├── src/
│   ├── pages/           # Páginas principales
│   ├── components/      # Componentes reutilizables
│   ├── services/        # Servicios de API/Firebase
│   ├── context/         # Contexto de React
│   ├── types/           # Tipos TypeScript
│   ├── config/          # Configuración Firebase
│   └── App.tsx          # Componente principal
├── .env                 # Variables de entorno (IMPORTANTE)
├── package.json         # Dependencias
└── README.md            # Documentación
```

## Guía de Uso de la Aplicación

### Dashboard
- Vista rápida de estadísticas
- Turnos del día y próximos

### Turnos (Calendario)
- Calendario interactivo
- Ver todos los turnos por día
- Crear, editar, eliminar turnos

### Servicios
- Gestionar lista de servicios
- Definir precios y duraciones
- Categorizar servicios

### Clientes
- Base de datos de clientes
- Historial de turnos por cliente
- Notas personales

### Configuración
- Horarios de atención
- Datos del negocio
- Link público de reservas

### Perfil
- Información de tu cuenta
- Detalles del negocio

## Funcionalidades

### Para Ti (Dueño del Negocio)
✓ Ver dashboard con estadísticas
✓ Gestionar turnos en calendario
✓ Crear y editar servicios
✓ Gestionar clientes
✓ Ver historial de turnos
✓ Generar link de reservas
✓ Recibir notificaciones
✓ Configurar horarios

### Para Tus Clientes
✓ Acceder a link público sin iniciar sesión
✓ Ver servicios disponibles
✓ Elegir fecha y hora
✓ Reservar turno
✓ Registrarse automáticamente

## Troubleshooting

### "Cannot find module 'firebase'"
```bash
npm install
```

### "VITE_FIREBASE_API_KEY is undefined"
- Verifica el archivo `.env`
- Las variables deben empezar con `VITE_`
- Reinicia el servidor (`npm run dev`)

### "Permission denied" en turnos
- Configura las reglas de Firestore (ver FIREBASE_SETUP.md)
- En desarrollo, usa "modo de prueba"

### El servidor no inicia
```bash
# Elimina node_modules y reinstala
rm -rf node_modules
npm install
npm run dev
```

### Los turnos no aparecen
- Verifica que Firebase está configurado correctamente
- Abre DevTools (F12) y revisa la consola
- Verifica que Firestore Database está creada

## Deployment (Publicar en Internet)

### Opción 1: Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Opción 2: Netlify

1. Hacer push a GitHub
2. Conectar repo a Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Opción 3: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

## Consideraciones para Producción

Antes de publicar en internet:

1. ✓ Configurar Firestore Rules (ver FIREBASE_SETUP.md)
2. ✓ Usar variable de ambiente diferente para prod
3. ✓ Configurar dominio custom en Firebase
4. ✓ Habilitar HTTPS (automático en Vercel/Netlify)
5. ✓ Hacer backup de base de datos
6. ✓ Probar completamente antes de publicar

## Próximos Pasos

1. Ejecuta `npm run dev`
2. Crea una cuenta de prueba
3. Configura tu negocio
4. Crea algunos servicios y clientes
5. Prueba crear turnos
6. Prueba el link de reservas públicas
7. Experimenta con todas las funcionalidades

## Documentación Completa

Para más detalles sobre funcionalidades, ver `README.md`

## Soporte

Si tienes preguntas o problemas:
1. Revisar la sección Troubleshooting arriba
2. Consultar FIREBASE_SETUP.md para problemas de Firebase
3. Revisar documentación de Firebase

## Notas Importantes

- Firebase brinda tier gratuito con límites generosos
- La aplicación está lista para producción
- El código está bien estructurado para modificar y escalar
- Se puede integrar con WhatsApp, Email, SMS para notificaciones
- El sistema es multi-tenant (cada negocio es independiente)

Disfruta usando AgendaPro!
