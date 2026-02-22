import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  X,
  MapPin,
  Calendar,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { apartmentService } from '@/services/api';
import {
  APARTMENT_CATEGORIES,
  APARTMENT_STATUSES,
  AFRICAN_COUNTRIES,
  CAMEROON_CITIES,
} from '@/utils/constants';
import type { CreateApartmentData, Unavailability } from '@/types';

export const CreateApartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState<CreateApartmentData>({
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    category: 'appartement',
    main_photo: '',
    status: 'disponible',
    city: 'Yaoundé',
    country: 'Cameroun',
    price_per_hour: '',
    gallery: [],
    unavailabilities: [],
  });

  const [newUnavailability, setNewUnavailability] = useState<Unavailability>({
    start_datetime: '',
    end_datetime: '',
  });

  // if editing existing apartment, load its data
  useEffect(() => {
    if (id) {
      const load = async () => {
        try {
          const data = await apartmentService.getById(id);
          const apt = data as any;
          setFormData({
            title: apt.title || '',
            description: apt.description || '',
            latitude: apt.latitude || 0,
            longitude: apt.longitude || 0,
            category: apt.category || 'appartement',
            main_photo: apt.main_photo || '',
            status: apt.status || 'disponible',
            city: apt.city || 'Yaoundé',
            country: apt.country || 'Cameroun',
            price_per_hour: apt.price_per_hour ? String(apt.price_per_hour) : '',
            gallery: apt.gallery || [],
            unavailabilities: apt.unavailabilities || [],
          });
        } catch (err) {
          console.error('Erreur chargement appartement pour édition', err);
        }
      };
      load();
    }
  }, [id]);

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.main_photo.trim()) {
      newErrors.main_photo = 'La photo principale est requise';
    }

    if (!formData.price_per_hour || parseFloat(formData.price_per_hour) <= 0) {
      newErrors.price_per_hour = 'Le prix doit être supérieur à 0';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    if (formData.gallery.length > 3) {
      newErrors.gallery = 'Au maximum 3 images de galerie';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convertir les types de données
      const dataToSend = {
        ...formData,
        price_per_hour: parseFloat(formData.price_per_hour),
        latitude: parseFloat(formData.latitude.toString()),
        longitude: parseFloat(formData.longitude.toString()),
      };
      
      if (id) {
        await apartmentService.update(id, dataToSend);
      } else {
        await apartmentService.create(dataToSend);
      }
      navigate('/apartments');
    } catch (error) {
      console.error('Erreur lors de la création/mise à jour:', error);
      setErrors({ submit: id ? 'Erreur lors de la mise à jour de l\'appartement' : 'Erreur lors de la création de l\'appartement' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const addGalleryImage = () => {
    if (newGalleryUrl.trim() && !formData.gallery.includes(newGalleryUrl)) {
      if (formData.gallery.length >= 3) {
        setErrors((prev) => ({ ...prev, gallery: 'Maximum 3 images autorisées' }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryUrl],
      }));
      setNewGalleryUrl('');
      setErrors((prev) => ({ ...prev, gallery: '' }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const addUnavailability = () => {
    if (newUnavailability.start_datetime && newUnavailability.end_datetime) {
      setFormData((prev) => ({
        ...prev,
        unavailabilities: [...prev.unavailabilities, newUnavailability],
      }));
      setNewUnavailability({ start_datetime: '', end_datetime: '' });
    }
  };

  const removeUnavailability = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      unavailabilities: prev.unavailabilities.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/apartments')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{id ? 'Modifier l\'appartement' : 'Ajouter un appartement'}</h1>
          <p className="text-gray-500">{id ? 'Mettez à jour les informations de votre propriété' : 'Créez une nouvelle annonce pour votre propriété'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Informations</TabsTrigger>
            <TabsTrigger value="location">Localisation</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="availability">Disponibilités</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'annonce *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Appartement moderne au centre-ville"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre appartement en détail..."
                    rows={5}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APARTMENT_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APARTMENT_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_per_hour">Prix par heure (FCFA) *</Label>
                  <Input
                    id="price_per_hour"
                    name="price_per_hour"
                    type="number"
                    value={formData.price_per_hour}
                    onChange={handleChange}
                    placeholder="15000"
                    className={errors.price_per_hour ? 'border-red-500' : ''}
                  />
                  {errors.price_per_hour && (
                    <p className="text-sm text-red-600">{errors.price_per_hour}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="button" onClick={() => setActiveTab('location')}>
                Suivant
              </Button>
            </div>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Localisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, country: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AFRICAN_COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, city: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CAMEROON_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="3.848"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="11.502"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Les coordonnées GPS permettent aux clients de localiser facilement votre
                    propriété.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab('basic')}>
                Précédent
              </Button>
              <Button type="button" onClick={() => setActiveTab('photos')}>
                Suivant
              </Button>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="main_photo">Photo principale *</Label>
                  <Input
                    id="main_photo"
                    name="main_photo"
                    value={formData.main_photo}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className={errors.main_photo ? 'border-red-500' : ''}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const form = new FormData();
                          form.append('file', file);
                          const res = await apartmentService.uploadImage(form);
                          setFormData(prev => ({ ...prev, main_photo: res.url }));
                        } catch (err) {
                          console.error('Upload image principale échoué', err);
                        }
                      }
                    }}
                    className="mt-2"
                  />
                  {errors.main_photo && (
                    <p className="text-sm text-red-600">{errors.main_photo}</p>
                  )}
                  {formData.main_photo && (
                    <div className="mt-4">
                      <img
                        src={formData.main_photo}
                        alt="Aperçu"
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Galerie d'images</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Input
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="URL de l'image"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addGalleryImage} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (formData.gallery.length >= 3) {
                            setErrors((prev) => ({ ...prev, gallery: 'Maximum 3 images autorisées' }));
                            return;
                          }
                          try {
                            const form = new FormData();
                            form.append('file', file);
                            const res = await apartmentService.uploadImage(form);
                            setFormData((prev) => ({
                              ...prev,
                              gallery: [...prev.gallery, res.url],
                            }));
                            setErrors((prev) => ({ ...prev, gallery: '' }));
                          } catch (err) {
                            console.error('Upload image de galerie échoué', err);
                          }
                        }
                      }}
                      className="mt-2"
                    />
                  </div>

                  {formData.gallery.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      {formData.gallery.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab('location')}>
                Précédent
              </Button>
              <Button type="button" onClick={() => setActiveTab('availability')}>
                Suivant
              </Button>
            </div>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Périodes d'indisponibilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de début</Label>
                    <Input
                      type="datetime-local"
                      value={newUnavailability.start_datetime}
                      onChange={(e) =>
                        setNewUnavailability((prev) => ({
                          ...prev,
                          start_datetime: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date de fin</Label>
                    <Input
                      type="datetime-local"
                      value={newUnavailability.end_datetime}
                      onChange={(e) =>
                        setNewUnavailability((prev) => ({
                          ...prev,
                          end_datetime: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addUnavailability}
                  variant="outline"
                  className="w-full"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Ajouter une période
                </Button>

                {formData.unavailabilities.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {formData.unavailabilities.map((period, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(period.start_datetime).toLocaleString('fr-FR')} -{' '}
                            {new Date(period.end_datetime).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeUnavailability(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {errors.submit && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                {errors.submit}
              </div>
            )}

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab('photos')}>
                Précédent
              </Button>
              <Button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {id ? 'Mettre à jour l\'appartement' : 'Créer l\'appartement'}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};
