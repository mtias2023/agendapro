import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types';
import { Bell, X } from 'lucide-react';

export function NotificationCenter() {
  const { business } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unsentCount, setUnsentCount] = useState(0);

  useEffect(() => {
    if (!business) return;

    const loadNotifications = async () => {
      try {
        const notifs = await notificationService.getNotifications(business.id, {
          sent: false,
        });

        setNotifications(notifs);
        setUnsentCount(notifs.length);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, [business]);

  const handleMarkAsSent = async (notificationId: string) => {
    try {
      await notificationService.markAsSent(notificationId);

      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );

      setUnsentCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as sent:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
      >
        <Bell size={24} />
        {unsentCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unsentCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Notificaciones</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {notification.type === 'reminder' &&
                            'Recordatorio de Turno'}
                          {notification.type === 'confirmation' &&
                            'Confirmación de Reserva'}
                          {notification.type === 'cancellation' &&
                            'Cancelación de Turno'}
                        </p>

                        <p className="text-xs text-gray-600 mt-1">
                          {notification.method === 'email' &&
                            'Por correo electrónico'}
                          {notification.method === 'whatsapp' &&
                            'Por WhatsApp'}
                          {notification.method === 'sms' && 'Por SMS'}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleMarkAsSent(notification.id)
                        }
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
                      >
                        Marcar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">
                  Sin notificaciones pendientes
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}