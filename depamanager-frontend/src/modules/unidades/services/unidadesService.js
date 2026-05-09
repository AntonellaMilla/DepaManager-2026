import api from '../../../shared/services/api';

export const unidadesService = {

  // 📥 Obtener todas las unidades
  getAll: async () => {
    const response = await api.get('/unidades');
    return response.data?.data || response.data;
  },

  // 📥 Obtener una unidad por ID (útil para editar)
  getById: async (id) => {
    const response = await api.get(`/unidades/${id}`);
    return response.data?.data || response.data;
  },

  // ➕ Crear unidad
  create: async (data) => {
    const response = await api.post('/unidades', data);
    return response.data;
  },

  // 🔄 Actualizar unidad
  update: async (id, data) => {
    const response = await api.put(`/unidades/${id}`, data);
    return response.data;
  },

  // ❌ Eliminar (o desactivar) unidad
  delete: async (id) => {
    const response = await api.delete(`/unidades/${id}`);
    return response.data;
  },

  // ⚡ Crear unidades por rango (según tu backend)
  createRango: async (data) => {
    // Ejemplo data:
    // { desde: 101, hasta: 105, piso: 1, capacidadMaxima: 2 }
    const response = await api.post('/unidades/rango', data);
    return response.data;
  }
};