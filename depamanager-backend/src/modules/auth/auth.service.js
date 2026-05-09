const usuariosRepository = require('../usuarios/usuarios.repository');
const rolesRepository = require('../../shared/utils/roles.repository');
const { hashPassword, comparePassword } = require('../../shared/utils/password');
const { generarToken } = require('../../shared/utils/jwt');

/**
 * Auth Service - Registro y Login respetando todos los campos de tu BD
 */
const authService = {

  /**
   * Registro de Propietario
   * Usa todos los campos que tienes en la tabla usuarios
   */
  async register(data) {
    const {
      nombres,
      apellidos,
      email,
      password,
      dni,
      telefono,
      direccion,
      tipoDocumento = 'DNI'
    } = data;

    // Buscar rol PROPIETARIO (obligatorio según tu BD)
    const rol = await rolesRepository.findByName('PROPIETARIO');
    if (!rol) {
      throw new Error('Rol PROPIETARIO no encontrado. Verifica que los datos iniciales estén insertados en la BD.');
    }

    // Verificar si el email ya existe
    const existe = await usuariosRepository.findByEmail(email);
    if (existe) {
      throw new Error('El email ya está registrado');
    }

    // Hashear contraseña
    const passwordHash = await hashPassword(password);

    // Crear usuario con TODOS los campos de tu modelo
    const nuevoUsuario = await usuariosRepository.create({
      rolId: rol.id,
      nombres,
      apellidos,
      tipoDocumento,
      dni,
      email,
      passwordHash,
      telefono,
      direccion
    });

    // Generar token JWT
    const token = generarToken({
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol.nombre
    });

    // Eliminar passwordHash antes de devolver
    const { passwordHash: _, ...usuarioRespuesta } = nuevoUsuario;

    return {
      usuario: usuarioRespuesta,
      token
    };
  },

  /**
   * Login (funciona para todos los roles)
   */
  async login(email, password) {
    const usuario = await usuariosRepository.findByEmail(email);
    if (!usuario) throw new Error('Credenciales incorrectas');

    const esValido = await comparePassword(password, usuario.passwordHash);
    if (!esValido) throw new Error('Credenciales incorrectas');

    const token = generarToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol.nombre
    });

    const { passwordHash: _, ...usuarioRespuesta } = usuario;

    return {
      usuario: usuarioRespuesta,
      token
    };
  }
};

module.exports = authService;
