const prisma = require('../../shared/config/database');
const auditoriaRepository = require("./auditoria.repository");

/**
 * Accesos Service - Recibe placas desde el script Python
 */
const accesosService = {

  async registrarDesdeIA(placaDetectada, camaraId) {
    const camara = await prisma.camara.findUnique({
      where: { id: camaraId }
    });

    if (!camara) throw new Error('Cámara no encontrada');

    const edificioId = camara.edificioId;

    const placaOriginal = placaDetectada.toUpperCase().trim();
    const placaSinGuion = placaOriginal.replace(/[- ]/g, '');
    const placaConGuion = placaSinGuion.replace(/(.{3})(.{3})/, '$1-$2');

    let vehiculo = null;

    const posiblesPlacas = [placaOriginal, placaSinGuion, placaConGuion];

    for (const placa of posiblesPlacas) {
      vehiculo = await prisma.vehiculo.findUnique({
        where: { placa: placa },
        include: {
          inquilino: {
            include: {
              usuario: {
                select: { nombres: true, apellidos: true, email: true }
              }
            }
          }
        }
      });
      if (vehiculo) break;
    }

    let resultado = 'NO_IDENTIFICADO';
    let infoExtra = '';

    if (vehiculo) {
      resultado = vehiculo.activo ? 'AUTORIZADO' : 'NO_AUTORIZADO';
      infoExtra = ` | Dueño: ${vehiculo.inquilino?.usuario ? 
        `${vehiculo.inquilino.usuario.nombres} ${vehiculo.inquilino.usuario.apellidos}` : 'Sin inquilino'} 
        | Carro: ${vehiculo.modelo || ''} ${vehiculo.color || ''}`;
    }

    // Guardar historial
    const historial = await prisma.historialAcceso.create({
      data: {
        edificioId,
        camaraId,
        vehiculoId: vehiculo ? vehiculo.id : null,
        tipo: 'PLACA',
        resultado,
        placa: placaOriginal,
        nivelConfianza: 82
      }
    });

    // Alerta con información completa
    if (resultado !== 'AUTORIZADO') {
      await prisma.alerta.create({
        data: {
          historialId: historial.id,
          edificioId,
          titulo: resultado === 'NO_IDENTIFICADO' ? '🚨 Placa NO REGISTRADA' : '⛔ Acceso NO AUTORIZADO',
          descripcion: `Placa: ${placaOriginal}${infoExtra}`,
          nivel: 'ALTA'
        }
      });
    }

    await auditoriaRepository.create(
      null, 
      edificioId, 
      'DETECCION_PLACA', 
      `Placa: ${placaOriginal} → ${resultado}${infoExtra}`
    );

    console.log(`🚨 Alerta: ${resultado} - Placa: ${placaOriginal}${infoExtra}`);

    return { 
      resultado, 
      placaOriginal,
      infoExtra: infoExtra.trim(),
      vehiculo: vehiculo ? {
        placa: vehiculo.placa,
        modelo: vehiculo.modelo,
        color: vehiculo.color,
        inquilino: vehiculo.inquilino?.usuario ? 
          `${vehiculo.inquilino.usuario.nombres} ${vehiculo.inquilino.usuario.apellidos}` : null
      } : null
    };
  }
};

module.exports = accesosService;