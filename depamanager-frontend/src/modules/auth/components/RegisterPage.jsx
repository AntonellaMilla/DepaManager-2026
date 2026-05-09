import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { AUTH_COLORS } from './config/authConfig';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    dni: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const colors = AUTH_COLORS.propietario;

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'El nombre es requerido';
    }
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'El apellido es requerido';
    }

    // Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Contraseña (mínimo 6 caracteres)
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    // Confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // DNI (opcional pero si se ingresa debe ser válido)
    if (formData.dni && formData.dni.length < 3) {
      newErrors.dni = 'DNI inválido';
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
    setErrors({});

    try {
      // Registrar como propietario (rolId será asignado por el backend)
      const response = await authService.register({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono || null,
        dni: formData.dni || null
      });

      toast.success('✓ Cuenta creada exitosamente. Iniciando sesión...');
      
      // Redirigir a login
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear la cuenta';
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const headerGradient = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`;

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f4c3f 0%, #1a6e5f 100%)' }} className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con color propietario */}
          <div style={{ background: headerGradient }} className="p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Nuevo Propietario</h1>
            <p className="text-white/90 text-sm mt-2">Crea tu cuenta para gestionar edificios</p>
          </div>

          {/* Contenido */}
          <div className="p-8">
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  error={errors.nombres}
                  placeholder=""
                  required
                />
                <Input
                  label="Apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  error={errors.apellidos}
                  placeholder=""
                  required
                />
              </div>

              <Input
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder=""
                required
              />

              <Input
                label="Teléfono (opcional)"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                error={errors.telefono}
                placeholder=""
              />

              <Input
                label="DNI/Documento (opcional)"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                error={errors.dni}
                
              />

              <Input
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                hint="Mínimo 6 caracteres"
                required
              />

              <Input
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="••••••••"
                required
              />

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {errors.submit}
                </div>
              )}

              <Button
                type="submit"
                variant="propietario"
                size="lg"
                disabled={loading}
                className="w-full"
                icon={Crown}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-4">
                ¿Ya tienes cuenta?
              </p>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  icon={ArrowLeft}
                >
                  Volver a Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer de página */}
        <p className="text-center text-gray-300 text-xs mt-6">
          © 2026 DepaManager. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
