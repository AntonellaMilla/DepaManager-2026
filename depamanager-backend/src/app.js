const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./shared/middlewares/error.middleware');

// Rutas modulares
const authRoutes = require('./modules/auth/auth.routes');
const edificiosRoutes = require('./modules/edificios/edificios.routes');
const usuariosRoutes = require('./modules/usuarios/usuarios.routes');
const unidadesRoutes = require('./modules/unidades/unidades.routes');
const inquilinosRoutes = require('./modules/inquilinos/inquilinos.routes');
const vehiculosRoutes = require('./modules/vehiculos/vehiculos.routes');
const camarasRoutes = require('./modules/camaras/camaras.routes');
const accesosRoutes = require('./modules/accesos/accesos.routes');

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/edificios', edificiosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use('/api/inquilinos', inquilinosRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/camaras', camarasRoutes);
app.use('/api/accesos', accesosRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: '✅ Backend funcionando correctamente' });
});

app.use(errorMiddleware);

module.exports = app;
