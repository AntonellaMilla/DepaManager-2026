import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Table from '../../../shared/components/ui/Table';
import { inquilinosService } from '../services/inquilinosService';
import EditarInquilinoModal from './EditarInquilinoModal';
import VerDetallesInquilinoModal from './VerDetallesInquilinoModal';
import toast from 'react-hot-toast';

const InquilinosPage = () => {
  const [inquilinos, setInquilinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ isOpen: false, inquilino: null });
  const [detallesModal, setDetallesModal] = useState({ isOpen: false, inquilino: null });
  const navigate = useNavigate();

  const fetchInquilinos = async () => {
    try {
      setLoading(true);
      const response = await inquilinosService.getAll();
      setInquilinos(response.data?.data || response.data || []);
    } catch (error) {
      toast.error('Error al cargar los inquilinos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquilinos();
  }, []);

  const handleVerDetalles = (inquilino) => {
    setDetallesModal({ isOpen: true, inquilino });
  };

  const handleEditar = (inquilino) => {
    setEditModal({ isOpen: true, inquilino });
  };

  const handleFinalizarContrato = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas finalizar este contrato? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await inquilinosService.finalizarContrato(id);
      toast.success('✓ Contrato finalizado correctamente');
      fetchInquilinos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al finalizar el contrato');
    }
  };

  const columns = [
    {
      header: 'Nombre',
      accessor: (row) => `${row.usuario?.nombres || ''} ${row.usuario?.apellidos || ''}`,
      width: '200px'
    },
    {
      header: 'Email',
      accessor: (row) => row.usuario?.email || '-',
      width: '200px'
    },
    {
      header: 'DNI',
      accessor: (row) => row.usuario?.dni || '-',
      width: '120px'
    },
    {
      header: 'Unidad',
      accessor: (row) => row.unidad?.numero || 'Sin unidad',
      width: '100px'
    },
    {
      header: 'Piso',
      accessor: (row) => row.unidad?.piso || '-',
      width: '80px'
    },
    {
      header: 'Teléfono',
      accessor: (row) => row.usuario?.telefono || '-',
      width: '130px'
    },
    {
      header: 'Inicio Contrato',
      accessor: (row) => row.fechaInicioContrato?.split('T')[0] || '-',
      width: '130px'
    },
    {
      header: 'Fin Contrato',
      accessor: (row) => row.fechaFinContrato?.split('T')[0] || '-',
      width: '130px'
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
          row.estadoContrato === 'ACTIVO'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {row.estadoContrato || 'ACTIVO'}
        </span>
      ),
      width: '100px'
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleVerDetalles(row)}
            className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
            title="Ver detalles"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEditar(row)}
            className="p-2 hover:bg-amber-50 rounded-lg transition text-amber-600"
            title="Editar"
          >
            <Edit2 size={18} />
          </button>
          {row.estadoContrato === 'ACTIVO' && (
            <button
              onClick={() => handleFinalizarContrato(row.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
              title="Finalizar contrato"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ),
      width: '120px'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Inquilinos</h1>
            <p className="text-gray-600 mt-1">Total: {inquilinos.length} inquilino(s)</p>
          </div>
          <Button onClick={() => navigate('/inquilinos/crear')} size="lg">
            + Nuevo Inquilino
          </Button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="mt-4">Cargando inquilinos...</p>
            </div>
          ) : inquilinos.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No hay inquilinos registrados</p>
              <Button onClick={() => navigate('/inquilinos/crear')}>
                Registrar el primer inquilino
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {columns.map((col, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        style={{ width: col.width }}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inquilinos.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition">
                      {columns.map((col, idx) => (
                        <td
                          key={idx}
                          className="px-6 py-4 text-sm text-gray-900"
                          style={{ width: col.width }}
                        >
                          {col.accessor ? col.accessor(row) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <EditarInquilinoModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, inquilino: null })}
        inquilino={editModal.inquilino}
        onSuccess={fetchInquilinos}
      />

      <VerDetallesInquilinoModal
        isOpen={detallesModal.isOpen}
        onClose={() => setDetallesModal({ isOpen: false, inquilino: null })}
        inquilino={detallesModal.inquilino}
      />
    </Layout>
  );
};

export default InquilinosPage;