const express = require('express');
const metricasController = require("./metricas.controller");
const authMiddleware = require('../../shared/middlewares/auth.middleware');
const { roleGuard } = require('../../shared/middlewares/roles.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener métricas generales (solo propietario/administrador)
router.get('/generales',
  roleGuard(['PROPIETARIO', 'ADMINISTRADOR']),
  metricasController.obtenerMetricasGenerales
);

// Obtener métricas de seguridad por edificio
router.get('/seguridad/:edificioId', metricasController.obtenerMetricasSeguridad);

// Obtener métricas financieras por edificio
router.get('/financieras/:edificioId', metricasController.obtenerMetricasFinancieras);

// Obtener métricas de ocupación por edificio
router.get('/ocupacion/:edificioId', metricasController.obtenerMetricasOcupacion);

// Obtener métricas IA por edificio
router.get('/ia/:edificioId', metricasController.obtenerMetricasIA);

// Obtener métricas completas por edificio
router.get('/completas/:edificioId', metricasController.obtenerMetricasCompletas);

module.exports = router;