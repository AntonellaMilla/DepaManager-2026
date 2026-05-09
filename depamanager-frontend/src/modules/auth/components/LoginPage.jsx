import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Crown, UserCog, Users } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { AUTH_COLORS } from './config/authConfig';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Validar campos
  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'El email es requerido';
    if (!password) newErrors.password = 'La contraseña es requerida';
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
    setErrors({});

    try {
      const response = await authService.login(email, password);
      const { usuario, token } = response;
      
      login(usuario, token);
      toast.success('✓ ¡Inicio de sesión exitoso!');
      navigate('/dashboard');

    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const gradientColor = `linear-gradient(135deg, ${AUTH_COLORS.propietario.primary} 0%, ${AUTH_COLORS.administrador.primary} 100%)`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con gradiente */}
          <div style={{ background: gradientColor }} className="p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">DepaManager</h1>
            <p className="text-white/90 text-sm mt-2">Sistema de Gestión Inteligente de Edificios</p>
          </div>

          {/* Contenido */}
          <div className="p-8">
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Correo Electrónico"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                error={errors.email}
                placeholder="tu@email.com"
                required
              />

              <Input
                label="Contraseña"
                name="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                error={errors.password}
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
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-4">
                ¿No tienes cuenta?
              </p>
              <Link to="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  icon={Crown}
                >
                  Registrarse como Propietario
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer de página */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 DepaManager. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;