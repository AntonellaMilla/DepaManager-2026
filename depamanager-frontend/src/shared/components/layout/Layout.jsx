// src/components/common/Layout.jsx
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { getMenuItems, getRoleColors } from './config/menuConfig';

const Layout = ({ children }) => {
  const { user } = useAuth();
  
  // Estado del sidebar (persiste en localStorage)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persistir estado del sidebar
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Obtener rol de forma segura (soporta string o {nombre: "..."})
  const getUserRole = () => {
    if (!user?.rol) return null;
    const rolValue = typeof user.rol === 'object' 
      ? user.rol?.nombre 
      : user.rol;
    return rolValue?.toUpperCase() || null;
  };

  const userRole = getUserRole();
  const menuItems = getMenuItems(userRole);
  const roleColors = getRoleColors(userRole);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        menuItems={menuItems} 
        isOpen={sidebarOpen} 
        role={userRole}
        roleColors={roleColors}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          user={user} 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
          role={userRole}
          roleColors={roleColors}
        />

        <main className="flex-1 overflow-auto p-6 bg-linear-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;