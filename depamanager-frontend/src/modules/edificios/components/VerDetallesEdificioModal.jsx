import { Building2, MapPin, FileText, User, X } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Modal from '../../../shared/components/ui/Modal';

const VerDetallesEdificioModal = ({ isOpen, onClose, edificio }) => {
  if (!edificio) return null;

  const admin = edificio.administradores?.[0];

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Edificio"
      size="md"
    >
      <div className="space-y-6">
        {/* Encabezado con nombre */}
        <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
            <Building2 size={24} className="text-teal-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{edificio.nombre}</h3>
            <p className="text-sm text-gray-600">
              {edificio.ciudad && edificio.provincia ? `${edificio.ciudad}, ${edificio.provincia}` : 'Ubicación no especificada'}
            </p>
          </div>
        </div>

        {/* Información general */}
        <div className="grid grid-cols-2 gap-4">
          {/* Dirección */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-gray-600" />
              <p className="text-xs font-semibold text-gray-700">Dirección</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {edificio.direccion || '—'}
            </p>
          </div>

          {/* Plan */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Plan Actual</p>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {edificio.suscripcion?.plan?.nombre || 'GRATUITO'}
            </span>
          </div>

          {/* Ciudad */}
          {edificio.ciudad && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Ciudad</p>
              <p className="text-sm font-medium text-gray-900">{edificio.ciudad}</p>
            </div>
          )}

          {/* Provincia */}
          {edificio.provincia && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Provincia</p>
              <p className="text-sm font-medium text-gray-900">{edificio.provincia}</p>
            </div>
          )}

          {/* Distrito */}
          {edificio.distrito && (
            <div className="bg-gray-50 rounded-lg p-4 col-span-2">
              <p className="text-xs font-semibold text-gray-700 mb-2">Distrito</p>
              <p className="text-sm font-medium text-gray-900">{edificio.distrito}</p>
            </div>
          )}
        </div>

        {/* Administrador Asignado */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-blue-600" />
            <p className="text-xs font-semibold text-gray-700">Administrador Asignado</p>
          </div>
          {admin ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm font-bold text-green-700">
                  {admin.usuario?.nombres?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {admin.usuario?.nombres} {admin.usuario?.apellidos}
                </p>
                <p className="text-xs text-gray-600">{admin.usuario?.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-lg">❌</span> Sin administrador asignado
            </p>
          )}
        </div>

        {/* Descripción */}
        {edificio.descripcion && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-600" />
              <p className="text-xs font-semibold text-gray-700">Descripción</p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {edificio.descripcion}
            </p>
          </div>
        )}

        {/* Fechas */}
        <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
          <p>Creado el {new Date(edificio.fechaCreacion).toLocaleDateString('es-PE')}</p>
        </div>
      </div>
    </Modal>
  );
};

export default VerDetallesEdificioModal;
