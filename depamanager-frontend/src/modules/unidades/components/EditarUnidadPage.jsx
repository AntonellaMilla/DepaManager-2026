import { useState, useEffect } from 'react';
import { DoorOpen } from 'lucide-react';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { unidadesService } from '../services/unidadesService';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditarUnidadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numero: '',
    piso: '',
    capacidadMaxima: 2,
    activa: true,
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  // ================= CARGAR DATA =================
  useEffect(() => {
    const fetchUnidad = async () => {
      try {
        setLoadingData(true);

        const response = await unidadesService.getAll();
        const unidades = response.data?.data || response.data || [];

        const unidad = unidades.find((u) => u.id === id);

        if (!unidad) {
          toast.error('Unidad no encontrada');
          navigate('/unidades');
          return;
        }

        setFormData({
          numero: unidad.numero,
          piso: unidad.piso,
          capacidadMaxima: unidad.capacidadMaxima,
          activa: unidad.activa,
        });

      } catch (error) {
        toast.error('Error al cargar la unidad');
        console.error(error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUnidad();
  }, [id, navigate]);

  // ================= HANDLE =================
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
      newErrors.piso = 'El piso debe ser válido';
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
      await unidadesService.update(id, {
        numero: formData.numero,
        piso: parseInt(formData.piso),
        capacidadMaxima: parseInt(formData.capacidadMaxima),
        activa: formData.activa,
      });

      toast.success('Unidad actualizada correctamente');
      navigate('/unidades');

    } catch (error) {
      const message =
        error.response?.data?.message || 'Error al actualizar';

      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (loadingData) {
    return (
      <Layout>
        <p className="text-center mt-10">Cargando unidad...</p>
      </Layout>
    );
  }

  // ================= UI =================
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <DoorOpen size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Editar Unidad
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-8 space-y-6"
        >
          <Input
            label="Número"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            error={errors.numero}
            required
          />

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

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="activa"
              checked={formData.activa}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-sm text-gray-700">
              Unidad activa
            </label>
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/unidades')}
              className="flex-1"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="admin"
              disabled={loading}
              className="flex-1"
              icon={DoorOpen}
            >
              {loading ? 'Guardando...' : 'Actualizar'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditarUnidadPage;