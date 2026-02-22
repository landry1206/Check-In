// Configuration API
// Use relative path for development (proxied by Vite) and full URL for production
export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'http://localhost:8000/api'
  : '/api';

// Routes de l'API
export const API_ROUTES = {
  // Auth
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  
  // Appartements
  APARTMENTS: '/Appartements/',
  APARTMENT_CREATE: '/Appartements/create/',
  APARTMENT_DETAIL: (id: string) => `/Appartements/${id}/`,
};

// Configuration locale
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_DATA: 'user_data',
};

// Catégories d'appartements
export const APARTMENT_CATEGORIES = [
  { value: 'appartement', label: 'Appartement', icon: 'Building2' },
  { value: 'maison', label: 'Maison', icon: 'Home' },
  { value: 'villa', label: 'Villa', icon: 'Castle' },
  { value: 'studio', label: 'Studio', icon: 'Bed' },
  { value: 'loft', label: 'Loft', icon: 'Warehouse' },
  { value: 'chalet', label: 'Chalet', icon: 'Mountain' },
  { value: 'bungalow', label: 'Bungalow', icon: 'House' },
];

// Statuts d'appartements
export const APARTMENT_STATUSES = [
  { value: 'disponible', label: 'Disponible', color: 'bg-green-500', textColor: 'text-green-700' },
  { value: 'occupe', label: 'Occupé', color: 'bg-red-500', textColor: 'text-red-700' },
  { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  { value: 'inactif', label: 'Inactif', color: 'bg-gray-500', textColor: 'text-gray-700' },
];

// Pays africains populaires
export const AFRICAN_COUNTRIES = [
  'Cameroun',
  'Côte d\'Ivoire',
  'Sénégal',
  'Ghana',
  'Nigeria',
  'Kenya',
  'Tanzanie',
  'Maroc',
  'Tunisie',
  'Égypte',
  'Afrique du Sud',
  'Gabon',
  'RDC',
  'Rwanda',
  'Éthiopie',
];

// Villes du Cameroun
export const CAMEROON_CITIES = [
  'Yaoundé',
  'Douala',
  'Bafoussam',
  'Bamenda',
  'Garoua',
  'Maroua',
  'Ngaoundéré',
  'Limbe',
  'Kribi',
  'Buea',
  'Ebolowa',
  'Bertoua',
];
