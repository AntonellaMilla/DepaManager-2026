import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Table from '../../../shared/components/ui/Table';
import CrearUnidadModal from '../../unidades/components/CrearUnidadModal';
import { unidadesService } from '../services/unidadesService';
import toast from 'react-hot-toast';

const UnidadesPage = () => {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crearModal, setCrearModal] = useState(false);
  const navigate = useNavigate();

  const fetchUnidades = async () => {
    try {
      setLoading(true);
      const data = await unidadesService.getAll();

      console.log('🏢 Unidades cargadas:', data);
      setUnidades(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Error al cargar las unidades');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  // ================= ACCIONES =================

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta unidad?')) return;

    try {
      await unidadesService.delete(id);
      toast.success('Unidad eliminada');
      fetchUnidades();
    } catch (error) {
      toast.error('Error al eliminar');
      console.error(error);
    }
  };

  const handleAsignar = (id) => {
    navigate(`/unidades/${id}/asignar`);
  };

  const handleEditar = (id) => {
    navigate(`/unidades/${id}/editar`);
  };

  // ================= TABLA =================

  const columns = [
    { header: 'Número', key: 'numero' },
    { header: 'Piso', key: 'piso' },
    { header: 'Capacidad', key: 'capacidadMaxima' },
    { header: 'Ocupantes', key: 'ocupantesActuales' },

    {
      header: 'Estado',
      accessor: (row) => (
        <span className={row.activa ? 'text-green-600' : 'text-red-500'}>
          {row.activa ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },

    {
      header: 'Acciones',
      accessor: (row) => (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAsignar(row.id)}
          >
            Asignar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditar(row.id)}
          >
            Editar
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => handleEliminar(row.id)}
          >
            Inactivar
          </Button>
        </div>
      ),
    },
  ];

  // ================= UI =================

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Unidades
          </h1>
          <p className="text-gray-600">
            Gestiona las unidades de tu edificio
          </p>
        </div>

        <Button onClick={() => setCrearModal(true)}>
          + Nueva Unidad
        </Button>
      </div>

      <Table
        columns={columns}
        data={unidades}
        isLoading={loading}
      />

      {/* Modales */}
      <CrearUnidadModal
        isOpen={crearModal}
        onClose={() => setCrearModal(false)}
        onSuccess={fetchUnidades}
      />

      {/* FUTURO */}
      <div className="mt-8 text-xs text-gray-400 text-center">
        {/*
          FUTURO:
          - Filtro por piso
          - Crear unidades por rango (🔥 TU BACKEND YA LO SOPORTA)
          - Indicador de ocupación (%)
        */}
      </div>
    </Layout>
  );
};

export default UnidadesPage;
