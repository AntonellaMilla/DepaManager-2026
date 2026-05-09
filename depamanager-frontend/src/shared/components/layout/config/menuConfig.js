// src/components/common/config/menuConfig.js
import { 
  Home, Building2, Users, Car, History, AlertTriangle, 
  DoorOpen, Shield, TrendingUp
} from 'lucide-react';

// Definición de roles
export const ROLES = {
  PROPIETARIO: 'PROPIETARIO',
  ADMINISTRADOR: 'ADMINISTRADOR',
  INQUILINO: 'INQUILINO',
};

// Configuración de colores por rol (profesional y consistente)
export const ROLE_COLORS = {
  [ROLES.PROPIETARIO]: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-800',
    hover: 'hover:bg-teal-100',
    active: 'bg-teal-600 text-white',
    dark: '#008B8B',
  },
  [ROLES.ADMINISTRADOR]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    hover: 'hover:bg-blue-100',
    active: 'bg-blue-600 text-white',
    dark: '#0066CC',
  },
  [ROLES.INQUILINO]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800',
    hover: 'hover:bg-green-100',
    active: 'bg-green-600 text-white',
    dark: '#059669',
  },
};

// Menú por rol
export const MENU_BY_ROLE = {
  [ROLES.PROPIETARIO]: [
    { name: 'Dashboard', path: '/dashboard', icon: Home, description: 'Resumen general' },
    { name: 'Edificios', path: '/edificios', icon: Building2, description: 'Gestionar edificios' },
    { name: 'Administradores', path: '/administradores', icon: Shield, description: 'Gestionar admins' },
    { name: 'Accesos', path: '/accesos', icon: History, description: 'Historial de accesos' },
    { name: 'Alertas', path: '/alertas', icon: AlertTriangle, description: 'Notificaciones' },

  ],
  [ROLES.ADMINISTRADOR]: [
    { name: 'Dashboard', path: '/dashboard', icon: Home, description: 'Resumen general' },
    { name: 'Unidades', path: '/unidades', icon: DoorOpen, description: 'Gestionar unidades' },
    { name: 'Inquilinos', path: '/inquilinos', icon: Users, description: 'Gestionar inquilinos' },
    { name: 'Vehículos', path: '/vehiculos', icon: Car, description: 'Registrar vehículos' },
    { name: 'Accesos', path: '/accesos', icon: History, description: 'Ver accesos' },
    { name: 'Alertas', path: '/alertas', icon: AlertTriangle, description: 'Ver alertas' },
  ],
  [ROLES.INQUILINO]: [
    { name: 'Dashboard', path: '/dashboard', icon: Home, description: 'Mi resumen' },
    { name: 'Mis Vehículos', path: '/vehiculos', icon: Car, description: 'Mis vehículos registrados' },
    { name: 'Accesos', path: '/accesos', icon: History, description: 'Mi historial' },
  ],
};

// Función para obtener menú por rol
export const getMenuItems = (role) => {
  return MENU_BY_ROLE[role] || MENU_BY_ROLE[ROLES.PROPIETARIO];
};

// Función para obtener colores por rol
export const getRoleColors = (role) => {
  return ROLE_COLORS[role] || ROLE_COLORS[ROLES.PROPIETARIO];
};

// Etiqueta legible del rol
export const getRoleLabel = (role) => {
  const labels = {
    [ROLES.PROPIETARIO]: 'Propietario',
    [ROLES.ADMINISTRADOR]: 'Administrador',
    [ROLES.INQUILINO]: 'Inquilino',
  };
  return labels[role] || 'Usuario';
};