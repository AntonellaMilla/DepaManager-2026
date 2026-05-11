const pagosService = require("./pagos.service");
const { success, error } = require("../../shared/utils/response");

/**
 * Pagos Controller - Gestión de pagos con Yape
 */
const pagosController = {

  /**
   * POST /api/pagos/facturas
   * Crear nueva factura
   */
  async crearFactura(req, res) {
    try {
      const { edificioId, descripcion, monto, fechaVencimiento } = req.body;

      // Validaciones
      if (!edificioId || !descripcion || !monto || !fechaVencimiento) {
        return error(res, 'Todos los campos son requeridos', 400);
      }

      if (monto <= 0) {
        return error(res, 'El monto debe ser mayor a 0', 400);
      }

      const factura = await pagosService.crearFactura(edificioId, descripcion, monto, fechaVencimiento);

      return success(res, factura, 'Factura creada correctamente', 201);
    } catch (err) {
      console.error('Error creando factura:', err);
      return error(res, err.message, 500);
    }
  },

  /**
   * GET /api/pagos/facturas/:edificioId
   * Obtener facturas de un edificio
   */
  async obtenerFacturas(req, res) {
    try {
      const edificioId = req.params.edificioId;
      const filtros = req.query;

      const facturas = await pagosService.obtenerFacturasEdificio(edificioId, filtros);

      return success(res, facturas, 'Facturas obtenidas correctamente');
    } catch (err) {
      console.error('Error obteniendo facturas:', err);
      return error(res, err.message, 500);
    }
  },

  /**
   * PUT /api/pagos/facturas/:id/pagar
   * Marcar factura como pagada
   */
  async pagarFactura(req, res) {
    try {
      const facturaId = req.params.id;
      const { metodoPago } = req.body;

      const factura = await pagosService.marcarFacturaPagada(facturaId, metodoPago || 'YAPE');

      return success(res, factura, 'Factura pagada correctamente');
    } catch (err) {
      console.error('Error pagando factura:', err);
      return error(res, err.message, 500);
    }
  },

  /**
   * GET /api/pagos/facturas/:id/qr
   * Generar QR para pago con Yape
   */
  async generarQR(req, res) {
    try {
      const facturaId = req.params.id;

      // Obtener factura
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const factura = await prisma.factura.findUnique({
        where: { id: facturaId }
      });

      if (!factura) {
        return error(res, 'Factura no encontrada', 404);
      }

      if (factura.estado === 'PAGADA') {
        return error(res, 'La factura ya está pagada', 400);
      }

      const qrData = pagosService.generarQRParaYape(factura);

      return success(res, qrData, 'QR generado correctamente');
    } catch (err) {
      console.error('Error generando QR:', err);
      return error(res, err.message, 500);
    }
  },

  /**
   * GET /api/pagos/estadisticas/:edificioId
   * Obtener estadísticas de pagos
   */
  async obtenerEstadisticas(req, res) {
    try {
      const edificioId = req.params.edificioId;

      const estadisticas = await pagosService.obtenerEstadisticasPagos(edificioId);

      return success(res, estadisticas, 'Estadísticas obtenidas correctamente');
    } catch (err) {
      console.error('Error obteniendo estadísticas:', err);
      return error(res, err.message, 500);
    }
  },

  /**
   * POST /api/pagos/verificar
   * Verificar pago por código Yape
   */
  async verificarPago(req, res) {
    try {
      const { codigoPago } = req.body;

      if (!codigoPago) {
        return error(res, 'Código de pago requerido', 400);
      }

      const resultado = await pagosService.verificarPagoYape(codigoPago);

      return success(res, resultado, 'Verificación completada');
    } catch (err) {
      console.error('Error verificando pago:', err);
      return error(res, err.message, 500);
    }
  },

  /**
   * POST /api/pagos/facturas/mensual
   * Crear factura mensual automática
   */
  async crearFacturaMensual(req, res) {
    try {
      const { edificioId, mes, anio, montoBase } = req.body;

      if (!edificioId || !mes || !anio || !montoBase) {
        return error(res, 'Todos los campos son requeridos', 400);
      }

      const factura = await pagosService.crearFacturaMensual(edificioId, mes, anio, montoBase);

      return success(res, factura, 'Factura mensual creada correctamente', 201);
    } catch (err) {
      console.error('Error creando factura mensual:', err);
      return error(res, err.message, 500);
    }
  }
};

module.exports = pagosController;