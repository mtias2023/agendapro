import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const { firebaseUser, business } = useAuth();

  return (
    <MainLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Perfil</h1>
          <p className="text-gray-600 mt-2">Tu información de cuenta</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Cuenta</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <p className="text-lg text-gray-900">{firebaseUser?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Negocio
              </label>
              <p className="text-lg text-gray-900">{business?.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Negocio
              </label>
              <p className="text-lg text-gray-900 capitalize">{business?.type}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID del Negocio
              </label>
              <p className="text-sm text-gray-600 font-mono">{business?.id}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Plan AgendaPro</h3>
          <p className="text-blue-800 mb-3">
            Estás usando la versión completa de AgendaPro
          </p>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Gestión ilimitada de turnos</li>
            <li>✓ Gestión ilimitada de clientes</li>
            <li>✓ Gestión ilimitada de servicios</li>
            <li>✓ Link público de reservas</li>
            <li>✓ Notificaciones preparadas</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
