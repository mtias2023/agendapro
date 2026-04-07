import { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { serviceService } from '../services/serviceService';
import { Service } from '../types';
import { Trash2, CreditCard as Edit2, Plus } from 'lucide-react';

export function Services() {
  const { business } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    category: '',
  });

  useEffect(() => {
    if (!business) return;
    loadServices();
  }, [business]);

  const loadServices = async () => {
    if (!business) return;

    try {
      const data = await serviceService.getServices(business.id);
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    try {
      if (editingId) {
        await serviceService.updateService(editingId, {
          ...formData,
          isActive: true,
        });
      } else {
        await serviceService.createService(business.id, {
          ...formData,
          isActive: true,
        });
      }

      setFormData({ name: '', description: '', duration: 60, price: 0, category: '' });
      setEditingId(null);
      setShowForm(false);
      loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error al guardar el servicio');
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        await serviceService.softDeleteService(serviceId);
        loadServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Error al eliminar el servicio');
      }
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      category: service.category || '',
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Cargando servicios...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Servicios</h1>
            <p className="text-gray-600 mt-2">Gestiona los servicios de tu negocio</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ name: '', description: '', duration: 60, price: 0, category: '' });
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Nuevo Servicio
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Servicio
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Corte de Cabello"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Cortes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    step="15"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe el servicio..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  {editingId ? 'Actualizar' : 'Crear'} Servicio
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
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                  {service.category && (
                    <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{service.description}</p>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Duración</p>
                  <p className="text-lg font-bold text-gray-900">
                    {service.duration}m
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Precio</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${service.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
                >
                  <Edit2 size={18} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition"
                >
                  <Trash2 size={18} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && !showForm && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No hay servicios creados</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Crear el Primer Servicio
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
