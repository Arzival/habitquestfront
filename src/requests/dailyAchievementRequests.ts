import axios from 'axios';
import { API_BASE_URL, DEFAULT_HEADERS } from '../config/apiConfig';
import { getAuthToken } from './authRequests';

// Tipos para las peticiones de logros diarios
export interface DailyAchievementRequest {
  habitcard_id: number;
  day: number;
  achievement_text: string;
}

export interface DailyAchievement {
  id: number;
  habitcard_id: number;
  day: number;
  achievement_text: string;
  created_at: string;
  updated_at: string;
}

export interface DailyAchievementResponse {
  success: boolean;
  message: string;
  data: DailyAchievement | null;
}

/**
 * Guarda un logro diario en la API
 * @param achievementData - Datos del logro (habitcard_id, day, achievement_text)
 * @returns Promise con la respuesta de la API
 */
export const saveDailyAchievement = async (achievementData: DailyAchievementRequest): Promise<DailyAchievementResponse> => {
  try {
    console.log('=== INICIANDO saveDailyAchievement ===');
    console.log('Datos recibidos:', achievementData);
    
    const token = getAuthToken();
    console.log('Token obtenido de getAuthToken:', token);
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('URL de la API:', `${API_BASE_URL}/daily-achievements`);
    console.log('Headers a enviar:', {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${token}`
    });

    console.log('Haciendo petición POST...');
    const response = await axios.post(
      `${API_BASE_URL}/daily-achievements`,
      achievementData,
      {
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`
        },
      }
    );

    console.log('Respuesta recibida:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== ERROR EN saveDailyAchievement ===');
    console.error('Error completo:', error);
    console.error('Tipo de error:', typeof error);
    
    // Si axios devuelve un error con respuesta del servidor
    if (axios.isAxiosError(error) && error.response) {
      console.error('Es un error de Axios con respuesta');
      return error.response.data;
    }
    
    // Si es un error de red o conexión
    console.error('No es un error de Axios, lanzando error genérico');
    throw new Error('Error de conexión. Verifica tu conexión a internet.');
  }
};
