const express = require('express');
const camarasController = require("./camaras.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const { roleGuard, adminEdificioGuard } = require("../../shared/middlewares/roles.middleware");

const router = express.Router();

// Solo administradores autenticados
router.use(authMiddleware);
router.use(roleGuard(['ADMINISTRADOR']));
// Solo puede gestionar su propio edificio
router.use(adminEdificioGuard);

router.post('/', camarasController.createValidation, camarasController.create);
router.get('/', camarasController.listar);

module.exports = router;