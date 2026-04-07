import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { bookingLinkService } from '../services/bookingLinkService';
import { businessService } from '../services/businessService';
import { serviceService } from '../services/serviceService';
import { appointmentService } from '../services/appointmentService';
import { clientService } from '../services/clientService';
import { Business, Service, Client, PublicBookingLink } from '../types';

export function PublicBooking() {
  const { token } = useParams<{ token: string }>();
  const [bookingLink, setBookingLink] = useState<PublicBookingLink | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [step, setStep] = useState<'service' | 'date' | 'confirmation'>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadBookingData = async () => {
      if (!token) {
        setError('Link de reserva inválido');
        setLoading(false);
        return;
      }

      try {
        const link = await bookingLinkService.getLinkByToken(token);

        if (!link || !link.isActive) {
          setError('Este link de reserva no está disponible');
          setLoading(false);
          return;
        }

        setBookingLink(link);

        const [businessData, servicesList] = await Promise.all([
          businessService.getBusiness(link.businessId),
          serviceService.getServices(link.businessId),
        ]);

        setBusiness(businessData);
        setServices(servicesList);
      } catch (error) {
        console.error('Error loading booking data:', error);
        setError('Error al cargar el formulario de reserva');
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone || !bookingLink) {
      alert('Por favor completa todos los campos');
      return;
    }

    setSubmitting(true);

    try {
      let clientId = '';
      const existingClient = await clientService.getClients(bookingLink.businessId);
      const found = existingClient.find((c) => c.phone === clientPhone);

      if (found) {
        clientId = found.id;
      } else {
        clientId = await clientService.createClient(bookingLink.businessId, {
          name: clientName,
          phone: clientPhone,
          email: clientEmail,
        });
      }

      const [year, month, day] = selectedDate.split('-');
      const [hours, minutes] = selectedTime.split(':');
      const startTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
      const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

      await appointmentService.createAppointment(bookingLink.businessId, {
        clientId,
        serviceId: selectedService.id,
        status: 'scheduled',
        startTime,
        endTime,
      });

      setStep('confirmation');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error al reservar el turno. Por favor intenta nuevamente');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <p className="text-gray-600">Por favor, solicita un nuevo link de reserva al negocio</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-500">No se pudo cargar la información del negocio</p>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="text-5xl text-green-600 mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reserva Confirmada</h1>
          <p className="text-gray-600 mb-6">
            Tu turno en {business.name} ha sido confirmado.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <p className="text-sm text-gray-600">Servicio</p>
            <p className="font-bold text-gray-900">{selectedService?.name}</p>

            <p className="text-sm text-gray-600 mt-3">Fecha y Hora</p>
            <p className="font-bold text-gray-900">
              {new Date(selectedDate).toLocaleDateString('es-ES')} a las {selectedTime}
            </p>

            <p className="text-sm text-gray-600 mt-3">Duración</p>
            <p className="font-bold text-gray-900">{selectedService?.duration} minutos</p>
          </div>
          <p className="text-sm text-gray-600">
            Te hemos enviado una confirmación a {clientEmail || clientPhone}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Calendar className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">AgendaPro</h1>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{business.name}</h2>
            <p className="text-gray-600">Reserva tu turno</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 'service' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Selecciona un servicio
                  </label>
                  <div className="space-y-2">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          setSelectedService(service);
                          setStep('date');
                        }}
                        className={`w-full p-4 rounded-lg border-2 transition text-left ${
                          selectedService?.id === service.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-bold text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {service.duration} minutos - ${service.price.toFixed(2)}
                        </p>
                        {service.description && (
                          <p className="text-xs text-gray-500 mt-2">{service.description}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 'date' && selectedService && (
              <>
                <button
                  type="button"
                  onClick={() => setStep('service')}
                  className="text-blue-600 text-sm font-medium hover:underline mb-4"
                >
                  Cambiar servicio
                </button>

                <div>
                  <p className="font-medium text-gray-900 mb-3">
                    {selectedService.name} ({selectedService.duration}m)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
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
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="juan@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Reservando...' : 'Reservar Turno'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
