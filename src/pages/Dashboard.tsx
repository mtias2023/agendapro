import { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { clientService } from '../services/clientService';
import { serviceService } from '../services/serviceService';
import { Appointment, Client, Service } from '../types';
import { Calendar, Users, Briefcase, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { business } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!business) return;

    const loadData = async () => {
      try {
        const [appts, clientsList, servicesList] = await Promise.all([
          appointmentService.getAppointments(business.id),
          clientService.getClients(business.id),
          serviceService.getServices(business.id),
        ]);

        setAppointments(appts);
        setClients(clientsList);
        setServices(servicesList);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAppts = appts.filter((apt) => {
          const aptDate = new Date(apt.startTime);
          aptDate.setHours(0, 0, 0, 0);
          return aptDate.getTime() === today.getTime();
        });

        setTodayAppointments(todayAppts);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [business]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </MainLayout>
    );
  }

  const stats = [
    {
      label: 'Turnos Totales',
      value: appointments.length,
      icon: Calendar,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Clientes',
      value: clients.length,
      icon: Users,
      color: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      label: 'Servicios',
      value: services.length,
      icon: Briefcase,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      label: 'Hoy',
      value: todayAppointments.length,
      icon: TrendingUp,
      color: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bienvenido</h1>
          <p className="text-gray-600">{business?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} className={stat.textColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Turnos de Hoy
            </h2>
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(apt.startTime).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {apt.clientId || 'Cliente'}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        apt.status === 'scheduled'
                          ? 'bg-green-100 text-green-700'
                          : apt.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {apt.status === 'scheduled'
                        ? 'Confirmado'
                        : apt.status === 'completed'
                          ? 'Completado'
                          : 'Cancelado'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Sin turnos para hoy
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Próximos Turnos
            </h2>
            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(apt.startTime).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(apt.startTime).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Sin turnos próximos
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
