import { useState, useEffect } from 'react';
import { TrendingUp, Check, AlertCircle } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Modal from '../../../shared/components/ui/Modal';
import { edificiosService } from '../services/edificiosService';
import toast from 'react-hot-toast';

const UpgradePlanModal = ({ isOpen, onClose, edificio, onSuccess }) => {
  const [plan, setPlan] = useState('ESTANDAR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Resetear cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setPlan('ESTANDAR');
      setError('');
    }
  }, [isOpen]);

  const planesDisponibles = [
    { 
      value: 'GRATUITO', 
      label: 'Gratuito', 
      description: 'Plan básico',
      features: ['5 unidades máximo', 'Acceso básico', 'Soporte por email']
    },
    { 
      value: 'ESTANDAR', 
      label: 'Estándar', 
      description: 'Funciones adicionales',
      features: ['50 unidades máximo', 'Acceso completo', 'Soporte prioritario', 'Reportes avanzados']
    },
    { 
      value: 'PREMIUM', 
      label: 'Premium', 
      description: 'Todas las funciones',
      features: ['Unidades ilimitadas', 'Acceso completo', 'Soporte 24/7', 'Reportes avanzados', 'API access']
    }
  ];

  const planActual = edificio?.suscripcion?.plan?.nombre || 'GRATUITO';
  const planSeleccionado = planesDisponibles.find(p => p.value === plan);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (plan === planActual) {
      setError('Debes seleccionar un plan diferente al actual');
      return;
    }

    setLoading(true);

    try {
      await edificiosService.upgradePlan(edificio.id, { plan });
      toast.success(`✓ Plan actualizado a ${plan}`);
      onClose();
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar el plan';
      toast.error(message);
      setError(message);
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
        variant="success"
        onClick={handleSubmit}
        disabled={loading || plan === planActual}
        icon={TrendingUp}
        size="md"
      >
        {loading ? 'Procesando...' : 'Confirmar Cambio'}
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title="Mejorar Plan de Suscripción"
      footer={footer}
      size="lg"
    >
      <div className="space-y-4">
        {/* Plan actual */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Plan actual:</span> 
            <span className="text-blue-700 font-bold ml-2">{planActual}</span>
            <span className="text-blue-600 text-xs ml-2">({edificio?.nombre})</span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Planes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Selecciona el nuevo plan:
          </label>
          <div className="space-y-3">
            {planesDisponibles.map((option) => (
              <label 
                key={option.value} 
                className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  plan === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={option.value}
                  checked={plan === option.value}
                  onChange={(e) => {
                    setPlan(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  className="w-5 h-5 mt-0.5 accent-blue-600 cursor-pointer"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{option.label}</p>
                    {option.value === planActual && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">
                        Actual
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                  
                  {/* Features */}
                  <ul className="mt-3 space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check size={14} className="text-green-600 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradePlanModal;
