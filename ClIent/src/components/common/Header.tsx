import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/utils/helpers';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/apartments?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:flex"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar - Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center relative"
        >
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un appartement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-80"
          />
        </form>

        {/* Search Button - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un appartement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <span className="font-medium">Nouvelle réservation</span>
                <span className="text-sm text-gray-500">
                  Un client a réservé votre appartement à Yaoundé
                </span>
                <span className="text-xs text-gray-400 mt-1">Il y a 5 minutes</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <span className="font-medium">Paiement reçu</span>
                <span className="text-sm text-gray-500">
                  Vous avez reçu un paiement de 45 000 FCFA
                </span>
                <span className="text-xs text-gray-400 mt-1">Il y a 1 heure</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <span className="font-medium">Avis reçu</span>
                <span className="text-sm text-gray-500">
                  Un client a laissé un avis 5 étoiles
                </span>
                <span className="text-xs text-gray-400 mt-1">Il y a 2 heures</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-rose-600">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {getInitials(user?.first_name, user?.last_name)}
                </span>
              </div>
              <span className="hidden sm:inline font-medium">{user?.first_name}</span>
              <ChevronDown className="h-4 w-4 hidden sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
