import { useState, useEffect } from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Modal from '../../../shared/components/ui/Modal';
import { edificiosService } from '../services/edificiosService';
import toast from 'react-hot-toast';

const EditarEdificioModal = ({ isOpen, onClose, edificio, onSuccess }) => {
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

  // Sincronizar formData cuando el edificio cambia
  useEffect(() => {
    if (edificio && isOpen) {
      setFormData({
        nombre: edificio.nombre || '',
        direccion: edificio.direccion || '',
        ciudad: edificio.ciudad || '',
        provincia: edificio.provincia || '',
        distrito: edificio.distrito || '',
        descripcion: edificio.descripcion || ''
      });
      setErrors({});
    }
  }, [edificio, isOpen]);

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
      await edificiosService.update(edificio.id, formData);

      toast.success('✓ Edificio actualizado exitosamente');
      onClose();
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar el edificio';
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
        variant="propietario"
        onClick={handleSubmit}
        disabled={loading}
        icon={Building2}
        size="md"
      >
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Edificio"
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
            label="Nombre del Edificio"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errors.nombre}
            required
          />

          <Input
            label="Dirección Completa"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            error={errors.direccion}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              error={errors.ciudad}
            />
            <Input
              label="Provincia"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              error={errors.provincia}
            />
          </div>

          <Input
            label="Distrito"
            name="distrito"
            value={formData.distrito}
            onChange={handleChange}
            error={errors.distrito}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Información adicional del edificio..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditarEdificioModal;
