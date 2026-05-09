const prisma = require("../../shared/config/database");

/**
 * Cámaras Repository
 */
const camarasRepository = {

  /**
   * Registrar nueva cámara en el edificio
   */
  async create(data, edificioId) {
    return await prisma.camara.create({
      data: {
        edificioId,
        nombre: data.nombre,
        ubicacion: data.ubicacion,
        urlStream: data.urlStream,        // RTSP o HTTP
        activa: true
      }
    });
  },

  /**
   * Listar cámaras del edificio
   */
  async findByEdificio(edificioId) {
    return await prisma.camara.findMany({
      where: { edificioId, activa: true }
    });
  }
};

module.exports = camarasRepository;