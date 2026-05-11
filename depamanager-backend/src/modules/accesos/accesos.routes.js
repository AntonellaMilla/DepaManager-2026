const express = require('express');
const accesosController = require("./accesos.controller");
const authMiddleware = require('../../shared/middlewares/auth.middleware');
const serviceAuthMiddleware = require('../../shared/middlewares/serviceAuth.middleware');
const planValidation = require('../../shared/middlewares/planValidation.middleware');

const router = express.Router();

// Historial de accesos para inquilinos, administradores y propietarios
router.get('/', authMiddleware, accesosController.obtenerHistorial);

router.post('/registrar',
  serviceAuthMiddleware,
  planValidation.validarAnalisisIAServicio,
  accesosController.registrar
);

module.exports = router;