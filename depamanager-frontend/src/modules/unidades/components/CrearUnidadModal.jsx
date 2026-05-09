import { useState, useContext } from 'react';
import { DoorOpen, AlertCircle } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal'
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { unidadesService } from '../services/unidadesService';
import { AuthContext } from '../../../shared/context/AuthContext';
import toast from 'react-hot-toast';

const CrearUnidadModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    numero: '',
    piso: '',
    capacidadMaxima: 2,
    activa: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validar campos
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
      const edificioId = user?.administradores?.[0]?.edificioId;
      const dataToSend = {
        numero: formData.numero,
        piso: parseInt(formData.piso),
        capacidadMaxima: parseInt(formData.capacidadMaxima),
        activa: formData.activa,
        edificioId: edificioId,
      };
      await unidadesService.create(dataToSend);

      toast.success('✓ Unidad creada exitosamente');
      
      setFormData({
        numero: '',
        piso: '',
        capacidadMaxima: 2,
        activa: true,
      });
      setErrors({});
      
      onClose();
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear la unidad';
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <Button
        variant="outline"
        onClick={onClose}
        disabled={loading}
        size="md"
      >
        Cancelar
      </Button>
      <Button
        variant="admin"
        onClick={handleSubmit}
        disabled={loading}
        icon={DoorOpen}
        size="md"
      >
        {loading ? 'Creando...' : 'Crear Unidad'}
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nueva Unidad"
      footer={footer}
      size="md"
    >
      <div className="space-y-4">
        {/* Error global */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Número de Unidad"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            error={errors.numero}
            placeholder="Ej: 101, A-202"
            required
          />

          <div className="grid grid-cols-2 gap-4">
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

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="activa"
              id="activa"
              checked={formData.activa}
              onChange={handleChange}
              className="w-5 h-5 cursor-pointer"
            />
            <label htmlFor="activa" className="text-sm font-medium text-gray-700 cursor-pointer">
              Unidad activa
            </label>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CrearUnidadModal;
