import api from '../../../shared/services/api';

/**
 * Servicio de Administradores - CRUD completo
 * Endpoints:
 *  - POST /api/usuarios/admin (Crear)
 *  - GET /api/usuarios/admin (Listar)
 *  - PUT /api/usuarios/admin/:id (Actualizar)
 *  - DELETE /api/usuarios/admin/:id (Eliminar)
 */
export const administradoresService = {
  /**
   * Listar todos los administradores
   * GET /api/usuarios/admin
   */
  listarAdministradores: async () => {
    try {
      const response = await api.get('/usuarios/admin');
      // El backend devuelve: { success, message, data: [...] }
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crear nuevo administrador
   * POST /api/usuarios/admin
   */
  crearAdministrador: async (adminData) => {
    try {
      const response = await api.post('/usuarios/admin', adminData);
      // { success, message, data: { usuario, token } }
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar administrador (activar/desactivar o cambiar datos)
   * PUT /api/usuarios/admin/:id
   */
  actualizarAdministrador: async (adminId, adminData) => {
    try {
      const response = await api.put(`/usuarios/admin/${adminId}`, adminData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar administrador
   * DELETE /api/usuarios/admin/:id
   */
  eliminarAdministrador: async (adminId) => {
    try {
      const response = await api.delete(`/usuarios/admin/${adminId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener detalles de un administrador específico
   * GET /api/usuarios/admin/:id
   */
  obtenerAdministrador: async (adminId) => {
    try {
      const response = await api.get(`/usuarios/admin/${adminId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Alias para compatibilidad con código existente
  getAll: async () => {
    return administradoresService.listarAdministradores();
  }
};

export default administradoresService;
