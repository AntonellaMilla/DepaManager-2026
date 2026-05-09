import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Table from '../../../shared/components/ui/Table';
import Dropdown from '../../../shared/components/ui/Dropdown';
import CrearAdministradorModal from './CrearAdministradorModal';
import EditarAdministradorModal from './EditarAdministradorModal';
import ConfirmDeleteModal from '../../../shared/components/ui/ConfirmDeleteModal';
import { administradoresService } from '../services/administradoresService';
import toast from 'react-hot-toast';
import { Shield, Mail, Eye, Edit2, Trash2 } from 'lucide-react';

const AdministradoresPage = () => {
  const [administradores, setAdministradores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para modales
  const [crearModal, setCrearModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, admin: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, adminId: null, adminNombre: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  /**
   * Cargar lista de administradores
   */
  const fetchAdministradores = async () => {
    try {
      setLoading(true);
      const response = await administradoresService.listarAdministradores();
      console.log('📦 Administradores cargados:', response);
      
      const adminsData = Array.isArray(response) ? response : response.data || [];
      setAdministradores(adminsData);
    } catch (error) {
      toast.error('Error al cargar los administradores');
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdministradores();
  }, []);

  /**
   * Manejar creación exitosa
   */
  const handleCrearExito = () => {
    setCrearModal(false);
    fetchAdministradores();
    toast.success('✓ Administrador creado exitosamente');
  };

  /**
   * Manejar edición exitosa
   */
  const handleEditarExito = () => {
    setEditModal({ isOpen: false, admin: null });
    fetchAdministradores();
    toast.success('✓ Administrador actualizado exitosamente');
  };

  /**
   * Manejar eliminación
   */
  const handleEliminar = async () => {
    setDeleteLoading(true);
    try {
      await administradoresService.eliminarAdministrador(deleteModal.adminId);
      toast.success('✓ Administrador eliminado exitosamente');
      fetchAdministradores();
      setDeleteModal({ isOpen: false, adminId: null, adminNombre: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Error al eliminar el administrador';
      toast.error(message);
      console.error('❌ Error:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Columnas de la tabla - Diseño elegante
   */
  const columns = [
    {
      header: 'Nombre',
      accessor: (row) => `${row.nombres} ${row.apellidos}`
    },
    {
      header: 'Email',
      key: 'email'
    },
    {
      header: 'Teléfono',
      accessor: (row) => row.telefono || '—'
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.activo 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {/* Botones siempre visibles */}
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={() => setEditModal({ isOpen: true, admin: row })}
            className="h-8 px-2"
          >
            Editar
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => window.open(`mailto:${row.email}`, '_blank')}
            className="h-8 px-2"
          >
            Email
          </Button>

          {/* Menú de opciones */}
          <Dropdown
            items={[
              {
                label: 'Ver Detalles',
                icon: <Eye size={16} />,
                onClick: () => {
                  alert(`${row.nombres} ${row.apellidos}\n${row.email}\n${row.telefono || 'Sin teléfono'}`);
                }
              },
              {
                label: 'Eliminar',
                icon: <Trash2 size={16} />,
                variant: 'danger',
                onClick: () => setDeleteModal({
                  isOpen: true,
                  adminId: row.id,
                  adminNombre: `${row.nombres} ${row.apellidos}`
                })
              }
            ]}
            size="sm"
          />
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Administradores</h1>
          </div>
          <p className="text-gray-600">Gestiona los administradores de tus edificios</p>
        </div>
        <Button 
          onClick={() => setCrearModal(true)}
          className="flex items-center gap-2"
        >
          + Crear Administrador
        </Button>
      </div>

      {/* Tabla de administradores */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p>Cargando administradores...</p>
          </div>
        ) : administradores.length === 0 ? (
          <div className="p-12 text-center">
            <Shield size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">No hay administradores registrados aún</p>
            <Button onClick={() => setCrearModal(true)}>
              Crear primer administrador
            </Button>
          </div>
        ) : (
          <Table 
            columns={columns} 
            data={administradores} 
            isLoading={false}
          />
        )}
      </div>

      {/* Modales */}
      <CrearAdministradorModal
        isOpen={crearModal}
        onClose={() => setCrearModal(false)}
        onSuccess={handleCrearExito}
      />

      <EditarAdministradorModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, admin: null })}
        admin={editModal.admin}
        onSuccess={handleEditarExito}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, adminId: null, adminNombre: '' })}
        onConfirm={handleEliminar}
        title="Eliminar Administrador"
        message={`¿Está seguro de que desea eliminar a "${deleteModal.adminNombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default AdministradoresPage;
