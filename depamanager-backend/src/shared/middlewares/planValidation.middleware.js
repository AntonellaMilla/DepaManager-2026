const prisma = require("../config/database");

/**
 * Middleware de validación de planes SaaS
 * Verifica límites según el plan del edificio
 */
const planValidation = {

  /**
   * Validar límites de análisis de IA según plan
   */
  validarAnalisisIA: async (req, res, next) => {
    try {
      const edificioId = req.user?.edificioId;
      if (!edificioId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes un edificio asignado'
        });
      }

      const suscripcion = await prisma.suscripcion.findUnique({
        where: { edificioId },
        include: { plan: true }
      });

      if (!suscripcion || !suscripcion.activa) {
        return res.status(403).json({
          success: false,
          message: 'No tienes una suscripción activa'
        });
      }

      const plan = suscripcion.plan.nombre;

      // Validar según tipo de análisis
      if (req.body.tipoEvento === 'SOSPECHOSA' && plan === 'GRATUITO') {
        return res.status(403).json({
          success: false,
          message: 'El análisis de conducta sospechosa requiere plan Estándar o Premium'
        });
      }

      // Agregar info del plan al request
      req.plan = {
        nombre: plan,
        permiteIaPlacas: suscripcion.plan.permiteIaPlacas,
        permiteMetricasAvanzadas: suscripcion.plan.permiteMetricasAvanzadas
      };

      next();
    } catch (error) {
      console.error('Error en validación de plan:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  /**
   * Validar límites de historial según plan
   */
  validarHistorial: async (req, res, next) => {
    try {
      const edificioId = req.user?.edificioId;
      if (!edificioId) return next();

      const suscripcion = await prisma.suscripcion.findUnique({
        where: { edificioId },
        include: { plan: true }
      });

      if (!suscripcion) return next();

      const plan = suscripcion.plan.nombre;
      let limiteDias = 365; // Ilimitado para Premium

      if (plan === 'GRATUITO') {
        limiteDias = 7;
      } else if (plan === 'ESTANDAR') {
        limiteDias = 180; // 6 meses
      }

      // Agregar límite al request
      req.limiteHistorial = {
        dias: limiteDias,
        plan: plan
      };

      next();
    } catch (error) {
      console.error('Error en validación de historial:', error);
      next(); // No bloquear si hay error
    }
  },

  /**
   * Validar límites de consultas según plan
   */
  validarConsultas: (req, res, next) => {
    const plan = req.plan?.nombre || 'GRATUITO';

    if (plan === 'GRATUITO') {
      // Solo consultas por día actual
      const hoy = new Date().toISOString().split('T')[0];
      if (req.query.fechaDesde && req.query.fechaDesde !== hoy) {
        return res.status(403).json({
          success: false,
          message: 'El plan Gratuito solo permite consultas del día actual'
        });
      }
    }

    next();
  },

  /**
   * Validar subida de imágenes según plan
   */
  validarImagenes: async (req, res, next) => {
    try {
      const edificioId = req.body?.edificioId || req.user?.edificioId;
      if (!edificioId) return next();

      const suscripcion = await prisma.suscripcion.findUnique({
        where: { edificioId },
        include: { plan: true }
      });

      if (!suscripcion) return next();

      // Contar imágenes del mes actual
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      const count = await prisma.imagen.count({
        where: {
          edificioId,
          fechaSubida: { gte: inicioMes }
        }
      });

      const plan = suscripcion.plan.nombre;
      let limiteMensual = 1000; // Premium

      if (plan === 'GRATUITO') {
        limiteMensual = 50;
      } else if (plan === 'ESTANDAR') {
        limiteMensual = 500;
      }

      if (count >= limiteMensual) {
        return res.status(429).json({
          success: false,
          message: `Has alcanzado el límite mensual de ${limiteMensual} imágenes para el plan ${plan}`
        });
      }

      next();
    } catch (error) {
      console.error('Error en validación de imágenes:', error);
      next();
    }
  },

  /**
   * Validar límites de análisis de IA para servicios (sin usuario autenticado)
   * Se usa cuando la IA envía datos directamente con token de servicio
   */
  validarAnalisisIAServicio: async (req, res, next) => {
    try {
      // Para servicios de IA, obtener edificioId desde la cámara
      const { camaraId } = req.body;

      if (!camaraId) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere camaraId para validación de servicio IA'
        });
      }

      // Obtener edificio desde la cámara
      const camara = await prisma.camara.findUnique({
        where: { id: camaraId },
        include: {
          edificio: {
            include: {
              suscripcion: {
                include: { plan: true }
              }
            }
          }
        }
      });

      if (!camara || !camara.edificio) {
        return res.status(404).json({
          success: false,
          message: 'Cámara o edificio no encontrado'
        });
      }

      const edificioId = camara.edificioId;
      const suscripcion = camara.edificio.suscripcion;

      if (!suscripcion || !suscripcion.activa) {
        return res.status(403).json({
          success: false,
          message: 'El edificio no tiene una suscripción activa'
        });
      }

      const plan = suscripcion.plan.nombre;

      // Validar según tipo de análisis
      if (req.body.tipoEvento === 'SOSPECHOSA' && plan === 'GRATUITO') {
        return res.status(403).json({
          success: false,
          message: 'El análisis de conducta sospechosa requiere plan Estándar o Premium'
        });
      }

      // Agregar info del plan y edificio al request
      req.plan = {
        nombre: plan,
        permiteIaPlacas: suscripcion.plan.permiteIaPlacas,
        permiteMetricasAvanzadas: suscripcion.plan.permiteMetricasAvanzadas
      };
      req.edificioId = edificioId;
      req.camara = camara;

      next();
    } catch (error) {
      console.error('Error en validación IA servicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno en validación de servicio'
      });
    }
  }
};

module.exports = planValidation;