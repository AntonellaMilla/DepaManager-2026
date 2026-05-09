const edificiosRepository = require("./edificios.repository");
const administradoresRepository = require("./administradores.repository");
const usuariosRepository = require("../usuarios/usuarios.repository");
const auditoriaRepository = require("../accesos/auditoria.repository");
const planesRepository = require("./planes.repository");

/**
 * Edificios Service - Solo para rol PROPIETARIO
 */
const edificiosService = {

  /**
   * Crear nuevo edificio + suscripción GRATUITA automática
   */
  async createEdificio(data, propietarioId) {
    const planGratuito = await planesRepository.findByName('GRATUITO');

    if (!planGratuito) {
      throw new Error('Plan GRATUITO no encontrado en la base de datos');
    }

    const edificio = await edificiosRepository.create(data, propietarioId, planGratuito.id);
    return edificio;
  },

  /**
   * Listar todos los edificios del propietario
   */
  async listarEdificios(propietarioId) {
    return await edificiosRepository.findByPropietarioId(propietarioId);
  },

  /**
   * Asignar Administrador a un Edificio
   */
  async asignarAdministrador(edificioId, adminUsuarioId, propietarioId) {
    const edificio = await edificiosRepository.findById(edificioId);
    if (!edificio || edificio.propietarioId !== propietarioId) {
      throw new Error('No tienes permiso para gestionar este edificio');
    }

    const adminUsuario = await usuariosRepository.findById(adminUsuarioId);
    if (!adminUsuario || adminUsuario.rol.nombre !== 'ADMINISTRADOR') {
      throw new Error('El usuario debe tener rol ADMINISTRADOR');
    }

    const asignacion = await administradoresRepository.assignAdmin(adminUsuarioId, edificioId);
    return asignacion;
  },

  /**
   * Ver accesos globales de todos los edificios del propietario
   */
  async verAccesosGlobales(propietarioId) {
    const edificios = await edificiosRepository.findByPropietarioId(propietarioId);
    const edificioIds = edificios.map(e => e.id);

    return await auditoriaRepository.findAccesosByEdificios(edificioIds);
  },

  /**
   * Ver alertas globales
   */
  async verAlertasGlobales(propietarioId) {
    const edificios = await edificiosRepository.findByPropietarioId(propietarioId);
    const edificioIds = edificios.map(e => e.id);

    return await auditoriaRepository.findAlertasByEdificios(edificioIds);
  },
    /**
   * Upgrade de plan (simula pago y confirmación)
   * Por ahora el pago es simulado (en producción se integraría con Stripe/PayU)
   */
  async upgradePlan(edificioId, nuevoPlanNombre, propietarioId) {
    const planNuevo = await planesRepository.findByName(nuevoPlanNombre);

    if (!planNuevo) throw new Error('Plan no encontrado');

    // Simulación de pago (en fase de prueba)
    console.log(`💳 Simulando pago para upgrade a ${nuevoPlanNombre}...`);

    const suscripcionActualizada = await edificiosRepository.upgradePlan(
      edificioId,
      planNuevo.id,
      propietarioId
    );

    return {
      mensaje: `Plan actualizado a ${nuevoPlanNombre} correctamente`,
      suscripcion: suscripcionActualizada,
      nota: 'Pago simulado y confirmado (fase de prueba)'
    };
  },

    async updateEdificio(id, data, propietarioId) {
    return await edificiosRepository.update(id, data, propietarioId);
  },

  async deleteEdificio(id, propietarioId) {
    return await edificiosRepository.delete(id, propietarioId);
  },

    /**
   * Ver historial de actividades de un edificio específico
   */
  async verHistorialActividades(edificioId, propietarioId) {
    const edificio = await edificiosRepository.findById(edificioId);
    if (!edificio || edificio.propietarioId !== propietarioId) {
      throw new Error('No tienes permiso para ver este edificio');
    }

    return await auditoriaRepository.findByEdificio(edificioId);
  }
};

module.exports = edificiosService;
