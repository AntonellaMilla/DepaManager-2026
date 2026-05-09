import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { vehiculosService } from '../services/vehiculosService';
import toast from 'react-hot-toast';

const CrearVehiculoPage = () => {
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    color: '',
    tipo: 'AUTO',
    anio: '',
    inquilinoId: '',        // ← Muy importante: se asocia al inquilino
    descripcion: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.inquilinoId) {
      toast.error("Debes ingresar el ID del Inquilino");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        anio: formData.anio ? parseInt(formData.anio) : null,
      };

      await vehiculosService.create(dataToSend);
      
      toast.success('Vehículo registrado correctamente');
      navigate('/vehiculos');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar el vehículo';
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Registrar Nuevo Vehículo</h1>
          <p className="text-gray-600 mt-2">Asocia el vehículo a un inquilino existente</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          
          <Input
            label="ID del Inquilino *"
            name="inquilinoId"
            value={formData.inquilinoId}
            onChange={handleChange}
            placeholder="Ej: uuid-del-inquilino"
            required
          />

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Placa *"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              placeholder="ABC-1234"
              required
            />
            <Input
              label="Año"
              name="anio"
              type="number"
              value={formData.anio}
              onChange={handleChange}
              placeholder="2024"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Marca *"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              placeholder="Toyota"
              required
            />
            <Input
              label="Modelo *"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              placeholder="Corolla"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Color *"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Blanco"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Vehículo
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AUTO">Auto</option>
                <option value="MOTO">Moto</option>
                <option value="CAMIONETA">Camioneta</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notas adicionales..."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate('/vehiculos')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Registrando...' : 'Registrar Vehículo'}
            </Button>
          </div>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Nota: Debes usar el <strong>ID del Inquilino</strong> (no el email). 
          Puedes obtenerlo desde la página de Inquilinos o desde el backend.
        </p>
      </div>
    </Layout>
  );
};

export default CrearVehiculoPage;