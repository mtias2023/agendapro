import { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { clientService } from '../services/clientService';
import { serviceService } from '../services/serviceService';
import { Appointment, Client, Service } from '../types';
import { Trash2, Plus, X } from 'lucide-react';

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function Appointments() {
  const { business } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientId: '',
    serviceId: '',
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    if (!business) return;
    loadData();
  }, [business]);

  const loadData = async () => {
    if (!business) return;

    try {
      const [appts, clientsList, servicesList] = await Promise.all([
        appointmentService.getAppointments(business.id),
        clientService.getClients(business.id),
        serviceService.getServices(business.id),
      ]);

      setAppointments(appts);
      setClients(clientsList);
      setServices(servicesList);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (date: Date): Appointment[] => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !formData.clientId || !formData.serviceId || !formData.date || !formData.time) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const service = services.find((s) => s.id === formData.serviceId);
      if (!service) return;

      const [year, month, day] = formData.date.split('-');
      const [hours, minutes] = formData.time.split(':');
      const startTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
      const endTime = new Date(startTime.getTime() + service.duration * 60000);

      if (editingId) {
        await appointmentService.updateAppointment(editingId, {
          clientId: formData.clientId,
          serviceId: formData.serviceId,
          startTime,
          endTime,
          notes: formData.notes,
        });
      } else {
        await appointmentService.createAppointment(business.id, {
          clientId: formData.clientId,
          serviceId: formData.serviceId,
          status: 'scheduled',
          startTime,
          endTime,
          notes: formData.notes,
        });
      }

      setFormData({ clientId: '', serviceId: '', date: '', time: '', notes: '' });
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Error al guardar el turno');
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este turno?')) {
      try {
        await appointmentService.deleteAppointment(appointmentId);
        loadData();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error al eliminar el turno');
      }
    }
  };

  const handleEdit = (apt: Appointment) => {
    const date = new Date(apt.startTime);
    const dateString = date.toISOString().split('T')[0];
    const timeString = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    setFormData({
      clientId: apt.clientId,
      serviceId: apt.serviceId,
      date: dateString,
      time: timeString,
      notes: apt.notes || '',
    });
    setEditingId(apt.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Cargando turnos...</p>
        </div>
      </MainLayout>
    );
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  return (
    <MainLayout>
      <div className="max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Turnos</h1>
            <p className="text-gray-600 mt-2">Gestiona los turnos de tu negocio</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ clientId: '', serviceId: '', date: '', time: '', notes: '' });
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Nuevo Turno
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Editar Turno' : 'Nuevo Turno'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servicio
                  </label>
                  <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({service.duration}m)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Notas adicionales del turno..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  {editingId ? 'Actualizar' : 'Crear'} Turno
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentDate(
                        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                  >
                    Hoy
                  </button>
                  <button
                    onClick={() =>
                      setCurrentDate(
                        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    Siguiente
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center font-bold text-gray-600 py-2 text-sm"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const dayAppointments = getAppointmentsForDate(date);
                  const isToday =
                    date.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={date.toString()}
                      className={`aspect-square p-2 rounded-lg border-2 transition ${
                        isToday
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                        {date.getDate()}
                      </p>
                      {dayAppointments.length > 0 && (
                        <div className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded text-center">
                          {dayAppointments.length} turno{dayAppointments.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Próximos Turnos</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {appointments.slice(0, 10).map((apt) => {
                const client = clients.find((c) => c.id === apt.clientId);
                const service = services.find((s) => s.id === apt.serviceId);

                return (
                  <div
                    key={apt.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="font-medium text-gray-900 text-sm">
                      {client?.name || 'Cliente'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {service?.name || 'Servicio'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(apt.startTime).toLocaleDateString('es-ES')} a las{' '}
                      {new Date(apt.startTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(apt)}
                        className="flex-1 text-xs bg-blue-100 text-blue-600 py-1 rounded hover:bg-blue-200 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className="flex-1 text-xs bg-red-100 text-red-600 py-1 rounded hover:bg-red-200 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
