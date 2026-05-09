const edificiosService = require("./edificios.service");
const { success, error } = require("../../shared/utils/response");
const { body, validationResult } = require("express-validator");

/**
 * Edificios Controller - Solo accesible por PROPIETARIO
 */
const edificiosController = {

  createValidation: [
    body('nombre').notEmpty().withMessage('El nombre del edificio es obligatorio'),
    body('direccion').optional(),
    body('ciudad').optional(),
    body('provincia').optional(),
    body('distrito').optional()
  ],

  /**
   * Crear nuevo edificio
   */
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 'Datos inválidos', 400, errors.array());
    }

    try {
      const resultado = await edificiosService.createEdificio(req.body, req.user.id);
      return success(res, resultado, 'Edificio creado correctamente con plan GRATUITO');
    } catch (err) {
      return error(res, err.message, 400);
    }
  },

  /**
   * Listar mis edificios
   */
  async listar(req, res) {
    try {
      const edificios = await edificiosService.listarEdificios(req.user.id);
      return success(res, edificios, 'Edificios obtenidos correctamente');
    } catch (err) {
      return error(res, err.message);
    }
  },

    /**
   * Asignar administrador a edificio
   */
  async asignarAdmin(req, res) {
    try {
      const { edificioId, adminId } = req.body;
      const resultado = await edificiosService.asignarAdministrador(edificioId, adminId, req.user.id);
      return success(res, resultado, 'Administrador asignado correctamente');
    } catch (err) {
      return error(res, err.message, 400);
    }
  },

  /**
   * Desasignar administrador de un edificio
   */
  async desasignarAdmin(req, res) {
    try {
      const { edificioId } = req.body;
      const resultado = await edificiosService.desasignarAdministrador(edificioId, req.user.id);
      return success(res, resultado, 'Administrador desasignado correctamente');
    } catch (err) {
      return error(res, err.message, 400);
    }
  },

  /**
   * Ver accesos globales
   */
  async accesosGlobales(req, res) {
    try {
      const accesos = await edificiosService.verAccesosGlobales(req.user.id);
      return success(res, accesos, 'Accesos globales obtenidos');
    } catch (err) {
      return error(res, err.message);
    }
  },

  /**
   * Ver alertas globales
   */
  async alertasGlobales(req, res) {
    try {
      const alertas = await edificiosService.verAlertasGlobales(req.user.id);
      return success(res, alertas, 'Alertas globales obtenidas');
    } catch (err) {
      return error(res, err.message);
    }
  },

    /**
   * Upgrade de plan de un edificio
   */
  async upgradePlan(req, res) {
    try {
      const { edificioId, nuevoPlan } = req.body; // nuevoPlan = "ESTANDAR" o "PREMIUM"
      const resultado = await edificiosService.upgradePlan(edificioId, nuevoPlan, req.user.id);
      return success(res, resultado, 'Plan actualizado correctamente');
    } catch (err) {
      return error(res, err.message, 400);
    }
  },

    /**
   * Actualizar edificio
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const resultado = await edificiosService.updateEdificio(id, req.body, req.user.id);
      return success(res, resultado, 'Edificio actualizado correctamente');
    } catch (err) {
      return error(res, err.message, 400);
    }
  },

  /**
   * Eliminar edificio (soft delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await edificiosService.deleteEdificio(id, req.user.id);
      return success(res, null, 'Edificio eliminado correctamente');
    } catch (err) {
      return error(res, err.message, 400);
    }
  },

    /**
   * Ver historial de actividades de un edificio
   */
  async historialActividades(req, res) {
    try {
      const { id } = req.params;
      const historial = await edificiosService.verHistorialActividades(id, req.user.id);
      return success(res, historial, 'Historial de actividades obtenido');
    } catch (err) {
      return error(res, err.message, 400);
    }
  }
};

module.exports = edificiosController;
