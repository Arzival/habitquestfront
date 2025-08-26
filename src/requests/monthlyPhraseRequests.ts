import axios from 'axios';
import { API_BASE_URL, DEFAULT_HEADERS } from '../config/apiConfig';
import { getAuthToken } from './authRequests';

// Interfaz para la respuesta de la API
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// Interfaz para los datos de la frase mensual
interface MonthlyPhrase {
  id: string;
  phrase: string;
  habitcard_id: string;
  created_at: string;
  updated_at: string;
}

// Función para crear una nueva frase mensual
export const createMonthlyPhrase = async (habitcardId: string | number, phrase: string): Promise<ApiResponse<MonthlyPhrase>> => {
  console.log('Debug - createMonthlyPhrase recibió:', { habitcardId, phrase });
  console.log('Debug - habitcardId type:', typeof habitcardId);
  console.log('Debug - habitcardId value:', habitcardId);
  
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Convertir el ID a número
    let habitcardIdNumber: number;
    
    if (typeof habitcardId === 'number') {
      // Si ya es un número, usarlo directamente
      habitcardIdNumber = habitcardId;
      console.log('Debug - ID ya es número:', habitcardIdNumber);
    } else if (habitcardId.includes('-')) {
      // Si el ID tiene formato "Mes-timestamp", extraer solo la parte numérica
      const numericPart = habitcardId.split('-')[1];
      habitcardIdNumber = parseInt(numericPart);
      console.log('Debug - ID extraído del formato Mes-timestamp:', { original: habitcardId, numericPart, parsed: habitcardIdNumber });
    } else {
      // Si es un string, parsearlo directamente
      habitcardIdNumber = parseInt(habitcardId);
      console.log('Debug - ID parseado desde string:', habitcardIdNumber);
    }
    
    if (isNaN(habitcardIdNumber)) {
      throw new Error(`ID de habitcard inválido: ${habitcardId}`);
    }
    
    const requestData = {
      habitcard_id: habitcardIdNumber,
      phrase: phrase
    };
    
    console.log('Debug - requestData que se envía:', requestData);
    console.log('Debug - habitcard_id después de procesar:', requestData.habitcard_id);
    console.log('Debug - habitcard_id type final:', typeof requestData.habitcard_id);
    console.log('Debug - URL de la petición:', `${API_BASE_URL}/monthly-phrases`);
    console.log('Debug - Token disponible:', !!token);

    const response = await axios.post(
      `${API_BASE_URL}/monthly-phrases`,
      requestData,
      {
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': token
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    // Si axios devuelve un error con respuesta del servidor
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    
    // Si es un error de red o conexión
    throw new Error('Error de conexión. Verifica tu conexión a internet.');
  }
};

// Función para obtener la frase mensual de una habitcard
export const getMonthlyPhrase = async (habitcardId: string | number): Promise<ApiResponse<MonthlyPhrase>> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Convertir el ID a número
    let habitcardIdNumber: number;
    
    if (typeof habitcardId === 'number') {
      // Si ya es un número, usarlo directamente
      habitcardIdNumber = habitcardId;
    } else if (habitcardId.includes('-')) {
      // Si el ID tiene formato "Mes-timestamp", extraer solo la parte numérica
      const numericPart = habitcardId.split('-')[1];
      habitcardIdNumber = parseInt(numericPart);
    } else {
      // Si es un string, parsearlo directamente
      habitcardIdNumber = parseInt(habitcardId);
    }

    const response = await axios.post(
      `${API_BASE_URL}/monthly-phrases/show`,
      {
        habitcard_id: habitcardIdNumber
      },
      {
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': token
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    // Si axios devuelve un error con respuesta del servidor
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    
    // Si es un error de red o conexión
    throw new Error('Error de conexión. Verifica tu conexión a internet.');
  }
};
