// src/components/common/Navbar.jsx
import { Menu, Bell, Settings } from 'lucide-react';
import { getRoleLabel, getRoleColors } from './config/menuConfig';

const Navbar = ({ user, toggleSidebar, role, roleColors }) => {
  const roleLabel = getRoleLabel(role);
  const colors = roleColors || getRoleColors(role);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Lado izquierdo - Logo y Menú */}
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
               style={{ backgroundColor: colors.dark }}>
            D
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">DepaManager</h1>
            <p className="text-xs text-gray-500 -mt-1">Sistema de Gestión Inteligente</p>
          </div>
        </div>
      </div>

      {/* Lado derecho - Información del usuario */}
      <div className="flex items-center gap-6">
        {/* Notificaciones */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <Bell size={22} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Divisor */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* Información del usuario */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-gray-800 text-sm">
              {user?.nombres} {user?.apellidos}
            </p>
            <p className={`text-xs font-medium ${colors.text}`}>
              {roleLabel}
            </p>
          </div>

          {/* Avatar con iniciales */}
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shadow-md"
               style={{ backgroundColor: colors.dark }}>
            {user?.nombres?.charAt(0)}{user?.apellidos?.charAt(0)}
          </div>
        </div>

        {/* Ícono de configuración */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <Settings size={22} className="text-gray-600" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;