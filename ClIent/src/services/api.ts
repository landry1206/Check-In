import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants';

// Types
interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

// Classe API
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Obtenir le token
  private getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // Construire les headers
  private buildHeaders(options: RequestOptions): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (options.requiresAuth !== false) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Requête HTTP générique
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(options);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Gérer les erreurs HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `Erreur HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      // Vérifier si la réponse est vide
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Erreur réseau',
        0
      );
    }
  }

  // Méthodes HTTP
  async get<T>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    });
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    requiresAuth = true
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  async put<T>(
    endpoint: string,
    data: unknown,
    requiresAuth = true
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  async patch<T>(
    endpoint: string,
    data: unknown,
    requiresAuth = true
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  async delete<T>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      requiresAuth,
    });
  }

  // Upload de fichier
  async uploadFile<T>(
    endpoint: string,
    formData: FormData,
    requiresAuth = true
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {};

    if (requiresAuth !== false) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Erreur HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return response.json();
  }
}

// Classe d'erreur personnalisée
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Instance singleton
export const api = new ApiService();

// Services spécifiques
export const authService = {
  login: (email: string, password: string) =>
    api.post<{ access_token: string; user: unknown }>('/auth/login/', { email, password }, false),

  register: (data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => api.post<{ access_token: string; user: unknown }>('/auth/register/', data, false),

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};

export const apartmentService = {
  getAll: () => api.get<unknown>('/Appartements/'),

  getById: (id: string) => api.get<unknown>(`/Appartements/${id}/`),

  create: (data: unknown) => api.post<unknown>('/Appartements/create/', data),

  update: (id: string, data: unknown) => api.put<unknown>(`/Appartements/${id}/update/`, data),

  delete: (id: string) => api.delete<void>(`/Appartements/${id}/delete/`, true),

  uploadImage: (formData: FormData) => api.uploadFile<{url: string}>('/Appartements/upload/', formData, true),
};
