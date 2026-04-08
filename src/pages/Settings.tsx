import { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { businessService } from '../services/businessService';
import { bookingLinkService } from '../services/bookingLinkService';
import { Business, BusinessSettings, Schedule, PublicBookingLink } from '../types';
import { Copy, Check } from 'lucide-react';

const daysOfWeek = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

export function Settings() {
  const { business } = useAuth();
  const [businessData, setBusinessData] = useState<Business | null>(business);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [bookingLink, setBookingLink] = useState<PublicBookingLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!business) return;

    const loadSettings = async () => {
      try {
        const [businessSettings, link] = await Promise.all([
          businessService.getBusinessSettings(business.id),
          bookingLinkService.getOrCreateLink(business.id),
        ]);

        setSettings(businessSettings);
        setBookingLink(link);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, [business]);

  const handleBusinessChange = (field: string, value: any) => {
    setBusinessData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleScheduleChange = (dayIndex: number, field: string, value: string) => {
    if (!settings) return;

    const newSchedule = [...settings.schedule];
    newSchedule[dayIndex] = {
      ...newSchedule[dayIndex],
      [field]: value,
    };

    setSettings({
      ...settings,
      schedule: newSchedule,
    });
  };

  const handleToggleDay = (dayIndex: number) => {
    if (!settings) return;

    const newSchedule = [...settings.schedule];
    newSchedule[dayIndex].isOpen = !newSchedule[dayIndex].isOpen;

    setSettings({
      ...settings,
      schedule: newSchedule,
    });
  };

  const handleSave = async () => {
    if (!business || !settings) return;

    setSaving(true);
    try {
      if (businessData) {
        await businessService.updateBusiness(business.id, businessData);
      }
      await businessService.updateBusinessSettings(business.id, settings);
      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

    // ✅ FUNCIÓN CORREGIDA
  const copyBookingLink = async () => {
    if (!bookingLink?.token) return;

    try {
      const url = `${window.location.origin}/#/booking/${bookingLink.token}`;
      await navigator.clipboard.writeText(url);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando link:', error);
      alert('No se pudo copiar el link');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Configuración</h1>
          <p className="text-gray-600">Gestiona tu negocio y horarios</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Información del Negocio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  value={businessData?.name || ''}
                  onChange={(e) => handleBusinessChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Negocio
                </label>
                <select
                  value={businessData?.type || 'barberia'}
                  onChange={(e) => handleBusinessChange('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="barberia">Barbería</option>
                  <option value="estetica">Estética</option>
                  <option value="unas">Salón de Uñas</option>
                  <option value="peluqueria">Peluquería</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={businessData?.phone || ''}
                  onChange={(e) => handleBusinessChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={businessData?.email || ''}
                  onChange={(e) => handleBusinessChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={businessData?.address || ''}
                  onChange={(e) => handleBusinessChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {settings && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Horarios</h2>

            <div className="space-y-4">
              {settings.schedule.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">
                      {daysOfWeek[index]}
                    </p>
                    {schedule.isOpen ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) =>
                            handleScheduleChange(index, 'startTime', e.target.value)
                          }
                          className="px-3 py-1 border border-gray-300 rounded"
                        />
                        <span className="text-gray-600">a</span>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) =>
                            handleScheduleChange(index, 'endTime', e.target.value)
                          }
                          className="px-3 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Cerrado</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleDay(index)}
                    className={`px-4 py-2 rounded font-medium transition ${
                      schedule.isOpen
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {schedule.isOpen ? 'Abierto' : 'Cerrado'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {bookingLink && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100 space-y-4">
  <h2 className="text-2xl font-bold text-gray-900">
    Link de Reservas Públicas
  </h2>
  <p className="text-gray-600">
    Comparte este link con tus clientes para que reserven turnos
  </p>

  <div className="flex items-center gap-2">
    <input
      type="text"
      readOnly
      value={`${window.location.origin}/#/booking/${bookingLink.token}`}
      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
    />
    <button
      onClick={copyBookingLink}
      className={`px-4 py-2 rounded font-medium transition flex items-center gap-2 ${
        copied
          ? 'bg-green-100 text-green-700'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  </div>
</div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </MainLayout>
  );
}
