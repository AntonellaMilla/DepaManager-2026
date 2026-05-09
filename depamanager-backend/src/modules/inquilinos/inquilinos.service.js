const inquilinosRepository = require("./inquilinos.repository");
const usuariosService = require("../usuarios/usuarios.service");
const auditoriaRepository = require("../accesos/auditoria.repository");

/**
 * Inquilinos Service
 * Flujo completo de registro y gestión de inquilinos
 */
const inquilinosService = {

  /**
   * Crear nuevo inquilino COMPLETO (crea Usuario + Inquilino en una transacción lógica)
   * 
   * Flujo:
   * 1. Validar unidad disponible
   * 2. Crear usuario con rol INQUILINO
   * 3. Crear registro Inquilino
   * 4. Registrar auditoría
   */
  async createInquilinoCompleto(datosPersonales, unidadId, edificioId, adminId) {
    try {
      // 1. Validar que la unidad está disponible
      await inquilinosRepository.isUnidadDisponible(unidadId);

      // 2. Crear usuario con rol INQUILINO
      const usuarioInquilino = await usuariosService.createInquilinoUsuario(datosPersonales);

      // 3. Crear registro Inquilino vinculado a la unidad
      const inquilino = await inquilinosRepository.create(
        {
          usuarioId: usuarioInquilino.id,
          nacionalidad: datosPersonales.nacionalidad || null,
          contactoEmergencia: datosPersonales.contactoEmergencia || null,
          telefonoEmergencia: datosPersonales.telefonoEmergencia || null,
          fechaInicioContrato: datosPersonales.fechaInicioContrato,
          fechaFinContrato: datosPersonales.fechaFinContrato
        },
        unidadId
      );

      // 4. Registrar en auditoría
      await auditoriaRepository.create(
        adminId,
        edificioId,
        'CREAR_INQUILINO',
        `Inquilino ${usuarioInquilino.nombres} ${usuarioInquilino.apellidos} (${usuarioInquilino.email}) creado y asignado a unidad ${unidadId}`
      );

      return {
        usuario: usuarioInquilino,
        inquilino: inquilino
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crear inquilino con usuario ya existente
   * (si el usuario INQUILINO ya fue creado previamente)
   */
  async createInquilinoConUsuarioExistente(usuarioId, unidadId, datosContrato, edificioId, adminId) {
    try {
      // Validar que la unidad está disponible
      await inquilinosRepository.isUnidadDisponible(unidadId);

      // Crear registro Inquilino
      const inquilino = await inquilinosRepository.create(
        {
          usuarioId,
          nacionalidad: datosContrato.nacionalidad || null,
          contactoEmergencia: datosContrato.contactoEmergencia || null,
          telefonoEmergencia: datosContrato.telefonoEmergencia || null,
          fechaInicioContrato: datosContrato.fechaInicioContrato,
          fechaFinContrato: datosContrato.fechaFinContrato
        },
        unidadId
      );

      // Registrar auditoría
      await auditoriaRepository.create(
        adminId,
        edificioId,
        'CREAR_INQUILINO',
        `Inquilino con usuario ${usuarioId} asignado a unidad ${unidadId}`
      );

      return inquilino;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crear nuevo inquilino (método legado para compatibilidad)
   */
  async createInquilino(data, unidadId, edificioId, adminId) {
    const inquilino = await inquilinosRepository.create(data, unidadId);

    // Registrar en auditoría
    await auditoriaRepository.create(
      adminId,
      edificioId,
      'CREAR_INQUILINO',
      `Inquilino ${data.usuarioId} asignado a unidad ${unidadId}`
    );

    return inquilino;
  },

  /**
   * Listar inquilinos del edificio
   */
  async listarInquilinos(edificioId) {
    return await inquilinosRepository.findByEdificio(edificioId);
  },

  /**
   * Actualizar inquilino
   */
  async updateInquilino(id, data, edificioId, adminId) {
    const inquilino = await inquilinosRepository.update(id, data);
    await auditoriaRepository.create(
      adminId,
      edificioId,
      'ACTUALIZAR_INQUILINO',
      `Inquilino ${id} actualizado: ${JSON.stringify(data)}`
    );
    return inquilino;
  },

  /**
   * Obtener detalles de un inquilino específico
   */
  async obtenerInquilino(id) {
    return await inquilinosRepository.findById(id);
  },

  /**
   * Finalizar contrato de inquilino
   */
  async finalizarContrato(id, edificioId, adminId) {
    const inquilino = await inquilinosRepository.finalizarContrato(id);
    await auditoriaRepository.create(
      adminId,
      edificioId,
      'FINALIZAR_CONTRATO',
      `Contrato del inquilino ${id} finalizado`
    );
    return inquilino;
  }
};

module.exports = inquilinosService;
