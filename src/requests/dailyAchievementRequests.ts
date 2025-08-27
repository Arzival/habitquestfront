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
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

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
