# 🚀 DepaManager - Funcionalidades SaaS Implementadas

## 📦 **Instalación de Nuevas Dependencias**

Después de los cambios, instala las nuevas dependencias:

```bash
cd depamanager-backend
npm install
```

## 🗄️ **Migración de Base de Datos**

Ejecuta la migración para agregar el modelo `Imagen`:

```bash
npx prisma generate
npx prisma db push
```

## 📸 **Sistema de Imágenes**

### **Funcionalidades Implementadas:**

1. **Almacenamiento Centralizado**: Las imágenes ahora se guardan en `backend/uploads/imagenes/`
2. **Control de Acceso**: Solo administradores y propietarios pueden ver las imágenes
3. **Separación por Edificio**: Cada edificio tiene sus propias imágenes
4. **Límites por Plan**: Control automático de cuotas según suscripción

### **Endpoints de Imágenes:**

#### **Subida desde IA (sin autenticación JWT):**
```
POST /api/imagenes/subir-ia
Headers: Authorization: Bearer SERVICE_TOKEN
Body: multipart/form-data
  - imagen: archivo de imagen
  - camaraId: ID de la cámara
  - tipo: 'placa' | 'alerta' | 'comportamiento'
  - descripcion: descripción opcional
```

#### **Listar imágenes (solo admin/propietario):**
```
GET /api/imagenes?tipo=placa&camaraId=xxx&fechaDesde=2024-01-01&fechaHasta=2024-12-31
Headers: Authorization: Bearer JWT_TOKEN
```

#### **Ver imagen específica:**
```
GET /api/imagenes/:id
Headers: Authorization: Bearer JWT_TOKEN
```

#### **Eliminar imagen:**
```
DELETE /api/imagenes/:id
Headers: Authorization: Bearer JWT_TOKEN
```

## 💳 **Sistema SaaS por Planes**

### **Plan Gratuito:**
- ✅ Registro básico de placas
- ❌ Sin análisis avanzado de conducta
- ⏱️ Historial limitado a 7 días
- 📅 Consultas solo del día actual
- 📸 Máximo 50 imágenes/mes

### **Plan Estándar:**
- ✅ Validación de accesos
- ✅ Análisis por eventos
- ⏱️ Historial limitado a 6 meses
- 📅 Consultas por fechas
- 📸 Máximo 500 imágenes/mes

### **Plan Premium:**
- ✅ Análisis de patrones
- ✅ Inteligencia adicional
- ✅ Reconocimiento de conducta sospechosa
- ⏱️ Historial ilimitado
- 📅 Consultas por fechas
- 📸 Máximo 1000 imágenes/mes

## 🔒 **Validaciones Implementadas:**

1. **Análisis IA**: Verifica que el plan permita análisis de conducta
2. **Historial**: Aplica límites temporales según plan
3. **Consultas**: Restringe filtros de fecha según plan
4. **Imágenes**: Controla cuotas mensuales de subida

## 📋 **Próximos Pasos:**

1. Instalar dependencias: `npm install`
2. Ejecutar migración: `npx prisma db push`
3. Reiniciar el backend
4. Las imágenes ahora se subirán automáticamente al backend
5. Los usuarios solo verán imágenes de su edificio con permisos apropiados

¡El sistema SaaS está completamente funcional! 🎉