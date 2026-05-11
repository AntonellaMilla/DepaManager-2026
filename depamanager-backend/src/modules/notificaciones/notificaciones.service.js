const prisma = require("../../shared/config/database");

/**
 * Notificaciones Service - Sistema de recordatorios y alertas
 */
const notificacionesService = {

  /**
   * Crear notificación para un usuario
   */
  async crearNotificacion(usuarioId, tipo, titulo, mensaje, url = null, metadatos = null) {
    try {
      const notificacion = await prisma.notificacion.create({
        data: {
          usuarioId,
          tipo,
          titulo,
          mensaje,
          url,
          metadatos: metadatos ? metadatos : null
        }
      });

      return notificacion;
    } catch (error) {
      console.error('Error creando notificación:', error);
      throw new Error('Error al crear notificación');
    }
  },

  async crearNotificacionesParaEdificio(edificioId, tipo, titulo, mensaje, url = null, metadatos = null) {
    try {
      const destinatarios = await prisma.usuario.findMany({
        where: {
          OR: [
            {
              rol: {
                nombre: 'PROPIETARIO'
              },
              edificios: {
                some: { id: edificioId }
              }
            },
            {
              rol: {
                nombre: 'ADMINISTRADOR'
              },
              administradores: {
                some: {
                  edificioId: edificioId,
                  activo: true
                }
              }
            }
          ]
        },
        select: {
          id: true
        }
      });

      const notificaciones = await Promise.all(
        destinatarios.map(destinatario =>
          this.crearNotificacion(
            destinatario.id,
            tipo,
            titulo,
            mensaje,
            url,
            metadatos
          )
        )
      );

      return notificaciones;
    } catch (error) {
      console.error('Error creando notificaciones para edificio:', error);
      throw new Error('Error al crear notificaciones para el edificio');
    }
  },

  /**
   * Obtener notificaciones de un usuario
   */
  async obtenerNotificacionesUsuario(usuarioId, soloNoLeidas = false) {
    try {
      const where = { usuarioId };
      if (soloNoLeidas) {
        where.leida = false;
      }

      const notificaciones = await prisma.notificacion.findMany({
        where,
        orderBy: { fechaCreacion: 'desc' },
        take: 50
      });

      return notificaciones;
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      throw new Error('Error al obtener notificaciones');
    }
  },

  /**
   * Marcar notificación como leída
   */
  async marcarComoLeida(notificacionId, usuarioId) {
    try {
      const notificacion = await prisma.notificacion.updateMany({
        where: {
          id: notificacionId,
          usuarioId: usuarioId
        },
        data: {
          leida: true
        }
      });

      return notificacion.count > 0;
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      throw new Error('Error al marcar notificación como leída');
    }
  },

  /**
   * Generar recordatorios de pagos pendientes
   * Se ejecuta periódicamente (diario)
   */
  async generarRecordatoriosPagos() {
    try {
      console.log('🔄 Generando recordatorios de pagos...');

      // Buscar inquilinos con contratos próximos a vencer (30 días)
      const contratosPorVencer = await prisma.inquilino.findMany({
        where: {
          fechaFinContrato: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            gte: new Date()
          },
          estadoContrato: 'ACTIVO'
        },
        include: {
          usuario: { select: { id: true, nombres: true, apellidos: true } },
          unidad: {
            include: {
              edificio: { select: { nombre: true } }
            }
          }
        }
      });

      let contadorRecordatorios = 0;

      for (const inquilino of contratosPorVencer) {
        const diasRestantes = Math.ceil(
          (new Date(inquilino.fechaFinContrato) - new Date()) / (1000 * 60 * 60 * 24)
        );

        // Solo enviar recordatorio cada 7 días para no spam
        const recordatorioReciente = await prisma.notificacion.findFirst({
          where: {
            usuarioId: inquilino.usuario.id,
            tipo: 'RECORDATORIO_CONTRATO',
            fechaCreacion: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 días
            }
          }
        });

        if (!recordatorioReciente) {
          await this.crearNotificacion(
            inquilino.usuario.id,
            'RECORDATORIO_CONTRATO',
            '📅 Recordatorio: Contrato próximo a vencer',
            `Tu contrato en la unidad ${inquilino.unidad.numero} del edificio ${inquilino.unidad.edificio.nombre} vence en ${diasRestantes} días. Considera renovarlo.`
          );
          contadorRecordatorios++;
        }
      }

      console.log(`✅ Generados ${contadorRecordatorios} recordatorios de contratos`);
      return contadorRecordatorios;

    } catch (error) {
      console.error('Error generando recordatorios de pagos:', error);
      throw new Error('Error al generar recordatorios de pagos');
    }
  },

  /**
   * Generar recordatorios de pagos de alquiler
   * Se ejecuta periódicamente (mensual)
   */
  async generarRecordatoriosAlquiler() {
    try {
      console.log('🔄 Generando recordatorios de alquiler...');

      // Obtener fecha actual
      const ahora = new Date();
      const diaActual = ahora.getDate();

      // Recordatorios para inquilinos con pagos próximos (día 25-31 del mes)
      if (diaActual >= 25) {
        const inquilinosActivos = await prisma.inquilino.findMany({
          where: { estadoContrato: 'ACTIVO' },
          include: {
            usuario: { select: { id: true, nombres: true, apellidos: true } },
            unidad: {
              include: {
                edificio: { select: { nombre: true } }
              }
            }
          }
        });

        let contadorRecordatorios = 0;

        for (const inquilino of inquilinosActivos) {
          // Solo enviar recordatorio una vez al mes
          const recordatorioReciente = await prisma.notificacion.findFirst({
            where: {
              usuarioId: inquilino.usuario.id,
              tipo: 'RECORDATORIO_PAGO',
              fechaCreacion: {
                gte: new Date(ahora.getFullYear(), ahora.getMonth(), 1) // Desde inicio de mes
              }
            }
          });

          if (!recordatorioReciente) {
            await this.crearNotificacion(
              inquilino.usuario.id,
              'RECORDATORIO_PAGO',
              '💰 Recordatorio: Pago de alquiler',
              `Recuerda realizar el pago de alquiler correspondiente al mes de ${ahora.toLocaleString('es-ES', { month: 'long', year: 'numeric' })} para la unidad ${inquilino.unidad.numero} del edificio ${inquilino.unidad.edificio.nombre}.`
            );
            contadorRecordatorios++;
          }
        }

        console.log(`✅ Generados ${contadorRecordatorios} recordatorios de alquiler`);
        return contadorRecordatorios;
      }

      return 0;

    } catch (error) {
      console.error('Error generando recordatorios de alquiler:', error);
      throw new Error('Error al generar recordatorios de alquiler');
    }
  },

  /**
   * Notificar administradores sobre solicitudes pendientes
   */
  async notificarSolicitudesPendientes() {
    try {
      console.log('🔄 Verificando solicitudes pendientes...');

      // Obtener administradores con solicitudes pendientes
      const administradoresConSolicitudes = await prisma.administrador.findMany({
        where: { activo: true },
        include: {
          edificio: {
            include: {
              unidades: {
                include: {
                  inquilino: {
                    include: {
                      solicitudes: {
                        where: { estado: 'PENDIENTE' }
                      }
                    }
                  }
                }
              }
            }
          },
          usuario: { select: { id: true, nombres: true, apellidos: true } }
        }
      });

      let contadorNotificaciones = 0;

      for (const admin of administradoresConSolicitudes) {
        const solicitudesPendientes = [];

        // Recopilar solicitudes de todos los inquilinos del edificio
        for (const unidad of admin.edificio.unidades) {
          if (unidad.inquilino && unidad.inquilino.solicitudes.length > 0) {
            solicitudesPendientes.push(...unidad.inquilino.solicitudes);
          }
        }

        if (solicitudesPendientes.length > 0) {
          // Verificar si ya se notificó recientemente
          const notificacionReciente = await prisma.notificacion.findFirst({
            where: {
              usuarioId: admin.usuario.id,
              tipo: 'SOLICITUDES_PENDIENTES',
              fechaCreacion: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
              }
            }
          });

          if (!notificacionReciente) {
            await this.crearNotificacion(
              admin.usuario.id,
              'SOLICITUDES_PENDIENTES',
              '📋 Solicitudes pendientes de revisión',
              `Tienes ${solicitudesPendientes.length} solicitud(es) pendiente(s) de revisión en el edificio ${admin.edificio.nombre}.`
            );
            contadorNotificaciones++;
          }
        }
      }

      console.log(`✅ Generadas ${contadorNotificaciones} notificaciones de solicitudes pendientes`);
      return contadorNotificaciones;

    } catch (error) {
      console.error('Error notificando solicitudes pendientes:', error);
      throw new Error('Error al notificar solicitudes pendientes');
    }
  },

  /**
   * Ejecutar todas las tareas de mantenimiento de notificaciones
   * Se debe llamar periódicamente (diario)
   */
  async ejecutarMantenimientoNotificaciones() {
    try {
      console.log('🔄 Ejecutando mantenimiento de notificaciones...');

      const resultados = await Promise.all([
        this.generarRecordatoriosPagos(),
        this.generarRecordatoriosAlquiler(),
        this.notificarSolicitudesPendientes()
      ]);

      const total = resultados.reduce((sum, count) => sum + count, 0);

      console.log(`✅ Mantenimiento completado: ${total} notificaciones generadas`);
      return {
        recordatoriosContratos: resultados[0],
        recordatoriosAlquiler: resultados[1],
        notificacionesSolicitudes: resultados[2],
        total
      };

    } catch (error) {
      console.error('Error en mantenimiento de notificaciones:', error);
      throw new Error('Error en mantenimiento de notificaciones');
    }
  }
};

module.exports = notificacionesService;