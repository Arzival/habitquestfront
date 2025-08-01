import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS } from '../config/apiConfig';

// Tipos para las peticiones de hábitos
export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
}

export interface HabitProgress {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  notes?: string;
  streak: number;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  monthlyProgress: number;
  weeklyProgress: number;
}

// Configuración de axios con interceptores
const habitApi = axios.create({
  baseURL: `${API_BASE_URL}${API_ENDPOINTS.habits}`,
  headers: DEFAULT_HEADERS,
  timeout: 10000,
});

// Interceptor para manejar errores
habitApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en petición de hábitos:', error);
    throw error;
  }
);

// Funciones para peticiones de hábitos

/**
 * Obtiene todos los hábitos del usuario
 */
export const getHabits = async (): Promise<Habit[]> => {
  try {
    const response = await habitApi.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener hábitos:', error);
    throw new Error('No se pudieron obtener los hábitos');
  }
};

/**
 * Obtiene un hábito específico por ID
 */
export const getHabitById = async (habitId: string): Promise<Habit> => {
  try {
    const response = await habitApi.get(`/${habitId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener hábito:', error);
    throw new Error('No se pudo obtener el hábito');
  }
};

/**
 * Crea un nuevo hábito
 */
export const createHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> => {
  try {
    const response = await habitApi.post('/', habitData);
    return response.data;
  } catch (error) {
    console.error('Error al crear hábito:', error);
    throw new Error('No se pudo crear el hábito');
  }
};

/**
 * Actualiza un hábito existente
 */
export const updateHabit = async (habitId: string, habitData: Partial<Habit>): Promise<Habit> => {
  try {
    const response = await habitApi.put(`/${habitId}`, habitData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar hábito:', error);
    throw new Error('No se pudo actualizar el hábito');
  }
};

/**
 * Elimina un hábito
 */
export const deleteHabit = async (habitId: string): Promise<void> => {
  try {
    await habitApi.delete(`/${habitId}`);
  } catch (error) {
    console.error('Error al eliminar hábito:', error);
    throw new Error('No se pudo eliminar el hábito');
  }
};

/**
 * Marca un hábito como completado para una fecha específica
 */
export const completeHabit = async (habitId: string, date: string, notes?: string): Promise<HabitProgress> => {
  try {
    const response = await habitApi.post(`/${habitId}/complete`, {
      date,
      notes,
    });
    return response.data;
  } catch (error) {
    console.error('Error al completar hábito:', error);
    throw new Error('No se pudo completar el hábito');
  }
};

/**
 * Obtiene el progreso de un hábito en un rango de fechas
 */
export const getHabitProgress = async (
  habitId: string, 
  startDate: string, 
  endDate: string
): Promise<HabitProgress[]> => {
  try {
    const response = await habitApi.get(`/${habitId}/progress`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    throw new Error('No se pudo obtener el progreso del hábito');
  }
};

/**
 * Obtiene las estadísticas generales de hábitos
 */
export const getHabitStats = async (): Promise<HabitStats> => {
  try {
    const response = await habitApi.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw new Error('No se pudieron obtener las estadísticas');
  }
};

/**
 * Obtiene el progreso de todos los hábitos para el dashboard
 */
export const getDashboardData = async (period: 'daily' | 'monthly' | 'yearly' = 'daily'): Promise<{
  stats: HabitStats;
  progress: HabitProgress[];
}> => {
  try {
    const response = await habitApi.get('/dashboard', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    throw new Error('No se pudieron obtener los datos del dashboard');
  }
}; 