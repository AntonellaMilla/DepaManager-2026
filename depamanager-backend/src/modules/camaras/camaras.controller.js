const camarasService = require("./camaras.service");
const { success, error } = require("../../shared/utils/response");
const { body, validationResult } = require('express-validator');

/**
 * Cámaras Controller
 * Solo el administrador del edificio puede registrar y ver sus cámaras
 */
const camarasController = {

  createValidation: [
    body('nombre').notEmpty().withMessage('El nombre de la cámara es obligatorio'),
    body('ubicacion').optional(),
    body('urlStream').notEmpty().withMessage('La URL RTSP o HTTP de la cámara es obligatoria')
  ],

  /**
   * Registrar nueva cámara en el edificio del administrador
   */
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 'Datos inválidos', 400, errors.array());
    }

    try {
      const camara = await camarasService.registrarCamara(
        req.body,
        req.user.edificioId,   // Solo del edificio del administrador
        req.user.id
      );
      return success(res, camara, 'Cámara registrada correctamente');
    } catch (err) {
      return error(res, err.message, 400);
    }
  },

  /**
   * Listar cámaras del edificio del administrador
   */
  async listar(req, res) {
    try {
      const camaras = await camarasService.listarCamaras(req.user.edificioId);
      return success(res, camaras, 'Cámaras listadas correctamente');
    } catch (err) {
      return error(res, err.message);
    }
  }
};

module.exports = camarasController;