// src/components/common/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getRoleColors } from './config/menuConfig';

const Sidebar = ({ menuItems, isOpen, role, roleColors }) => {
  const { logout } = useAuth();
  const colors = roleColors || getRoleColors(role);

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 h-screen transition-all duration-300 ease-in-out flex flex-col shadow-lg overflow-hidden`}>
      {/* Header - Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
               style={{ backgroundColor: colors.dark }}>
            D
          </div>
          {isOpen && (
            <div className="flex-1">
              <span className="font-bold text-xl text-gray-800">DepaManager</span>
            </div>
          )}
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? `${colors.active} shadow-md` 
                    : `text-gray-700 hover:${colors.bg}`
                }`
              }
              title={!isOpen ? item.name : undefined}
            >
              {/* Background hover effect */}
              {!isOpen && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                     style={{ backgroundColor: colors.dark, opacity: 0.1 }}></div>
              )}
              
              <IconComponent size={22} className="shrink-0 relative z-10" />
              
              {isOpen && (
                <>
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="font-medium truncate">{item.name}</p>
                    {item.description && (
                      <p className="text-xs opacity-75 truncate">{item.description}</p>
                    )}
                  </div>
                  <ChevronRight size={18} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-gray-100 bg-linear-to-r from-gray-50 to-transparent">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 hover:bg-red-50 text-red-600 font-medium group"
        >
          <LogOut size={22} className="shrink-0" />
          {isOpen && (
            <>
              <span>Cerrar Sesión</span>
              <ChevronRight size={18} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;