import axios from 'axios';
import { API_BASE_URL, DEFAULT_HEADERS } from '../config/apiConfig';
import { getAuthToken } from './authRequests';

// Tipos para las peticiones de actividades
export interface ActivityRequest {
  habitcard_id: number;
  activity: string;
  color: string;
}

export interface Activity {
  id: number;
  habitcard_id: number;
  activity: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityResponse {
  success: boolean;
  message: string;
  data: Activity | null;
}

export interface GetActivitiesResponse {
  success: boolean;
  message: string;
  data: Activity[] | null;
}

export interface DeleteActivityRequest {
  activity_id: number;
}

export interface DeleteActivityResponse {
  success: boolean;
  message: string;
  data: null;
}

/**
 * Guarda una nueva actividad para una habitcard en la API
 * @param activityData - Datos de la actividad (habitcard_id, activity, color)
 * @returns Promise con la respuesta de la API
 */
export const saveActivity = async (activityData: ActivityRequest): Promise<ActivityResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await axios.post(
      `${API_BASE_URL}/activities`,
      activityData,
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
 * Obtiene todas las actividades de una habitcard específica desde la API
 * @param habitcardId - ID de la habitcard
 * @returns Promise con la respuesta de la API incluyendo todas las actividades
 */
export const getActivitiesByHabitCard = async (habitcardId: number): Promise<GetActivitiesResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await axios.post(
      `${API_BASE_URL}/activities/habitcard`,
      { habitcard_id: habitcardId },
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
 * Elimina una actividad específica
 * @param activityId - ID de la actividad a eliminar
 * @returns Promise con la respuesta de la API
 */
export const deleteActivity = async (activityId: number): Promise<DeleteActivityResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await axios.post(
      `${API_BASE_URL}/activities/delete`,
      { activity_id: activityId },
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

// Tipos para las completions de actividades
export interface ActivityCompletion {
  id: number;
  habitcard_id: number;
  activity_tracking_id: number;
  day: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ToggleCompletionRequest {
  habitcard_id: number;
  activity_tracking_id: number;
  day: number;
  completed: boolean;
}

export interface ToggleCompletionResponse {
  success: boolean;
  message: string;
  data: ActivityCompletion | null;
}

export interface GetCompletionsResponse {
  success: boolean;
  message: string;
  data: ActivityCompletion[] | null;
}

/**
 * Marca o desmarca una actividad como completada para un día específico
 * @param completionData - Datos de la completion (habitcard_id, activity_tracking_id, day, completed)
 * @returns Promise con la respuesta de la API
 */
export const toggleActivityCompletion = async (completionData: ToggleCompletionRequest): Promise<ToggleCompletionResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await axios.post(
      `${API_BASE_URL}/activities/toggle-completion`,
      completionData,
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
 * Obtiene todas las completions de actividades para una habitcard específica
 * @param habitcardId - ID de la habitcard
 * @returns Promise con la respuesta de la API incluyendo todas las completions
 */
export const getActivityCompletionsByHabitCard = async (habitcardId: number): Promise<GetCompletionsResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await axios.post(
      `${API_BASE_URL}/activities/completions`,
      { habitcard_id: habitcardId },
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

// Tipos para el progreso diario
export interface DailyProgressData {
  date: string;
  completedHabits: number;
  totalHabits: number;
}

export interface GetDailyProgressResponse {
  success: boolean;
  message: string;
  data: DailyProgressData[] | null;
}

/**
 * Obtiene el progreso diario de actividades completadas para el dashboard
 * @returns Promise con la respuesta de la API incluyendo el progreso de los últimos 365 días
 */
export const getDailyProgress = async (): Promise<GetDailyProgressResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await axios.post(
      `${API_BASE_URL}/activities/daily-progress`,
      {},
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

// Tipos para las estadísticas
export interface ActivityStats {
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  monthlyProgress: number;
}

export interface GetStatsResponse {
  success: boolean;
  message: string;
  data: ActivityStats | null;
}

/**
 * Obtiene las estadísticas generales del usuario para el dashboard
 * @returns Promise con la respuesta de la API incluyendo las estadísticas
 */
export const getActivityStats = async (): Promise<GetStatsResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await axios.post(
      `${API_BASE_URL}/activities/stats`,
      {},
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

