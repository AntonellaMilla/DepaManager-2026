import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';
import { LoginPage, RegisterPage } from '../modules/auth';
import { DashboardPage } from '../modules/dashboard';
import { EdificiosPage, CrearEdificioPage } from '../modules/edificios';
import { AdministradoresPage } from '../modules/administradores';
import { HistorialAccesosPage } from '../modules/accesos';
import { AlertasPage } from '../modules/alertas';
import { UnidadesPage, CrearUnidadPage } from '../modules/unidades';
import { InquilinosPage, CrearInquilinoPage } from '../modules/inquilinos';
import { VehiculosPage } from '../modules/vehiculos';





import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        }
      />



      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/edificios"
        element={
          <PrivateRoute requiredRole="PROPIETARIO">
            <EdificiosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/edificios/crear"
        element={
          <PrivateRoute requiredRole="PROPIETARIO">
            <CrearEdificioPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/administradores"
        element={
          <PrivateRoute requiredRole="PROPIETARIO">
            <AdministradoresPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/accesos"
        element={
          <PrivateRoute requiredRole="PROPIETARIO">
            <HistorialAccesosPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/alertas"
        element={
          <PrivateRoute requiredRole="PROPIETARIO">
            <AlertasPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/unidades"
        element={
          <PrivateRoute requiredRole="ADMINISTRADOR">
            <UnidadesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/unidades/crear"
        element={
          <PrivateRoute requiredRole="ADMINISTRADOR">
            <CrearUnidadPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/inquilinos"
        element={
          <PrivateRoute requiredRole="ADMINISTRADOR">
            <InquilinosPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/inquilinos/crear"
        element={
          <PrivateRoute requiredRole="ADMINISTRADOR">
            <CrearInquilinoPage />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
