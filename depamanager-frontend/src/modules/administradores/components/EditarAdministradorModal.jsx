import { useState, useEffect } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Modal from '../../../shared/components/ui/Modal';
import { administradoresService } from '../services/administradoresService';
import toast from 'react-hot-toast';

const EditarAdministradorModal = ({ isOpen, onClose, admin, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    dni: '',
    tipoDocumento: 'DNI',
    telefono: '',
    activo: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Sincronizar formData cuando el administrador cambia
  useEffect(() => {
    if (admin && isOpen) {
      setFormData({
        nombres: admin.nombres || '',
        apellidos: admin.apellidos || '',
        email: admin.email || '',
        dni: admin.dni || '',
        tipoDocumento: admin.tipoDocumento || 'DNI',
        telefono: admin.telefono || '',
        activo: admin.activo !== false
      });
      setErrors({});
    }
  }, [admin, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar campos
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombres.trim()) newErrors.nombres = 'El nombre es requerido';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'El apellido es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    
    return newErrors;
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
      await administradoresService.actualizarAdministrador(admin.id, formData);
      
      toast.success('✓ Administrador actualizado exitosamente');
      setErrors({});
      onClose();
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar el administrador';
      toast.error(message);
      console.error('❌ Error:', error);
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
        variant="administrador"
        onClick={handleSubmit}
        disabled={loading}
        icon={Shield}
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
      title="Editar Administrador"
      footer={footer}
      size="md"
    >
      {admin && (
        <div className="space-y-4">
          {/* Error global */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombres y Apellidos */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                error={errors.nombres}
                required
              />
              <Input
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                error={errors.apellidos}
                required
              />
            </div>

            {/* Email */}
            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            {/* DNI y Documento */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all font-medium"
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>
              <Input
                label="Número de Documento"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                error={errors.dni}
              />
            </div>

            {/* Teléfono */}
            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              error={errors.telefono}
            />

            {/* Estado */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="w-5 h-5 rounded cursor-pointer accent-blue-600"
              />
              <label htmlFor="activo" className="flex-1 cursor-pointer">
                <p className="font-semibold text-gray-800">Administrador Activo</p>
                <p className="text-xs text-gray-600">
                  {formData.activo ? 'Este administrador puede acceder al sistema' : 'Este administrador no puede acceder'}
                </p>
              </label>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default EditarAdministradorModal;
