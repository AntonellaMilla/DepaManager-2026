const express = require('express');
const pagosController = require("./pagos.controller");
const authMiddleware = require('../../shared/middlewares/auth.middleware');
const { roleGuard } = require('../../shared/middlewares/roles.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear factura (solo propietario/administrador)
router.post('/facturas',
  roleGuard(['PROPIETARIO', 'ADMINISTRADOR']),
  pagosController.crearFactura
);

// Crear factura mensual automática (solo propietario/administrador)
router.post('/facturas/mensual',
  roleGuard(['PROPIETARIO', 'ADMINISTRADOR']),
  pagosController.crearFacturaMensual
);

// Obtener facturas de un edificio
router.get('/facturas/:edificioId', pagosController.obtenerFacturas);

// Marcar factura como pagada (solo propietario/administrador)
router.put('/facturas/:id/pagar',
  roleGuard(['PROPIETARIO', 'ADMINISTRADOR']),
  pagosController.pagarFactura
);

// Generar QR para pago con Yape
router.get('/facturas/:id/qr', pagosController.generarQR);

// Obtener estadísticas de pagos
router.get('/estadisticas/:edificioId', pagosController.obtenerEstadisticas);

// Verificar pago por código Yape
router.post('/verificar', pagosController.verificarPago);

module.exports = router;