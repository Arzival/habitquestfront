import { useState, useEffect, useCallback } from 'react';
import { getDashboardData, getHabits, completeHabit, HabitStats, HabitProgress, Habit } from '../requests/habitRequests';

// Tipos para el estado del dashboard
interface DashboardState {
  stats: HabitStats | null;
  progress: HabitProgress[];
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

interface UseDashboardReturn extends DashboardState {
  refreshData: () => Promise<void>;
  completeHabitForToday: (habitId: string, notes?: string) => Promise<void>;
  changePeriod: (period: 'daily' | 'monthly' | 'yearly') => Promise<void>;
}

/**
 * Hook personalizado para manejar los datos del dashboard
 * Gestiona el estado de carga, errores y actualización de datos
 */
export const useDashboard = (): UseDashboardReturn => {
  const [state, setState] = useState<DashboardState>({
    stats: null,
    progress: [],
    habits: [],
    loading: true,
    error: null,
  });

  const [currentPeriod, setCurrentPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  // Función para cargar los datos del dashboard
  const loadDashboardData = useCallback(async (period: 'daily' | 'monthly' | 'yearly' = 'daily') => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Cargar datos en paralelo
      const [dashboardData, habitsData] = await Promise.all([
        getDashboardData(period),
        getHabits(),
      ]);

      setState({
        stats: dashboardData.stats,
        progress: dashboardData.progress,
        habits: habitsData,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido al cargar datos',
      }));
    }
  }, []);

  // Función para refrescar los datos
  const refreshData = useCallback(async () => {
    await loadDashboardData(currentPeriod);
  }, [loadDashboardData, currentPeriod]);

  // Función para completar un hábito
  const completeHabitForToday = useCallback(async (habitId: string, notes?: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await completeHabit(habitId, today, notes);
      
      // Refrescar los datos después de completar el hábito
      await refreshData();
    } catch (error) {
      console.error('Error al completar hábito:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al completar el hábito',
      }));
    }
  }, [refreshData]);

  // Función para cambiar el período de visualización
  const changePeriod = useCallback(async (period: 'daily' | 'monthly' | 'yearly') => {
    setCurrentPeriod(period);
    await loadDashboardData(period);
  }, [loadDashboardData]);

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData(currentPeriod);
  }, [loadDashboardData, currentPeriod]);

  return {
    ...state,
    refreshData,
    completeHabitForToday,
    changePeriod,
  };
};

/**
 * Hook para manejar el estado de carga de componentes individuales
 */
export const useLoadingState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithLoading = useCallback(async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    executeWithLoading,
    clearError,
  };
}; 