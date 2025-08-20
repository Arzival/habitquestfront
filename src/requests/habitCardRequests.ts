import axios from 'axios';
import { API_BASE_URL, DEFAULT_HEADERS } from '../config/apiConfig';
import { getAuthToken } from './authRequests';

// Tipos para las peticiones de habit cards
export interface HabitCardRequest {
  month: string;
  year: number;
}

export interface HabitCard {
  id: string;
  month: string;
  year: number;
  createdAt: string;
  userId: string;
}

export interface HabitCardResponse {
  success: boolean;
  message: string;
  data: HabitCard[] | null;
}

export interface GetUserHabitCardsResponse {
  success: boolean;
  message: string;
  data: HabitCard[] | null;
  total: number;
}

/**
 * Registra una nueva tarjeta de hábito en la API
 * @param cardData - Datos de la tarjeta (mes y año)
 * @returns Promise con la respuesta de la API incluyendo todas las tarjetas del usuario
 */
export const registerHabitCard = async (cardData: HabitCardRequest): Promise<HabitCardResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Obtener el userid del localStorage
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      throw new Error('No se encontraron datos del usuario');
    }

    const user = JSON.parse(userData);
    const requestData = {
      ...cardData,
      userid: user.id
    };

    const response = await axios.post(
      `${API_BASE_URL}/habitcards/register`,
      requestData,
      {
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': token
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

/**
 * Obtiene todas las tarjetas de hábito de un usuario desde la API
 * @returns Promise con la respuesta de la API incluyendo todas las tarjetas del usuario
 */
export const getUserHabitCards = async (): Promise<GetUserHabitCardsResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Obtener el userid del localStorage
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      throw new Error('No se encontraron datos del usuario');
    }

    const user = JSON.parse(userData);
    const requestData = {
      userid: user.id
    };

    const response = await axios.post(
      `${API_BASE_URL}/habitcards/user`,
      requestData,
      {
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': token
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
