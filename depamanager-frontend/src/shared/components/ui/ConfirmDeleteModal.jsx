import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

/**
 * ConfirmDeleteModal - Modal reutilizable para confirmar eliminación
 * Se puede usar en cualquier parte de la aplicación
 * 
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {function} onClose - Callback cuando se cierra
 * @param {function} onConfirm - Callback cuando se confirma la eliminación
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje de confirmación
 * @param {string} confirmText - Texto del botón de confirmar (default: "Eliminar")
 * @param {string} cancelText - Texto del botón de cancelar (default: "Cancelar")
 * @param {boolean} loading - Si se está procesando (para deshabilitar botones)
 */
const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Confirmar eliminación?',
  message = '¿Está seguro de que desea eliminar? Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  loading = false
}) => {
  const footer = (
    <>
      <Button
        variant="outline"
        onClick={onClose}
        disabled={loading}
        size="md"
      >
        {cancelText}
      </Button>
      <Button
        variant="danger"
        onClick={onConfirm}
        disabled={loading}
        loading={loading}
        size="md"
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
      variant="danger"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <AlertTriangle size={24} className="text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-gray-700 leading-relaxed font-medium">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
