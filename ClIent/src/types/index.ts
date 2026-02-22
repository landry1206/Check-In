// Types pour l'authentification
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Types pour les appartements
export interface Unavailability {
  start_datetime: string;
  end_datetime: string;
}

export interface Apartment {
  id: string;
  creator: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: 'appartement' | 'maison' | 'villa' | 'studio' | 'loft' | 'chalet' | 'bungalow';
  main_photo: string;
  status: 'disponible' | 'occupe' | 'maintenance' | 'inactif';
  city: string;
  country: string;
  price_per_hour: string;
  gallery: string[];
  unavailabilities: Unavailability[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateApartmentData {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  main_photo: string;
  status: string;
  city: string;
  country: string;
  price_per_hour: string;
  gallery: string[];
  unavailabilities: Unavailability[];
}

// Types pour le dashboard
export interface DashboardStats {
  totalApartments: number;
  availableApartments: number;
  occupiedApartments: number;
  maintenanceApartments: number;
  totalRevenue: number;
  recentBookings: number;
}

// Types pour les réservations
export interface Booking {
  id: string;
  apartment_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

// Types pour les notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}
