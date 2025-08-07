// Configuración global de la API
export const API_BASE_URL = 'https://api.habitquest.com';

// Configuración de endpoints
export const API_ENDPOINTS = {
  habits: '/habits',
  user: '/user',
  dashboard: '/dashboard',
  progress: '/progress',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile'
  }
};

// Configuración de headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}; 