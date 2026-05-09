import { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Modal from '../../../shared/components/ui/Modal';
import { administradoresService } from '../services/administradoresService';
import toast from 'react-hot-toast';

const CrearAdministradorModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    passwordConfirm: '',
    dni: '',
    tipoDocumento: 'DNI',
    telefono: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombres.trim()) newErrors.nombres = 'El nombre es requerido';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'El apellido es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Las contraseñas no coinciden';
    }
    
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
      const { passwordConfirm, ...datosEnvio } = formData;
      
      await administradoresService.crearAdministrador(datosEnvio);
      
      // Reset form
      setFormData({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        passwordConfirm: '',
        dni: '',
        tipoDocumento: 'DNI',
        telefono: ''
      });
      setErrors({});
      
      onSuccess();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear el administrador';
      toast.error(message);
      console.error('❌ Error:', error);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
      passwordConfirm: '',
      dni: '',
      tipoDocumento: 'DNI',
      telefono: ''
    });
    setErrors({});
    onClose();
  };

  const footer = (
    <>
      <Button
        variant="outline"
        onClick={handleClose}
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
        {loading ? 'Creando...' : 'Crear Administrador'}
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Administrador"
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
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombres"
              name="nombres"
              placeholder="Juan"
              value={formData.nombres}
              onChange={handleChange}
              error={errors.nombres}
              required
            />
            <Input
              label="Apellidos"
              name="apellidos"
              placeholder="Pérez"
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
            placeholder="admin@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          {/* Contraseña */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <Input
              label="Confirmar Contraseña"
              name="passwordConfirm"
              type="password"
              placeholder="••••••"
              value={formData.passwordConfirm}
              onChange={handleChange}
              error={errors.passwordConfirm}
              required
            />
          </div>

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
              placeholder="12345678"
              value={formData.dni}
              onChange={handleChange}
              error={errors.dni}
            />
          </div>

          {/* Teléfono */}
          <Input
            label="Teléfono (opcional)"
            name="telefono"
            placeholder="987654321"
            value={formData.telefono}
            onChange={handleChange}
            error={errors.telefono}
          />
        </form>
      </div>
    </Modal>
  );
};

export default CrearAdministradorModal;
