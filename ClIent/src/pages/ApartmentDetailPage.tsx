import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Star,
  Share2,
  Heart,
  Bed,
  Bath,
  Users,
  Wifi,
  Car,
  Tv,
  Utensils,
  Wind,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
import { formatPrice, formatDate, calculateDuration } from '@/utils/helpers';
import { APARTMENT_STATUSES, APARTMENT_CATEGORIES } from '@/utils/constants';

export const ApartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchApartment(id);
    }
  }, [id]);

  const fetchApartment = async (apartmentId: string) => {
    try {
      const data = await apartmentService.getById(apartmentId);
      setApartment(data as Apartment);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'appartement:', error);
      // Données de démonstration
      setApartment(getMockApartment(apartmentId));
    } finally {
      setIsLoading(false);
    }
  };

  const getMockApartment = (apartmentId: string): Apartment => ({
    id: apartmentId,
    creator: 'user1',
    title: 'Appartement Luxueux à Yaoundé',
    description: 'Découvrez cet appartement moderne et élégant situé au cœur de Yaoundé. Parfaitement équipé pour offrir un séjour confortable, il dispose de tout le nécessaire pour vous faire sentir comme chez vous.\n\nL\'appartement comprend une chambre spacieuse avec un lit king-size, un salon lumineux avec canapé convertible, une cuisine entièrement équipée et une salle de bain moderne.\n\nProfitez de la vue panoramique sur la ville depuis le balcon privé. Idéal pour les voyageurs d\'affaires ou les touristes souhaitant découvrir la capitale camerounaise.',
    latitude: 3.848,
    longitude: 11.502,
    category: 'appartement',
    main_photo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
    status: 'disponible',
    city: 'Yaoundé',
    country: 'Cameroun',
    price_per_hour: '15000.00',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    unavailabilities: [
      {
        start_datetime: '2026-02-20T10:00:00Z',
        end_datetime: '2026-02-20T18:00:00Z',
      },
      {
        start_datetime: '2026-02-22T14:00:00Z',
        end_datetime: '2026-02-22T16:00:00Z',
      },
    ],
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-02-18T14:30:00Z',
  });

  const handleDelete = async () => {
    if (!apartment) return;

    try {
      await apartmentService.delete(apartment.id);
      navigate('/apartments');
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

  const allImages = apartment ? [apartment.main_photo, ...apartment.gallery] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Appartement non trouvé</h2>
        <p className="text-gray-500 mt-2">L'appartement que vous recherchez n'existe pas.</p>
        <Button onClick={() => navigate('/apartments')} className="mt-4">
          Retour aux appartements
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/apartments')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{apartment.title}</h1>
            <p className="text-gray-500 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {apartment.city}, {apartment.country}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate(`/apartments/${apartment.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="aspect-video rounded-xl overflow-hidden">
          <img
            src={allImages[selectedImage]}
            alt={apartment.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {allImages.slice(1, 5).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index + 1)}
              className="aspect-video rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img
                src={image}
                alt={`${apartment.title} - ${index + 2}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="availability">Disponibilités</TabsTrigger>
              <TabsTrigger value="reviews">Avis</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Vue d'ensemble</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    {getStatusBadge(apartment.status)}
                    <Badge variant="outline">{getCategoryLabel(apartment.category)}</Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">4.8</span>
                      <span className="text-gray-500">(24 avis)</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                        <Bed className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium">2</p>
                        <p className="text-sm text-gray-500">Chambres</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bath className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">1</p>
                        <p className="text-sm text-gray-500">Salle de bain</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">4</p>
                        <p className="text-sm text-gray-500">Voyageurs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">24h</p>
                        <p className="text-sm text-gray-500">Min. séjour</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 whitespace-pre-line">{apartment.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Équipements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { icon: Wifi, label: 'Wi-Fi gratuit' },
                      { icon: Tv, label: 'Télévision' },
                      { icon: Utensils, label: 'Cuisine équipée' },
                      { icon: Car, label: 'Parking gratuit' },
                      { icon: Wind, label: 'Climatisation' },
                      { icon: Check, label: 'Machine à laver' },
                    ].map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <amenity.icon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle>Périodes d'indisponibilité</CardTitle>
                </CardHeader>
                <CardContent>
                  {apartment.unavailabilities.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Aucune période d'indisponibilité définie.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {apartment.unavailabilities.map((period, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">
                                {formatDate(period.start_datetime)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Durée: {calculateDuration(period.start_datetime, period.end_datetime)} heures
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">Indisponible</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Avis des clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: 'Marie K.',
                        date: '2026-02-15',
                        rating: 5,
                        comment: 'Excellent séjour ! L\'appartement est très propre et bien situé.',
                      },
                      {
                        name: 'Jean P.',
                        date: '2026-02-10',
                        rating: 4,
                        comment: 'Très bon rapport qualité-prix. Je recommande.',
                      },
                      {
                        name: 'Sophie M.',
                        date: '2026-02-05',
                        rating: 5,
                        comment: 'Parfait pour un séjour d\'affaires. Tout était impeccable.',
                      },
                    ].map((review, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                              <span className="text-rose-600 font-medium text-sm">
                                {review.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium">{review.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Pricing Card */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(apartment.price_per_hour)}
                </p>
                <p className="text-gray-500">par heure</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Catégorie</span>
                  <span className="font-medium">{getCategoryLabel(apartment.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  {getStatusBadge(apartment.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Créé le</span>
                  <span className="font-medium">{formatDate(apartment.created_at || '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mis à jour</span>
                  <span className="font-medium">{formatDate(apartment.updated_at || '')}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full bg-rose-600 hover:bg-rose-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  Voir le calendrier
                </Button>
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier les tarifs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{apartment.title}" ? Cette action est
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
