import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, Share2, Zap, UserCheck } from 'lucide-react';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Table from '../../../shared/components/ui/Table';
import Dropdown from '../../../shared/components/ui/Dropdown';
import ConfirmDeleteModal from '../../../shared/components/ui/ConfirmDeleteModal';
import EditarEdificioModal from './EditarEdificioModal';
import VerDetallesEdificioModal from './VerDetallesEdificioModal';
import AsignarAdminModal from './AsignarAdminModal';
import UpgradePlanModal from './UpgradePlanModal';
import { edificiosService } from '../services/edificiosService';
import toast from 'react-hot-toast';

const EdificiosPage = () => {
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estados para modales
  const [editModal, setEditModal] = useState({ isOpen: false, edificio: null });
  const [detallesModal, setDetallesModal] = useState({ isOpen: false, edificio: null });
  const [adminModal, setAdminModal] = useState({ isOpen: false, edificio: null });
  const [planModal, setPlanModal] = useState({ isOpen: false, edificio: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, edificioId: null, nombre: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEdificios = async () => {
    try {
      setLoading(true);
      const response = await edificiosService.getAll();
      console.log('📦 Respuesta del API:', response);
      
      // Ajusta según la estructura real que devuelve tu backend
      const edificiosData = response.data?.data || response.data || [];
      console.log('✅ Edificios cargados:', edificiosData);
      
      setEdificios(edificiosData);
    } catch (error) {
      toast.error('Error al cargar los edificios');
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdificios();
  }, []);

  // Columnas de la tabla mejorada
  const columns = [
    { header: 'Nombre', key: 'nombre' },
    { header: 'Dirección', key: 'direccion' },
    { header: 'Ciudad', key: 'ciudad' },
    { 
      header: 'Plan', 
      accessor: (row) => (
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
          {row.suscripcion?.plan?.nombre || 'GRATUITO'}
        </span>
      )
    },
    {
      header: 'Administrador',
      accessor: (row) => {
        const admin = row.administradores?.[0];
        return admin ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xs font-bold text-green-700">
                {admin.usuario?.nombres?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {admin.usuario?.nombres} {admin.usuario?.apellidos}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Sin asignar</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAdminModal({ isOpen: true, edificio: row })}
              className="text-xs h-6 px-2"
            >
              + Asignar
            </Button>
          </div>
        );
      }
    },
    { 
      header: 'Acciones', 
      accessor: (row) => (
        <div className="flex items-center gap-2 group">
          {/* Botones siempre visibles */}
          <Button 
            variant="outline" 
            size="sm"
            icon={Edit2}
            onClick={() => setEditModal({ isOpen: true, edificio: row })}
            className="h-8 px-2"
          >
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            icon={Eye}
            onClick={() => setDetallesModal({ isOpen: true, edificio: row })}
            className="h-8 px-2"
          >
          </Button>

          {/* Menú de opciones - aparece en hover */}
          <Dropdown
            items={[

              ...(row.administradores?.[0] ? [{
                label: 'Cambiar Admin',
                icon: <UserCheck size={16} />,
                onClick: () => setAdminModal({ isOpen: true, edificio: row })
              }] : []),
              {
                label: 'Actualizar Plan',
                icon: <Zap size={16} />,
                variant: 'success',
                onClick: () => setPlanModal({ isOpen: true, edificio: row })
              },
              {
                label: 'Eliminar',
                icon: <Trash2 size={16} />,
                variant: 'danger',
                onClick: () => setDeleteModal({ 
                  isOpen: true, 
                  edificioId: row.id, 
                  nombre: row.nombre 
                })
              }
            ]}
            size="sm"
          />
        </div>
      )
    }
  ];

  const handleAsignarAdmin = async (edificioId) => {
    const adminEmail = prompt("Ingrese el email del administrador a asignar:");
    if (!adminEmail) return;

    try {
      await edificiosService.asignarAdmin(edificioId, { email: adminEmail });
      toast.success(`Administrador ${adminEmail} asignado exitosamente`);
      fetchEdificios(); // Recargar lista
    } catch (error) {
      const message = error.response?.data?.message || 'Error al asignar administrador';
      toast.error(message);
      console.error('❌ Error asignando admin:', error);
    }
  };

  const handleUpgradePlan = async (edificioId) => {
    const nuevoPlan = prompt("Ingrese el nuevo plan (ESTANDAR o PREMIUM):");
    if (!nuevoPlan) return;

    try {
      await edificiosService.upgradePlan(edificioId, { plan: nuevoPlan });
      toast.success(`Plan mejorado a ${nuevoPlan}`);
      fetchEdificios(); // Recargar lista
    } catch (error) {
      const message = error.response?.data?.message || 'Error al mejorar plan';
      toast.error(message);
      console.error('❌ Error actualizando plan:', error);
    }
  };

  const handleVerHistorial = (edificioId) => {
    navigate(`/accesos?edificioId=${edificioId}`);
  };

  const handleEliminar = async () => {
    setDeleteLoading(true);
    try {
      await edificiosService.delete(deleteModal.edificioId);
      toast.success('✓ Edificio eliminado exitosamente');
      setDeleteModal({ isOpen: false, edificioId: null, nombre: '' });
      fetchEdificios();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al eliminar el edificio';
      toast.error(message);
      console.error('❌ Error eliminando edificio:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mis Edificios</h1>
          <p className="text-gray-600">Gestiona todos tus edificios y suscripciones</p>
        </div>
        <Button onClick={() => navigate('/edificios/crear')}>
          + Nuevo Edificio
        </Button>
      </div>

      <Table 
        columns={columns} 
        data={edificios} 
        isLoading={loading} 
      />

      {/* Modales */}
      <EditarEdificioModal

        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, edificio: null })}
        edificio={editModal.edificio}
        onSuccess={fetchEdificios}
      />

      <VerDetallesEdificioModal
        isOpen={detallesModal.isOpen}
        onClose={() => setDetallesModal({ isOpen: false, edificio: null })}
        edificio={detallesModal.edificio}
      />

      <AsignarAdminModal
        isOpen={adminModal.isOpen}
        onClose={() => setAdminModal({ isOpen: false, edificio: null })}
        edificio={adminModal.edificio}
        onSuccess={fetchEdificios}
      />

      <UpgradePlanModal
        isOpen={planModal.isOpen}
        onClose={() => setPlanModal({ isOpen: false, edificio: null })}
        edificio={planModal.edificio}
        onSuccess={fetchEdificios}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, edificioId: null, nombre: '' })}
        onConfirm={handleEliminar}
        title="Eliminar Edificio"
        message={`¿Está seguro de que desea eliminar "${deleteModal.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Edificio"
        cancelText="Cancelar"
        loading={deleteLoading}
      />
    </Layout>
  );
};

export default EdificiosPage;