const express = require('express');
const edificiosController = require("./edificios.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const { roleGuard } = require("../../shared/middlewares/roles.middleware");   // ← Cambia a destructuring

const router = express.Router();

router.use(authMiddleware);
router.use(roleGuard(['PROPIETARIO']));

router.post('/', edificiosController.createValidation, edificiosController.create);
router.get('/', edificiosController.listar);
router.post('/asignar-admin', edificiosController.asignarAdmin);     // nueva
router.get('/accesos', edificiosController.accesosGlobales);         // nueva
router.get('/alertas', edificiosController.alertasGlobales);  
router.post('/upgrade-plan', edificiosController.upgradePlan);   
router.put('/:id', edificiosController.update);
router.delete('/:id', edificiosController.delete);    
router.get('/:id/historial', edificiosController.historialActividades);
router.get('/:id/accesos', edificiosController.accesosPorEdificio);     // nueva - accesos por edificio específico
router.get('/:id/alertas', edificiosController.alertasPorEdificio);     // nueva - alertas por edificio específico

module.exports = router;
