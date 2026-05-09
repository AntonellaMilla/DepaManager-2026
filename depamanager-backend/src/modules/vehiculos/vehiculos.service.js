const vehiculosRepository = require("./vehiculos.repository");
const auditoriaRepository = require("../accesos/auditoria.repository");

/**
 * Vehiculos Service
 */
const vehiculosService = {

  async createVehiculo(data, inquilinoId, edificioId, adminId) {
    const vehiculo = await vehiculosRepository.create(data, inquilinoId);

    await auditoriaRepository.create(
      adminId,
      edificioId,
      'CREAR_VEHICULO',
      `Vehículo con placa ${data.placa} asignado a inquilino`
    );

    return vehiculo;
  },

  async listarVehiculos(edificioId) {
    return await vehiculosRepository.findByEdificio(edificioId);
  },

  async updateVehiculo(id, data, edificioId, adminId) {
    const vehiculo = await vehiculosRepository.update(id, data);
    await auditoriaRepository.create(adminId, edificioId, 'ACTUALIZAR_VEHICULO', `Vehículo actualizado`);
    return vehiculo;
  },

  async toggleActivo(id, edificioId, adminId) {
    const vehiculo = await vehiculosRepository.toggleActivo(id);
    await auditoriaRepository.create(adminId, edificioId, 'TOGGLE_VEHICULO', `Vehículo ${vehiculo.activo ? 'activado' : 'desactivado'}`);
    return vehiculo;
  }
};

module.exports = vehiculosService;