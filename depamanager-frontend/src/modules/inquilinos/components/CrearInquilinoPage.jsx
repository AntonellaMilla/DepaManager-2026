import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, User, Home, Calendar } from 'lucide-react';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { inquilinosService } from '../services/inquilinosService';
import { unidadesService } from '../../../shared/services/unidadesService'; // Asumiendo que existe
import toast from 'react-hot-toast';

const CrearInquilinoPage = () => {
  const [flujo, setFlujo] = useState('completo'); // 'completo' | 'existente'
  const [unidades, setUnidades] = useState([]);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Flujo completo
    nombres: '',
    apellidos: '',
    email: '',
    dni: '',
    telefono: '',
    tipoDocumento: 'DNI',
    nacionalidad: '',
    contactoEmergencia: '',
    telefonoEmergencia: '',
    // Datos del contrato
    unidadId: '',
    fechaInicioContrato: '',
    fechaFinContrato: '',
    // Flujo existente
    usuarioId: ''
  });

  // Cargar unidades disponibles al montar
  useEffect(() => {
    fetchUnidadesDisponibles();
  }, []);

  const fetchUnidadesDisponibles = async () => {
    try {
      setLoadingUnidades(true);
      // Obtener todas las unidades del edificio
      const response = await unidadesService.getAll();
      const todasLasUnidades = response.data?.data || response.data || [];

      // Filtrar solo unidades disponibles (activas y sin inquilino)
      const unidadesDisponibles = todasLasUnidades.filter(
        unidad => unidad.activa && !unidad.inquilino
      );

      setUnidades(unidadesDisponibles.sort((a, b) => {
        // Ordenar por piso y luego por número
        if (a.piso !== b.piso) return a.piso - b.piso;
        return a.numero.localeCompare(b.numero);
      }));
    } catch (error) {
      console.warn('No se pudieron cargar las unidades disponibles:', error.message);
      setUnidades([]);
      // No mostrar error al usuario, permitir ingreso manual
    } finally {
      setLoadingUnidades(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (flujo === 'completo') {
      if (!formData.nombres.trim()) newErrors.nombres = 'Nombres requeridos';
      if (!formData.apellidos.trim()) newErrors.apellidos = 'Apellidos requeridos';
      if (!formData.email.trim()) newErrors.email = 'Email requerido';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
      if (!formData.dni.trim()) newErrors.dni = 'DNI requerido';
    } else {
      if (!formData.usuarioId.trim()) newErrors.usuarioId = 'ID de usuario requerido';
    }

    if (!formData.unidadId.trim()) newErrors.unidadId = 'Unidad requerida';
    if (!formData.fechaInicioContrato) newErrors.fechaInicioContrato = 'Fecha de inicio requerida';
    if (!formData.fechaFinContrato) newErrors.fechaFinContrato = 'Fecha de fin requerida';

    const fechaInicio = new Date(formData.fechaInicioContrato);
    const fechaFin = new Date(formData.fechaFinContrato);
    if (fechaInicio >= fechaFin) {
      newErrors.fechaFinContrato = 'Fecha de fin debe ser posterior a fecha de inicio';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      let resultado;

      if (flujo === 'completo') {
        // Flujo completo: crear usuario + inquilino
        resultado = await inquilinosService.createCompleto({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          email: formData.email,
          dni: formData.dni,
          telefono: formData.telefono,
          tipoDocumento: formData.tipoDocumento,
          nacionalidad: formData.nacionalidad,
          contactoEmergencia: formData.contactoEmergencia,
          telefonoEmergencia: formData.telefonoEmergencia,
          unidadId: formData.unidadId,
          fechaInicioContrato: formData.fechaInicioContrato,
          fechaFinContrato: formData.fechaFinContrato
        });
      } else {
        // Flujo existente: solo crear inquilino
        resultado = await inquilinosService.create({
          usuarioId: formData.usuarioId,
          unidadId: formData.unidadId,
          fechaInicioContrato: formData.fechaInicioContrato,
          fechaFinContrato: formData.fechaFinContrato,
          nacionalidad: formData.nacionalidad,
          contactoEmergencia: formData.contactoEmergencia,
          telefonoEmergencia: formData.telefonoEmergencia
        });
      }

      toast.success('✓ Inquilino registrado exitosamente');
      navigate('/inquilinos');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar el inquilino';
      toast.error(message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Registrar Nuevo Inquilino</h1>
        <p className="text-gray-600 mb-8">Completa el formulario para registrar un nuevo inquilino en el sistema</p>

        

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* FLUJO COMPLETO: Datos Personales */}
          {flujo === 'completo' && (
            <>
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  Datos Personales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Nombres *"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    error={errors.nombres}
                    placeholder="Ej: Juan"
                  />
                  <Input
                    label="Apellidos *"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    error={errors.apellidos}
                    placeholder="Ej: García López"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Ej: juan@example.com"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Documento
                    </label>
                    <select
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">Carné de Extranjería</option>
                      <option value="PASAPORTE">Pasaporte</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="DNI/Documento *"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    error={errors.dni}
                    placeholder="Ej: 12345678"
                  />
                  <Input
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 555123456"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Nacionalidad"
                    name="nacionalidad"
                    value={formData.nacionalidad}
                    onChange={handleChange}
                    placeholder="Ej: Peruana"
                  />
                  <Input
                    label="Contacto de Emergencia"
                    name="contactoEmergencia"
                    value={formData.contactoEmergencia}
                    onChange={handleChange}
                    placeholder="Ej: María García"
                  />
                </div>

                <div className="mt-4">
                  <Input
                    label="Teléfono de Emergencia"
                    name="telefonoEmergencia"
                    value={formData.telefonoEmergencia}
                    onChange={handleChange}
                    placeholder="Ej: 555654321"
                  />
                </div>
              </div>
            </>
          )}

          {/* FLUJO EXISTENTE: ID Usuario */}
          {flujo === 'existente' && (
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Usuario Existente
              </h3>
              <Input
                label="ID del Usuario Inquilino *"
                name="usuarioId"
                value={formData.usuarioId}
                onChange={handleChange}
                error={errors.usuarioId}
                placeholder="Ingresa el UUID del usuario"
              />
            </div>
          )}

          {/* Datos de Unidad y Contrato */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Home size={20} className="text-green-600" />
              Asignación de Unidad
            </h3>

            {/* Loading State */}
            {loadingUnidades && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-sm text-blue-700">Cargando unidades disponibles...</p>
              </div>
            )}

            {/* Select de Unidades */}
            {!loadingUnidades && unidades.length > 0 ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona una Unidad Disponible *
                </label>
                <select
                  name="unidadId"
                  value={formData.unidadId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    errors.unidadId 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 bg-white hover:border-green-400'
                  }`}
                >
                  <option value="">-- Selecciona una unidad --</option>
                  {unidades.map(unidad => (
                    <option key={unidad.id} value={unidad.id}>
                      {unidad.numero} - Piso {unidad.piso} (Capacidad: {unidad.capacidadMaxima})
                    </option>
                  ))}
                </select>
                {errors.unidadId && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.unidadId}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Se muestran solo las unidades activas y sin inquilino asignado
                </p>
              </div>
            ) : !loadingUnidades && unidades.length === 0 ? (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700 font-medium mb-3">
                  ⚠️ No hay unidades disponibles en tu edificio
                </p>
                <p className="text-xs text-amber-600 mb-3">
                  Necesitas tener unidades activas y sin inquilino asignado. Por favor:
                </p>
                <ul className="text-xs text-amber-600 space-y-1 list-disc list-inside mb-4">
                  <li>Crea nuevas unidades desde el módulo de Unidades</li>
                  <li>O verifica que existan unidades disponibles</li>
                </ul>
                <div className="border-t border-amber-200 pt-3 mt-3">
                  <p className="text-xs text-amber-700 font-medium mb-2">
                    Ingresa manualmente el ID de la unidad:
                  </p>
                  <Input
                    label=""
                    name="unidadId"
                    value={formData.unidadId}
                    onChange={handleChange}
                    error={errors.unidadId}
                    placeholder="Ejemplo: a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Fechas de Contrato */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-orange-600" />
              Fechas del Contrato
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha de Inicio *"
                name="fechaInicioContrato"
                type="date"
                value={formData.fechaInicioContrato}
                onChange={handleChange}
                error={errors.fechaInicioContrato}
              />
              <Input
                label="Fecha de Fin *"
                name="fechaFinContrato"
                type="date"
                value={formData.fechaFinContrato}
                onChange={handleChange}
                error={errors.fechaFinContrato}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate('/inquilinos')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || loadingUnidades}
              className="flex-1"
            >
              {loading ? 'Registrando...' : 'Registrar Inquilino'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CrearInquilinoPage;