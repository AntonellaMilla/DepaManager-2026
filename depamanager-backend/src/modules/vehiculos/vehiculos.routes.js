const express = require('express');
const vehiculosController = require("./vehiculos.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const { roleGuard, adminEdificioGuard } = require("../../shared/middlewares/roles.middleware");

const router = express.Router();

// Requiere autenticación y rol Administrador
router.use(authMiddleware);
router.use(roleGuard(['ADMINISTRADOR']));
// Solo puede gestionar su propio edificio
router.use(adminEdificioGuard);

router.post('/', vehiculosController.createValidation, vehiculosController.create);
router.get('/', vehiculosController.listar);
router.get('/inquilino/:inquilinoId', vehiculosController.listarPorInquilino);
router.put('/:id', vehiculosController.update);
router.put('/:id/toggle', vehiculosController.toggleActivo);
router.delete('/:id', vehiculosController.delete);

module.exports = router;