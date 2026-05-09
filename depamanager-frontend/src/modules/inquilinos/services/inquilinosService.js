import api from '../../../shared/services/api';

export const inquilinosService = {
  /**
   * Listar inquilinos del edificio del administrador
   */
  getAll: async () => {
    const response = await api.get('/inquilinos');
    return response.data;
  },

  /**
   * FLUJO COMPLETO: Crear inquilino con datos personales
   * El sistema crea automáticamente el usuario con rol INQUILINO
   */
  createCompleto: async (datosInquilino) => {
    const response = await api.post('/inquilinos/registro', datosInquilino);
    return response.data;
  },

  /**
   * Crear inquilino con usuario ya existente
   */
  create: async (inquilinoData) => {
    const response = await api.post('/inquilinos', inquilinoData);
    return response.data;
  },

  /**
   * Obtener detalles de un inquilino específico
   */
  getById: async (id) => {
    const response = await api.get(`/inquilinos/${id}`);
    return response.data;
  },

  /**
   * Actualizar datos del inquilino
   */
  update: async (id, inquilinoData) => {
    const response = await api.put(`/inquilinos/${id}`, inquilinoData);
    return response.data;
  },

  /**
   * Finalizar contrato de inquilino
   */
  finalizarContrato: async (id) => {
    const response = await api.put(`/inquilinos/${id}/finalizar`);
    return response.data;
  }
};