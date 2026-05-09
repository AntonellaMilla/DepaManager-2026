import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Table from '../../../shared/components/ui/Table';
import { vehiculosService } from '../services/vehiculosService';
import toast from 'react-hot-toast';

const VehiculosPage = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const response = await vehiculosService.getAll();
      setVehiculos(response.data?.data || response.data || []);
    } catch (error) {
      toast.error('Error al cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const columns = [
    { header: 'Placa', key: 'placa' },
    { header: 'Marca', key: 'marca' },
    { header: 'Modelo', key: 'modelo' },
    { header: 'Color', key: 'color' },
    { 
      header: 'Estado', 
      accessor: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    { 
      header: 'Acciones', 
      accessor: (row) => (
        <Button 
          variant={row.activo ? "danger" : "success"} 
          size="sm"
          onClick={() => handleToggle(row.id)}
        >
          {row.activo ? 'Desactivar' : 'Activar'}
        </Button>
      )
    }
  ];

  const handleToggle = async (id) => {
    try {
      await vehiculosService.toggleActivo(id);
      toast.success('Estado del vehículo actualizado');
      fetchVehiculos();
    } catch (error) {
      toast.error('Error al actualizar el vehículo');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Vehículos Registrados</h1>
        <Button onClick={() => navigate('/vehiculos/crear')}>
            + Nuevo Vehículo
            </Button>
      </div>

      <Table 
        columns={columns} 
        data={vehiculos} 
        isLoading={loading} 
      />
    </Layout>
  );
};

export default VehiculosPage;