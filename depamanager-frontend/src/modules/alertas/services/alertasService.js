import api from '../../../shared/services/api';

// TODO: Implementar servicios de alertas
// El backend debe tener endpoints para gestionar alertas del sistema
export const alertasService = {
  // TODO: Implementar getAll para obtener todas las alertas
  getAll: async () => {
    const response = await api.get('/alertas');
    return response.data;
  },

  // TODO: Implementar otros métodos según sea necesario
  // - getById
  // - marcar como leída
  // - filtrar por tipo/prioridad
  // - eliminar alertas
};

export default alertasService;
