const edificiosRepository = require("./edificios.repository");
const administradoresRepository = require("./administradores.repository");
const usuariosRepository = require("../usuarios/usuarios.repository");
const auditoriaRepository = require("../accesos/auditoria.repository");
const planesRepository = require("./planes.repository");
const pagosService = require("../pagos/pagos.service");

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
   * Pago de suscripción mensual — delegado a pagos.service.
   * Sin tokenPago: inicia checkout. Con tokenPago: confirma, boleta PDF y extiende vencimiento +1 mes.
   * operacion: UPGRADE (cambio de plan) | RENOVACION (mismo plan).
   */
  async upgradePlan(edificioId, nuevoPlanNombre, propietarioId, tokenPago = null, operacion = 'UPGRADE') {
    if (tokenPago) {
      return await pagosService.confirmarPagoSuscripcion(tokenPago, propietarioId);
    }

    if (operacion === 'RENOVACION') {
      return await pagosService.iniciarRenovacionMensual(edificioId, propietarioId);
    }

    const planNormalizado = nuevoPlanNombre?.toUpperCase();
    return await pagosService.iniciarUpgradePlan(edificioId, planNormalizado, propietarioId);
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
  },

  /**
   * Ver accesos de un edificio específico (filtrado por edificio)
   * Similar a verAccesosGlobales pero para un solo edificio
   */
  async verAccesosPorEdificio(edificioId, propietarioId, filtros = {}) {
    const edificio = await edificiosRepository.findById(edificioId);
    if (!edificio || edificio.propietarioId !== propietarioId) {
      throw new Error('No tienes permiso para ver este edificio');
    }

    return await auditoriaRepository.findAccesosByEdificios([edificioId]);
  },

  /**
   * Ver alertas de un edificio específico (filtrado por edificio)
   * Similar a verAlertasGlobales pero para un solo edificio
   */
  async verAlertasPorEdificio(edificioId, propietarioId) {
    const edificio = await edificiosRepository.findById(edificioId);
    if (!edificio || edificio.propietarioId !== propietarioId) {
      throw new Error('No tienes permiso para ver este edificio');
    }

    return await auditoriaRepository.findAlertasByEdificios([edificioId]);
  }
};

module.exports = edificiosService;
