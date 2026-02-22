import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  MapPin,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Apartment, DashboardStats } from '@/types';
import { apartmentService } from '@/services/api';
import { formatPrice, formatDate, truncateText } from '@/utils/helpers';
import { APARTMENT_STATUSES } from '@/utils/constants';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  color,
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center gap-2 mt-1">
        {trend && (
          <span
            className={`flex items-center text-xs ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
            )}
            {trendValue}
          </span>
        )}
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalApartments: 0,
    availableApartments: 0,
    occupiedApartments: 0,
    maintenanceApartments: 0,
    totalRevenue: 0,
    recentBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await apartmentService.getAll();
      // L'API retourne un objet avec results, pas un array direct
      const response = data as any;
      const apartmentsData = Array.isArray(response) ? response : (response.results || []);
      setApartments(apartmentsData.slice(0, 5));

      // Calculer les statistiques
      const available = apartmentsData.filter((a) => a.status === 'disponible').length;
      const occupied = apartmentsData.filter((a) => a.status === 'occupe').length;
      const maintenance = apartmentsData.filter((a) => a.status === 'maintenance').length;

      setStats({
        totalApartments: apartmentsData.length,
        availableApartments: available,
        occupiedApartments: occupied,
        maintenanceApartments: maintenance,
        totalRevenue: available * 15000, // Simulation
        recentBookings: 12, // Simulation
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Données de démonstration en cas d'erreur
      setApartments(getMockApartments());
      setStats({
        totalApartments: 24,
        availableApartments: 18,
        occupiedApartments: 4,
        maintenanceApartments: 2,
        totalRevenue: 1250000,
        recentBookings: 12,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMockApartments = (): Apartment[] => [
    {
      id: '1',
      creator: 'user1',
      title: 'Appartement Luxueux à Yaoundé',
      description: 'Un bel appartement moderne avec toutes les commodités.',
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
      description: 'Magnifique villa avec piscine privée.',
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
      description: 'Studio parfait pour les séjours courts.',
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
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = APARTMENT_STATUSES.find((s) => s.value === status);
    return (
      <Badge className={`${statusConfig?.color || 'bg-gray-500'} text-white`}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue sur votre espace de gestion</p>
        </div>
        <Button
          onClick={() => navigate('/apartments/create')}
          className="bg-rose-600 hover:bg-rose-700"
        >
          <Building2 className="mr-2 h-4 w-4" />
          Ajouter un appartement
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Appartements"
          value={stats.totalApartments}
          description="Propriétés enregistrées"
          icon={Building2}
          trend="up"
          trendValue="+12%"
          color="bg-blue-600"
        />
        <StatCard
          title="Disponibles"
          value={stats.availableApartments}
          description="Prêts à louer"
          icon={TrendingUp}
          trend="up"
          trendValue="+5%"
          color="bg-green-600"
        />
        <StatCard
          title="Réservations"
          value={stats.recentBookings}
          description="Ce mois-ci"
          icon={Calendar}
          trend="up"
          trendValue="+18%"
          color="bg-rose-600"
        />
        <StatCard
          title="Revenus"
          value={formatPrice(stats.totalRevenue)}
          description="Ce mois-ci"
          icon={Users}
          trend="up"
          trendValue="+23%"
          color="bg-purple-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Apartments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Appartements récents</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/apartments')}
            >
              Voir tout
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apartments.map((apartment) => (
                <div
                  key={apartment.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/apartments/${apartment.id}`)}
                >
                  <img
                    src={apartment.main_photo}
                    alt={apartment.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {apartment.title}
                      </h3>
                      {getStatusBadge(apartment.status)}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {apartment.city}, {apartment.country}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {truncateText(apartment.description, 60)}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm font-medium text-rose-600">
                        {formatPrice(apartment.price_per_hour)}/heure
                      </span>
                      <span className="text-xs text-gray-400">
                        Ajouté le {formatDate(apartment.created_at || '')}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Occupancy Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Taux d'occupation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Disponibles</span>
                  <span className="font-medium">{stats.availableApartments}</span>
                </div>
                <Progress
                  value={(stats.availableApartments / stats.totalApartments) * 100}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Occupés</span>
                  <span className="font-medium">{stats.occupiedApartments}</span>
                </div>
                <Progress
                  value={(stats.occupiedApartments / stats.totalApartments) * 100}
                  className="h-2 bg-red-100"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Maintenance</span>
                  <span className="font-medium">{stats.maintenanceApartments}</span>
                </div>
                <Progress
                  value={(stats.maintenanceApartments / stats.totalApartments) * 100}
                  className="h-2 bg-yellow-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Note moyenne</p>
                    <p className="text-sm text-gray-500">Basée sur 24 avis</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">4.8</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Réservations</p>
                    <p className="text-sm text-gray-500">Cette semaine</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">8</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Revenus</p>
                    <p className="text-sm text-gray-500">Cette semaine</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {formatPrice(320000)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
