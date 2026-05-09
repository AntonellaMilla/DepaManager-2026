import api from '../../../shared/services/api';

export const edificiosService = {
  // Obtener todos los edificios del propietario
  getAll: async () => {
    const response = await api.get('/edificios');
    return response.data;
  },

  // Crear nuevo edificio
  create: async (edificioData) => {
    const response = await api.post('/edificios', edificioData);
    return response.data;
  },

  // Actualizar un edificio existente
  update: async (edificioId, edificioData) => {
    const response = await api.put(`/edificios/${edificioId}`, edificioData);
    return response.data;
  },

  // Eliminar edificio
  delete: async (edificioId) => {
    const response = await api.delete(`/edificios/${edificioId}`);
    return response.data;
  },

  // Asignar administrador a un edificio
  asignarAdmin: async (edificioId, data) => {
    const response = await api.post('/edificios/asignar-admin', {
      edificioId,
      ...data
    });
    return response.data;
  },

  // Mejorar plan de suscripción
  upgradePlan: async (edificioId, planData) => {
    const response = await api.post('/edificios/upgrade-plan', {
      edificioId,
      ...planData
    });
    return response.data;
  },

  // Obtener historial de un edificio específico
  getHistorial: async (edificioId) => {
    const response = await api.get(`/edificios/${edificioId}/historial`);
    return response.data;
  }
};