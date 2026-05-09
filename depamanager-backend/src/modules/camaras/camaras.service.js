const camarasRepository = require('./camaras.repository');
const auditoriaRepository = require('../accesos/auditoria.repository');

/**
 * Cámaras Service
 */
const camarasService = {

  async registrarCamara(data, edificioId, adminId) {
    const camara = await camarasRepository.create(data, edificioId);

    await auditoriaRepository.create(
      adminId,
      edificioId,
      'REGISTRAR_CAMARA',
      `Cámara "${data.nombre}" registrada`
    );

    return camara;
  },

  async listarCamaras(edificioId) {
    return await camarasRepository.findByEdificio(edificioId);
  }
};

module.exports = camarasService;