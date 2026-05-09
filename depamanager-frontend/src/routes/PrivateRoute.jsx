import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole) {
    // Si el rol es objeto, obtener la propiedad nombre
    const rolValue = typeof user?.rol === 'object' ? user?.rol?.nombre : user?.rol;
    const userRole = rolValue?.toUpperCase();
    
    if (userRole !== requiredRole.toUpperCase()) {
      console.warn(`❌ Acceso denegado: Usuario tiene rol ${userRole} pero se requiere ${requiredRole}`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;