const accesosService = require("./accesos.service");
const { success, error } = require("../../shared/utils/response");

/**
 * Accesos Controller - Recibe placas detectadas desde Python
 */
const accesosController = {

  async registrar(req, res) {
    try {
      const { placaDetectada, camaraId } = req.body;

      if (!placaDetectada || !camaraId) {
        return error(res, 'Faltan datos de placa o cámara', 400);
      }

      const resultado = await accesosService.registrarDesdeIA(placaDetectada, camaraId);
      return success(res, resultado, 'Placa procesada correctamente');
    } catch (err) {
      console.error(err);
      return error(res, 'Error al procesar placa', 500);
    }
  }
};

module.exports = accesosController;