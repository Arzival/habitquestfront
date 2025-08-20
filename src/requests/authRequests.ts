import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS } from '../config/apiConfig';

// Tipos para las peticiones de autenticación
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    accessToken: string;
    tokenType: string;
  };
  message: string;
  errors?: {
    [key: string]: string[];
  };
  error?: string;
}

export interface RegisterResponse extends AuthResponse {}
export interface LoginResponse extends AuthResponse {}

/**
 * Realiza el registro de un nuevo usuario en la API
 * @param userData - Datos del usuario para el registro
 * @returns Promise con la respuesta de la API
 */
export const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.auth.register}`,
      userData,
      {
        headers: DEFAULT_HEADERS,
      }
    );

    return response.data;
  } catch (error) {
    // Si axios devuelve un error con respuesta del servidor
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    
    // Si es un error de red o conexión
    throw new Error('Error de conexión. Verifica tu conexión a internet.');
  }
};

/**
 * Realiza el login de un usuario en la API
 * @param userData - Datos del usuario para el login
 * @returns Promise con la respuesta de la API
 */
export const loginUser = async (userData: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.auth.login}`,
      userData,
      {
        headers: DEFAULT_HEADERS,
      }
    );

    return response.data;
  } catch (error) {
    // Si axios devuelve un error con respuesta del servidor
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    
    // Si es un error de red o conexión
    throw new Error('Error de conexión. Verifica tu conexión a internet.');
  }
};

/**
 * Guarda el token de autenticación en localStorage
 * @param token - Token de acceso
 * @param tokenType - Tipo de token (Bearer)
 */
export const saveAuthToken = (token: string, tokenType: string = 'Bearer'): void => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('token_type', tokenType);
};

/**
 * Obtiene el token de autenticación desde localStorage
 * @returns Token completo con tipo o null si no existe
 */
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('auth_token');
  const tokenType = localStorage.getItem('token_type') || 'Bearer';
  
  return token ? `${tokenType} ${token}` : null;
};

/**
 * Elimina el token de autenticación del localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token_type');
};

/**
 * Guarda los datos del usuario en localStorage
 * @param user - Datos del usuario
 */
export const saveUserData = (user: User): void => {
  localStorage.setItem('user_data', JSON.stringify(user));
};

/**
 * Obtiene los datos del usuario desde localStorage
 * @returns Datos del usuario o null si no existen
 */
export const getUserData = (): User | null => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Elimina los datos del usuario del localStorage
 */
export const removeUserData = (): void => {
  localStorage.removeItem('user_data');
};
