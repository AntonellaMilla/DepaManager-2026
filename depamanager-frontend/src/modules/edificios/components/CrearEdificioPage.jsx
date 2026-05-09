import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, AlertCircle } from 'lucide-react';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { edificiosService } from '../services/edificiosService';
import toast from 'react-hot-toast';

const CrearEdificioPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    distrito: '',
    descripcion: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validar campos
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await edificiosService.create(formData);

      toast.success('✓ Edificio creado exitosamente');
      navigate('/edificios');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear el edificio';
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/edificios')}
        size="lg"
        className="flex-1"
      >
        Cancelar
      </Button>

      <Button
        type="submit"
        variant="propietario"
        disabled={loading}
        icon={Building2}
        size="lg"
        className="flex-1"
      >
        {loading ? 'Creando...' : 'Crear Edificio'}
      </Button>
    </>
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <Building2 size={32} className="text-teal-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Edificio</h1>
            <p className="text-gray-600 mt-1">Completa los datos de tu nuevo edificio</p>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Error global */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
              <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECCIÓN 1: Información Básica */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                Información Básica
              </h2>
              <div className="space-y-4">
                <Input
                  label="Nombre del Edificio"
                  name="nombre"
                  placeholder="Ej: Edificio El Mirador"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={errors.nombre}
                  required
                />

                <Input
                  label="Dirección Completa"
                  name="direccion"
                  placeholder="Ej: Calle Principal 123"
                  value={formData.direccion}
                  onChange={handleChange}
                  error={errors.direccion}
                  required
                />
              </div>
            </div>

            {/* SECCIÓN 2: Ubicación */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                Ubicación
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Ciudad"
                  name="ciudad"
                  placeholder="Ej: Lima"
                  value={formData.ciudad}
                  onChange={handleChange}
                  error={errors.ciudad}
                />

                <Input
                  label="Provincia"
                  name="provincia"
                  placeholder="Ej: Lima"
                  value={formData.provincia}
                  onChange={handleChange}
                  error={errors.provincia}
                />

                <Input
                  label="Distrito"
                  name="distrito"
                  placeholder="Ej: Miraflores"
                  value={formData.distrito}
                  onChange={handleChange}
                  error={errors.distrito}
                />
              </div>
            </div>

 

            {/* BOTONES */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              {footer}
            </div>
          </form>
        </div>

        {/* INFO */}
        <div className="mt-8 p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="text-sm text-teal-800">
            <span className="font-semibold">💡 Tip:</span> Todos tus edificios estarán disponibles en el panel de control. Podrás asignar administradores y crear unidades después.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CrearEdificioPage;
