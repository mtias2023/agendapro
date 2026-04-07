import { Link, useLocation } from 'react-router-dom';
import {
  Calendar,
  Users,
  Settings,
  BarChart3,
  LogOut,
  User,
  Home,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from '../notifications/NotificationCenter';

const menuItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/appointments', icon: Calendar, label: 'Turnos' },
  { path: '/services', icon: BarChart3, label: 'Servicios' },
  { path: '/clients', icon: Users, label: 'Clientes' },
  { path: '/settings', icon: Settings, label: 'Configuración' },
];

export function Sidebar() {
  const location = useLocation();
  const { logout, business } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">AgendaPro</h1>
        <p className="text-sm text-gray-600 mt-2">{business?.name || 'Negocio'}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 pb-4 border-b border-gray-200">
          <NotificationCenter />
        </div>
        <div className="space-y-2">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <User size={20} />
            <span>Perfil</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut size={20} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
