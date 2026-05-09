const prisma = require("../../shared/config/database");

/**
 * Auditoría Repository
 * Registra actividades importantes
 * usuarioId puede ser null (cuando viene de la IA automática)
 */
const auditoriaRepository = {

  /**
   * Crear registro de auditoría
   * Versión segura para cuando usuarioId es null
   */
  async create(usuarioId, edificioId, accion, descripcion) {
    return await prisma.auditoria.create({
      data: {
        usuarioId: usuarioId || null,
        edificioId: edificioId,
        accion: accion,
        descripcion: descripcion
      }
    });
  },

  /**
   * Obtener historial de actividades de un edificio
   */
  async findByEdificio(edificioId) {
    return await prisma.auditoria.findMany({
      where: { edificioId },
      include: {
        usuario: {
          select: { nombres: true, apellidos: true, email: true }
        }
      },
      orderBy: { fecha: 'desc' }
    });
  },

  /**
   * Obtener historial de accesos por edificios
   */
  async findAccesosByEdificios(edificioIds) {
    return await prisma.historialAcceso.findMany({
      where: { edificioId: { in: edificioIds } },
      include: {
        vehiculo: true,
        camara: true,
        alerta: true
      },
      orderBy: { fechaEvento: 'desc' }
    });
  },

  /**
   * Obtener alertas por edificios
   */
  async findAlertasByEdificios(edificioIds) {
    return await prisma.alerta.findMany({
      where: { edificioId: { in: edificioIds } },
      include: {
        historial: true
      },
      orderBy: { fechaCreacion: 'desc' }
    });
  }
};

module.exports = auditoriaRepository;