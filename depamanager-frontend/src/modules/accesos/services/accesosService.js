import api from '../../../shared/services/api';

// TODO: Implementar servicios de accesos
// El backend debe tener endpoints para gestionar el historial de accesos
export const accesosService = {
  // TODO: Implementar getAll para obtener historial de accesos
  getAll: async () => {
    const response = await api.get('/accesos');
    return response.data;
  },

  // TODO: Implementar otros métodos según sea necesario
  // - getById
  // - filtrar por edificio/unidad
  // - filtrar por fechas
};

export default accesosService;
