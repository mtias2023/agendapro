# Guía de Configuración de Firebase

Esta guía te ayudará a configurar Firebase para AgendaPro.

## Paso 1: Crear un Proyecto en Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Hacer clic en "Crear un proyecto"
3. Ingresar nombre del proyecto (ej: agendapro)
4. Aceptar los términos y crear

## Paso 2: Crear una Aplicación Web

1. En el dashboard del proyecto, hacer clic en el ícono web
2. Seleccionar "Web"
3. Ingresar nombre de la aplicación (ej: AgendaPro Web)
4. Marcar "Configurar también el hosting de Firebase" (opcional)
5. Hacer clic en "Registrar aplicación"

## Paso 3: Obtener las Credenciales

En la página de credenciales, verás un objeto JavaScript con la configuración. Se verá así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "agendapro-xxxx.firebaseapp.com",
  projectId: "agendapro-xxxx",
  storageBucket: "agendapro-xxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcd"
};
```

## Paso 4: Configurar Variables de Entorno

1. Abrir el archivo `.env` en la raíz del proyecto
2. Reemplazar los valores placeholder con tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=agendapro-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=agendapro-xxxx
VITE_FIREBASE_STORAGE_BUCKET=agendapro-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcd
```

## Paso 5: Habilitar Autenticación por Email/Contraseña

1. En Firebase Console, ir a "Authentication" (en el menú izquierdo)
2. Hacer clic en la pestaña "Sign-in method"
3. Buscar "Email/Contraseña" y hacer clic en editar
4. Habilitar "Email/Contraseña"
5. Hacer clic en "Guardar"

## Paso 6: Configurar Firestore Database

1. En Firebase Console, ir a "Firestore Database"
2. Hacer clic en "Crear base de datos"
3. Seleccionar ubicación (ej: us-east1)
4. Seleccionar "Comenzar en modo de prueba"
5. Hacer clic en "Crear"

### Configurar Reglas de Seguridad (Importante para Producción)

1. En Firestore Database, ir a la pestaña "Reglas"
2. Reemplazar el contenido con estas reglas:

```firestore
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que usuarios autenticados lean y escriban sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Negocios: el propietario puede leer/escribir
    match /businesses/{businessId} {
      allow read: if request.auth.uid == resource.data.ownerId;
      allow write: if request.auth.uid == resource.data.ownerId;
    }

    // Configuración del negocio
    match /businessSettings/{businessId} {
      allow read, write: if request.auth.uid == get(/databases/$(database)/documents/businesses/$(businessId)).data.ownerId;
    }

    // Servicios
    match /services/{serviceId} {
      allow read, write: if request.auth.uid == get(/databases/$(database)/documents/businesses/$(resource.data.businessId)).data.ownerId;
    }

    // Clientes
    match /clients/{clientId} {
      allow read, write: if request.auth.uid == get(/databases/$(database)/documents/businesses/$(resource.data.businessId)).data.ownerId;
    }

    // Turnos
    match /appointments/{appointmentId} {
      allow read, write: if request.auth.uid == get(/databases/$(database)/documents/businesses/$(resource.data.businessId)).data.ownerId;
    }

    // Links de reserva (públicos)
    match /bookingLinks/{token} {
      allow read: if true;
      allow write: if request.auth.uid == get(/databases/$(database)/documents/businesses/$(resource.data.businessId)).data.ownerId;
    }

    // Notificaciones
    match /notifications/{notificationId} {
      allow read, write: if request.auth.uid == get(/databases/$(database)/documents/businesses/$(resource.data.businessId)).data.ownerId;
    }
  }
}
```

3. Hacer clic en "Publicar"

## Paso 7: Verificar la Configuración

1. Volver a la raíz del proyecto
2. Ejecutar `npm run dev`
3. La aplicación debería cargar sin errores de Firebase

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Verificar que las credenciales en `.env` son correctas
- Asegurarse que el API Key está habilitada en Firebase Console
- Ir a "APIs y servicios" y verificar que todos los APIs necesarios están habilitados

### Error: "Permission denied" en Firestore
- Las reglas de seguridad no están configuradas correctamente
- Verificar que estás en modo de prueba durante desarrollo
- Para producción, implementar las reglas de seguridad proporcionadas

### No puedo crear usuarios
- Ir a Authentication y verificar que Email/Password está habilitado
- Verificar que no hay límite de registros (por defecto no hay)

### Datos no persisten
- Verificar que Firestore Database está creada
- Verificar que las collections se crean automáticamente al insertar datos
- Revisar la consola de Firefox/Chrome para errores

## Próximos Pasos

1. Una vez configurado Firebase, puedes ejecutar `npm run dev`
2. Registrar un nuevo negocio en la aplicación
3. Completar la configuración inicial
4. Crear servicios, clientes y turnos
5. Probar el link público de reservas

## Información Adicional

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de Firestore](https://firebase.google.com/docs/firestore)
- [Documentación de Firebase Auth](https://firebase.google.com/docs/auth)

## Soporte

Si tienes problemas con la configuración de Firebase, consulta la [documentación oficial](https://firebase.google.com/docs) o contacta al soporte de Firebase.
