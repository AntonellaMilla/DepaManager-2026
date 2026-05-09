import Layout from '../../../shared/components/layout/Layout';

const DashboardPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-600 text-lg">
            Bienvenido al sistema de gestión de edificios <strong>DepaManager</strong>.
          </p>
          <p className="mt-4 text-gray-500">
            Selecciona una opción del menú lateral para comenzar.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;