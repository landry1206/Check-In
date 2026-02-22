import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  Users,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/utils/helpers';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/apartments', label: 'Appartements', icon: Building2 },
  { path: '/apartments/create', label: 'Ajouter', icon: PlusCircle },
  { path: '/bookings', label: 'Réservations', icon: Calendar },
  { path: '/messages', label: 'Messages', icon: MessageSquare, badge: 3 },
];

const secondaryNavItems: NavItem[] = [
  { path: '/analytics', label: 'Statistiques', icon: BarChart3 },
  { path: '/guests', label: 'Clients', icon: Users },
  { path: '/notifications', label: 'Notifications', icon: Bell, badge: 5 },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Home className="h-5 w-5 text-white" />
          </div>
          {isOpen && (
            <span className="font-bold text-xl text-gray-900">AirAdmin</span>
          )}
        </NavLink>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-[calc(100%-4rem)]">
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {/* Section principale */}
          <div className="mb-6">
            {isOpen && (
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Principal
              </p>
            )}
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive(item.path)
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive(item.path)
                      ? 'text-rose-600'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                {isOpen && (
                  <>
                    <span className="font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-rose-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Section secondaire */}
          <div>
            {isOpen && (
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Gestion
              </p>
            )}
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive(item.path)
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive(item.path)
                      ? 'text-rose-600'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                {isOpen && (
                  <>
                    <span className="font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-rose-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-gray-200">
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isOpen ? '' : 'justify-center'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">
                {getInitials(user?.first_name, user?.last_name)}
              </span>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 mt-2 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${
              isOpen ? '' : 'justify-center'
            }`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
