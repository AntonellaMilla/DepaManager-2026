require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor depamanager corriendo en http://localhost:${PORT}`);
  console.log(`📡 Prueba la ruta: GET http://localhost:${PORT}/health`);
});
