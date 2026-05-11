const prisma = require("../../shared/config/database");
const crypto = require('crypto');

/**
 * Pagos Service - Sistema de pagos con Yape
 */
const pagosService = {

  /**
   * Generar código de pago único para Yape
   */
  generarCodigoPago() {
    return 'YAPE-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  },

  /**
   * Crear factura para un edificio
   */
  async crearFactura(edificioId, descripcion, monto, fechaVencimiento) {
    try {
      // Verificar que el edificio existe
      const edificio = await prisma.edificio.findUnique({
        where: { id: edificioId },
        include: { propietario: true }
      });

      if (!edificio) {
        throw new Error('Edificio no encontrado');
      }

      const codigoPago = this.generarCodigoPago();

      const factura = await prisma.factura.create({
        data: {
          edificioId,
          descripcion,
          monto: parseFloat(monto),
          fechaVencimiento: new Date(fechaVencimiento),
          codigoPago,
          estado: 'PENDIENTE'
        }
      });

      return {
        ...factura,
        edificio: edificio.nombre,
        propietario: edificio.propietario
      };

    } catch (error) {
      console.error('Error creando factura:', error);
      throw new Error('Error al crear factura');
    }
  },

  /**
   * Obtener facturas de un edificio
   */
  async obtenerFacturasEdificio(edificioId, filtros = {}) {
    try {
      const where = { edificioId };

      if (filtros.estado) {
        where.estado = filtros.estado;
      }

      if (filtros.fechaDesde) {
        where.fechaCreacion = {
          ...where.fechaCreacion,
          gte: new Date(filtros.fechaDesde)
        };
      }

      if (filtros.fechaHasta) {
        where.fechaCreacion = {
          ...where.fechaCreacion,
          lte: new Date(filtros.fechaHasta)
        };
      }

      const facturas = await prisma.factura.findMany({
        where,
        include: {
          edificio: { select: { nombre: true } }
        },
        orderBy: { fechaCreacion: 'desc' }
      });

      return facturas;

    } catch (error) {
      console.error('Error obteniendo facturas:', error);
      throw new Error('Error al obtener facturas');
    }
  },

  /**
   * Marcar factura como pagada (simulación de pago con Yape)
   */
  async marcarFacturaPagada(facturaId, metodoPago = 'YAPE') {
    try {
      const factura = await prisma.factura.findUnique({
        where: { id: facturaId },
        include: { edificio: true }
      });

      if (!factura) {
        throw new Error('Factura no encontrada');
      }

      if (factura.estado === 'PAGADA') {
        throw new Error('La factura ya está pagada');
      }

      // Actualizar factura
      const facturaActualizada = await prisma.factura.update({
        where: { id: facturaId },
        data: {
          estado: 'PAGADA',
          fechaPago: new Date(),
          metodoPago
        }
      });

      // Registrar en auditoría
      await prisma.auditoria.create({
        data: {
          edificioId: factura.edificioId,
          accion: 'PAGO_FACTURA',
          descripcion: `Factura ${factura.descripcion} pagada con ${metodoPago}. Código: ${factura.codigoPago}`
        }
      });

      return facturaActualizada;

    } catch (error) {
      console.error('Error marcando factura como pagada:', error);
      throw new Error('Error al procesar el pago');
    }
  },

  /**
   * Generar QR para pago con Yape
   */
  generarQRParaYape(factura) {
    // En un sistema real, esto generaría un QR code con la información de pago
    // Para este prototipo, devolvemos la información necesaria

    const datosPago = {
      tipo: 'YAPE_QR',
      codigoPago: factura.codigoPago,
      monto: factura.monto,
      descripcion: factura.descripcion,
      fechaVencimiento: factura.fechaVencimiento,
      // En producción, aquí irían las coordenadas del QR
      qrData: `YAPE|${factura.codigoPago}|${factura.monto}|${factura.descripcion}`
    };

    return datosPago;
  },

  /**
   * Obtener estadísticas de pagos de un edificio
   */
  async obtenerEstadisticasPagos(edificioId) {
    try {
      const [totalFacturas, facturasPagadas, facturasPendientes, ingresosTotales] = await Promise.all([
        prisma.factura.count({ where: { edificioId } }),
        prisma.factura.count({ where: { edificioId, estado: 'PAGADA' } }),
        prisma.factura.count({ where: { edificioId, estado: 'PENDIENTE' } }),
        prisma.factura.aggregate({
          where: { edificioId, estado: 'PAGADA' },
          _sum: { monto: true }
        })
      ]);

      // Facturas vencidas
      const facturasVencidas = await prisma.factura.count({
        where: {
          edificioId,
          estado: 'PENDIENTE',
          fechaVencimiento: {
            lt: new Date()
          }
        }
      });

      return {
        totalFacturas,
        facturasPagadas,
        facturasPendientes,
        facturasVencidas,
        ingresosTotales: ingresosTotales._sum.monto || 0,
        porcentajeCobro: totalFacturas > 0 ? (facturasPagadas / totalFacturas * 100).toFixed(1) : 0
      };

    } catch (error) {
      console.error('Error obteniendo estadísticas de pagos:', error);
      throw new Error('Error al obtener estadísticas de pagos');
    }
  },

  /**
   * Crear factura mensual automática para edificio
   */
  async crearFacturaMensual(edificioId, mes, anio, montoBase) {
    try {
      const edificio = await prisma.edificio.findUnique({
        where: { id: edificioId },
        include: { suscripcion: { include: { plan: true } } }
      });

      if (!edificio || !edificio.suscripcion) {
        throw new Error('Edificio sin suscripción activa');
      }

      const descripcion = `Suscripción ${edificio.suscripcion.plan.nombre} - ${mes}/${anio}`;
      const fechaVencimiento = new Date(anio, mes, 10); // Día 10 del mes siguiente

      return await this.crearFactura(edificioId, descripcion, montoBase, fechaVencimiento);

    } catch (error) {
      console.error('Error creando factura mensual:', error);
      throw new Error('Error al crear factura mensual');
    }
  },

  /**
   * Verificar pago por código Yape (simulación)
   */
  async verificarPagoYape(codigoPago) {
    try {
      const factura = await prisma.factura.findUnique({
        where: { codigoPago }
      });

      if (!factura) {
        return { encontrado: false, mensaje: 'Código de pago no encontrado' };
      }

      if (factura.estado === 'PAGADA') {
        return {
          encontrado: true,
          pagada: true,
          factura: {
            id: factura.id,
            descripcion: factura.descripcion,
            monto: factura.monto,
            fechaPago: factura.fechaPago
          }
        };
      }

      return {
        encontrado: true,
        pagada: false,
        factura: {
          id: factura.id,
          descripcion: factura.descripcion,
          monto: factura.monto,
          fechaVencimiento: factura.fechaVencimiento
        }
      };

    } catch (error) {
      console.error('Error verificando pago Yape:', error);
      throw new Error('Error al verificar pago');
    }
  }
};

module.exports = pagosService;