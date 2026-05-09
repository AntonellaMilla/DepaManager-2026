import { useState, useContext } from 'react';
import { DoorOpen } from 'lucide-react';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { unidadesService } from '../services/unidadesService';
import { AuthContext } from '../../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CrearUnidadPage = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    numero: '',
    piso: '',
    capacidadMaxima: 2,
    activa: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ================= VALIDACIÓN =================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.numero.trim()) {
      newErrors.numero = 'El número es requerido';
    }

    if (!formData.piso || isNaN(formData.piso)) {
      newErrors.piso = 'El piso debe ser un número válido';
    }

    if (!formData.capacidadMaxima || formData.capacidadMaxima <= 0) {
      newErrors.capacidadMaxima = 'Debe ser mayor a 0';
    }

    return newErrors;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Obtener edificioId del usuario administrador
      const edificioId = user?.administradores?.[0]?.edificioId;

      await unidadesService.create({
        numero: formData.numero,
        piso: parseInt(formData.piso),
        capacidadMaxima: parseInt(formData.capacidadMaxima),
        activa: formData.activa,
        edificioId: edificioId,
      });

      toast.success('✓ Unidad creada exitosamente');
      navigate('/unidades');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Error al crear la unidad';

      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <DoorOpen size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Crear Nueva Unidad
          </h1>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-8 space-y-6"
        >
          {/* NUMERO */}
          <Input
            label="Número de Unidad"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            error={errors.numero}
            placeholder="Ej: 101, A-202"
            required
          />

          {/* PISO + CAPACIDAD */}
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Piso"
              name="piso"
              type="number"
              value={formData.piso}
              onChange={handleChange}
              error={errors.piso}
              required
            />

            <Input
              label="Capacidad Máxima"
              name="capacidadMaxima"
              type="number"
              value={formData.capacidadMaxima}
              onChange={handleChange}
              error={errors.capacidadMaxima}
              required
            />
          </div>

          {/* ACTIVA */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="activa"
              checked={formData.activa}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-sm font-medium text-gray-700">
              Unidad activa
            </label>
          </div>

          {/* ERROR GLOBAL */}
          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          {/* BOTONES */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/unidades')}
              className="flex-1"
              size="lg"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="admin"
              disabled={loading}
              icon={DoorOpen}
              className="flex-1"
              size="lg"
            >
              {loading ? 'Creando...' : 'Crear Unidad'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CrearUnidadPage;