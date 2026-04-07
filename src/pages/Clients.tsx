import { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { clientService } from '../services/clientService';
import { Client } from '../types';
import { Trash2, CreditCard as Edit2, Plus, Phone, Mail } from 'lucide-react';

export function Clients() {
  const { business } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    if (!business) return;
    loadClients();
  }, [business]);

  const loadClients = async () => {
    if (!business) return;

    try {
      const data = await clientService.getClients(business.id);
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    try {
      if (editingId) {
        await clientService.updateClient(editingId, formData);
      } else {
        await clientService.createClient(business.id, formData);
      }

      setFormData({ name: '', phone: '', email: '', notes: '' });
      setEditingId(null);
      setShowForm(false);
      loadClients();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error al guardar el cliente');
    }
  };

  const handleDelete = async (clientId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientService.deleteClient(clientId);
        loadClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar el cliente');
      }
    }
  };

  const handleEdit = (client: Client) => {
    setFormData({
      name: client.name,
      phone: client.phone || '',
      email: client.email || '',
      notes: client.notes || '',
    });
    setEditingId(client.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Cargando clientes...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-2">Gestiona la información de tus clientes</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ name: '', phone: '', email: '', notes: '' });
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Nuevo Cliente
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="juan@example.com"
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
                    placeholder="Notas adicionales sobre el cliente..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  {editingId ? 'Actualizar' : 'Crear'} Cliente
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">{client.name}</h3>

              <div className="space-y-2 mb-4">
                {client.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <a href={`tel:${client.phone}`} className="hover:text-blue-600">
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <a href={`mailto:${client.email}`} className="hover:text-blue-600">
                      {client.email}
                    </a>
                  </div>
                )}
              </div>

              {client.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                  {client.notes}
                </div>
              )}

              <div className="py-3 border-t border-gray-200 mb-4">
                <p className="text-sm text-gray-600">Turnos totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {client.totalAppointments}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
                >
                  <Edit2 size={18} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition"
                >
                  <Trash2 size={18} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && !showForm && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No hay clientes registrados</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Crear el Primer Cliente
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
