const { verificarToken } = require('../utils/jwt');
const usuariosRepository = require('../../modules/usuarios/usuarios.repository');

/**
 * Middleware de autenticación JWT mejorado
 * Carga el usuario + edificios si es administrador
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No se proporcionó token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verificarToken(token);
    const usuario = await usuariosRepository.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    req.user = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre
    };

    // Si es administrador, cargamos los IDs de sus edificios
    if (usuario.rol.nombre === 'ADMINISTRADOR' && usuario.administradores?.length > 0) {
      req.user.edificiosIds = usuario.administradores
        .filter(admin => admin.activo)
        .map(admin => admin.edificioId);
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;