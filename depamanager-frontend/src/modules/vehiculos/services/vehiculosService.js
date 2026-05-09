import api from '../../../shared/services/api';

export const vehiculosService = {
  getAll: async () => {
    const response = await api.get('/vehiculos');
    return response.data;
  },

  // Crear vehículo (requiere inquilinoId)
  create: async (vehiculoData) => {
    const response = await api.post('/vehiculos', vehiculoData);
    return response.data;
  },

  toggleActivo: async (id) => {
    const response = await api.put(`/vehiculos/${id}/toggle`);
    return response.data;
  }
};