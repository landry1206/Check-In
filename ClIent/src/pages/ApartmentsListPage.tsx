import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List,
  Loader2,
  Building2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Apartment } from '@/types';
import { apartmentService } from '@/services/api';
import { formatPrice, truncateText } from '@/utils/helpers';
import { APARTMENT_STATUSES, APARTMENT_CATEGORIES } from '@/utils/constants';

export const ApartmentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState<Apartment | null>(null);

  useEffect(() => {
    fetchApartments();
  }, []);

  useEffect(() => {
    filterApartments();
  }, [apartments, searchQuery, statusFilter, categoryFilter]);

  const fetchApartments = async () => {
    try {
      const data = await apartmentService.getAll();
      // L'API retourne un objet avec results, pas un array direct
      const response = data as any;
      const apartmentsArray = Array.isArray(response) ? response : (response.results || []);
      setApartments(apartmentsArray);
    } catch (error) {
      console.error('Erreur lors du chargement des appartements:', error);
      // Données de démonstration
      setApartments(getMockApartments());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockApartments = (): Apartment[] => [
    {
      id: '1',
      creator: 'user1',
      title: 'Appartement Luxueux à Yaoundé',
      description: 'Un bel appartement moderne avec toutes les commodités. Vue panoramique sur la ville.',
      latitude: 3.848,
      longitude: 11.502,
      category: 'appartement',
      main_photo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      status: 'disponible',
      city: 'Yaoundé',
      country: 'Cameroun',
      price_per_hour: '15000.00',
      gallery: [],
      unavailabilities: [],
      created_at: '2026-01-15T10:00:00Z',
    },
    {
      id: '2',
      creator: 'user1',
      title: 'Villa avec Piscine à Douala',
      description: 'Magnifique villa avec piscine privée et jardin tropical.',
      latitude: 4.051,
      longitude: 9.767,
      category: 'villa',
      main_photo: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      status: 'occupe',
      city: 'Douala',
      country: 'Cameroun',
      price_per_hour: '35000.00',
      gallery: [],
      unavailabilities: [],
      created_at: '2026-01-10T14:30:00Z',
    },
    {
      id: '3',
      creator: 'user1',
      title: 'Studio Moderne au Centre-ville',
      description: 'Studio parfait pour les séjours courts, entièrement équipé.',
      latitude: 3.848,
      longitude: 11.502,
      category: 'studio',
      main_photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      status: 'disponible',
      city: 'Yaoundé',
      country: 'Cameroun',
      price_per_hour: '8000.00',
      gallery: [],
      unavailabilities: [],
      created_at: '2026-01-20T09:00:00Z',
    },
    {
      id: '4',
      creator: 'user1',
      title: 'Maison Familiale à Bafoussam',
      description: 'Grande maison familiale avec 4 chambres et grand jardin.',
      latitude: 5.477,
      longitude: 10.417,
      category: 'maison',
      main_photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      status: 'maintenance',
      city: 'Bafoussam',
      country: 'Cameroun',
      price_per_hour: '20000.00',
      gallery: [],
      unavailabilities: [],
      created_at: '2026-01-05T16:00:00Z',
    },
    {
      id: '5',
      creator: 'user1',
      title: 'Loft Industriel à Douala',
      description: 'Loft au design industriel avec grandes fenêtres.',
      latitude: 4.051,
      longitude: 9.767,
      category: 'loft',
      main_photo: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=800',
      status: 'disponible',
      city: 'Douala',
      country: 'Cameroun',
      price_per_hour: '18000.00',
      gallery: [],
      unavailabilities: [],
      created_at: '2026-01-25T11:00:00Z',
    },
    {
      id: '6',
      creator: 'user1',
      title: 'Chalet en Montagne',
      description: 'Chalet confortable avec vue sur les montagnes.',
      latitude: 5.963,
      longitude: 10.159,
      category: 'chalet',
      main_photo: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
      status: 'inactif',
      city: 'Bamenda',
      country: 'Cameroun',
      price_per_hour: '25000.00',
      gallery: [],
      unavailabilities: [],
      created_at: '2026-01-08T13:00:00Z',
    },
  ];

  const filterApartments = () => {
    let filtered = [...apartments];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.title.toLowerCase().includes(query) ||
          apt.description.toLowerCase().includes(query) ||
          apt.city.toLowerCase().includes(query) ||
          apt.country.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.category === categoryFilter);
    }

    setFilteredApartments(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleDelete = async () => {
    if (!apartmentToDelete) return;

    try {
      await apartmentService.delete(apartmentToDelete.id);
      setApartments((prev) => prev.filter((apt) => apt.id !== apartmentToDelete.id));
      setDeleteDialogOpen(false);
      setApartmentToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = APARTMENT_STATUSES.find((s) => s.value === status);
    return (
      <Badge className={`${statusConfig?.color || 'bg-gray-500'} text-white`}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getCategoryLabel = (category: string) => {
    return APARTMENT_CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Appartements</h1>
          <p className="text-gray-500">
            {filteredApartments.length} propriété{filteredApartments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => navigate('/apartments/create')}
          className="bg-rose-600 hover:bg-rose-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un appartement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {APARTMENT_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {APARTMENT_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-rose-600' : ''}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-rose-600' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Apartments Grid/List */}
      {filteredApartments.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun appartement trouvé</h3>
          <p className="text-gray-500 mt-1">
            Essayez de modifier vos filtres ou ajoutez un nouvel appartement.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredApartments.map((apartment) => (
            <Card key={apartment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={apartment.main_photo}
                  alt={apartment.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/apartments/${apartment.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/apartments/${apartment.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setApartmentToDelete(apartment);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute bottom-2 left-2">
                  {getStatusBadge(apartment.status)}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{apartment.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {apartment.city}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {truncateText(apartment.description, 60)}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-semibold text-rose-600">
                    {formatPrice(apartment.price_per_hour)}/h
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {getCategoryLabel(apartment.category)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredApartments.map((apartment) => (
            <Card key={apartment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={apartment.main_photo}
                    alt={apartment.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{apartment.title}</h3>
                      {getStatusBadge(apartment.status)}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {apartment.city}, {apartment.country}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {truncateText(apartment.description, 80)}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-medium text-rose-600">
                        {formatPrice(apartment.price_per_hour)}/heure
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {getCategoryLabel(apartment.category)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/apartments/${apartment.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/apartments/${apartment.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => {
                        setApartmentToDelete(apartment);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{apartmentToDelete?.title}" ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
