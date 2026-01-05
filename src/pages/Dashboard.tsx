import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Trophy, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Home,
  Plus,
  Settings,
  Users,
  BarChart3,
  Award,
  MessageCircle,
  Share2,
  X,
  AlertTriangle,
  LogOut,
  Menu
} from 'lucide-react';
import MonthCard from '../components/MonthCard';
import { logoutUser } from '../requests/authRequests';
import { registerHabitCard, getUserHabitCards } from '../requests/habitCardRequests';
import type { HabitCard as HabitCardType } from '../requests/habitCardRequests';
import { getDailyProgress } from '../requests/activityRequests';
import '../styles/Dashboard.css';

// Tipos para los datos de hábitos
interface HabitData {
  date: string;
  completedHabits: number;
  totalHabits: number;
}

interface HabitStats {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  monthlyProgress: number;
}

interface MonthCard {
  id: string;
  month: string;
  year: number;
  createdAt: string;
}

interface DeleteModal {
  isOpen: boolean;
  cardToDelete: MonthCard | null;
}

const Dashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Datos mock para la aplicación
  const [habitStats, setHabitStats] = useState<HabitStats>({
    totalHabits: 10,
    completedToday: 6,
    currentStreak: 7,
    longestStreak: 21,
    monthlyProgress: 75
  });

  // Estado para las cards de meses
  const [monthCards, setMonthCards] = useState<MonthCard[]>([]);

  // Estado para los datos de progreso de hábitos
  const [habitData, setHabitData] = useState<HabitData[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);

  // Estado para el modal de confirmación
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({
    isOpen: false,
    cardToDelete: null
  });

  // Estado para manejar la carga y errores
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Estado para controlar el sidebar en móviles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Función para cargar el progreso diario desde la API
  const loadDailyProgress = async () => {
    try {
      setIsLoadingProgress(true);
      const response = await getDailyProgress();
      
      if (response.success && response.data) {
        // Mapear los datos de la API al formato que usa el componente
        const mappedData: HabitData[] = response.data.map(item => ({
          date: item.date,
          completedHabits: item.completedHabits,
          totalHabits: item.totalHabits
        }));
        
        setHabitData(mappedData);
      } else {
        // Si hay error, inicializar con datos vacíos
        const today = new Date();
        const emptyData: HabitData[] = [];
        for (let i = 364; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          emptyData.push({
            date: date.toISOString().split('T')[0],
            completedHabits: 0,
            totalHabits: 1
          });
        }
        setHabitData(emptyData);
      }
    } catch (error) {
      console.error('Error al cargar el progreso diario:', error);
      // En caso de error, inicializar con datos vacíos
      const today = new Date();
      const emptyData: HabitData[] = [];
      for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        emptyData.push({
          date: date.toISOString().split('T')[0],
          completedHabits: 0,
          totalHabits: 1
        });
      }
      setHabitData(emptyData);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  // Función para cargar las habit cards existentes del usuario
  const loadUserHabitCards = async () => {
    try {
      setIsInitialLoading(true);
      setError(null);
      
      const response = await getUserHabitCards();
      
      if (response.success && response.data) {
        setMonthCards(response.data);
      } else {
        console.error('Error al cargar las habit cards:', response.message);
        setError(response.message || 'Error al cargar las tarjetas de hábito');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado al cargar las tarjetas';
      console.error('Error al cargar habit cards:', error);
      setError(errorMessage);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Función para agregar nueva card de mes
  const handleAddMonthCard = async () => {
    // Limpiar error anterior si existe
    if (error) {
      setError(null);
    }
    
    try {
      setIsLoading(true);
      
      const now = new Date();
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      
      const cardData = {
        month: monthNames[now.getMonth()],
        year: now.getFullYear()
      };

      // Llamar a la API para registrar la nueva card
      const response = await registerHabitCard(cardData);
      
      if (response.success && response.data) {
        // Actualizar el estado con todas las cards del usuario
        setMonthCards(response.data);
        
        // Limpiar error si existe
        if (error) {
          setError(null);
        }
        
        // Animación para la nueva card (la última agregada)
        setTimeout(() => {
          const lastCard = response.data![response.data!.length - 1];
          const newCardElement = document.getElementById(lastCard.id);
          if (newCardElement) {
            gsap.fromTo(newCardElement,
              { opacity: 0, y: 50, scale: 0.8 },
              { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
            );
          }
        }, 100);
      } else {
        setError(response.message || 'Error al registrar la tarjeta de hábito');
        console.error('Error al registrar la card:', response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado al agregar mes';
      setError(errorMessage);
      console.error('Error al agregar mes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para navegar a la página de habits
  const handleCardClick = (cardData: { month: string; year: number; id: string }) => {
    // Guardar la información de la card en localStorage para la página de habits
    localStorage.setItem('selectedMonth', JSON.stringify({
      month: cardData.month,
      year: cardData.year,
      id: cardData.id
    }));
    navigate('/habits');
  };

  // Función para abrir modal de confirmación
  const handleOpenDeleteModal = (card: MonthCard) => {
    setDeleteModal({
      isOpen: true,
      cardToDelete: card
    });
  };

  // Función para cerrar modal
  const handleCloseModal = () => {
    setDeleteModal({
      isOpen: false,
      cardToDelete: null
    });
  };

  // Función para confirmar eliminación
  const handleConfirmDelete = () => {
    if (deleteModal.cardToDelete) {
      const cardElement = document.getElementById(deleteModal.cardToDelete.id);
      if (cardElement) {
        gsap.to(cardElement, {
          opacity: 0,
          y: -50,
          scale: 0.8,
          duration: 0.4,
          ease: 'back.in(1.7)',
          onComplete: () => {
            setMonthCards(prev => prev.filter(card => card.id !== deleteModal.cardToDelete!.id));
            handleCloseModal();
          }
        });
      }
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await logoutUser();
      // Redirigir al home después de cerrar sesión
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así redirigir al home si hay error
      navigate('/');
    }
  };

  // Función para eliminar card de mes (deprecada, ahora usa modal)
  const handleRemoveMonthCard = (id: string) => {
    const card = monthCards.find(c => c.id === id);
    if (card) {
      handleOpenDeleteModal(card);
    }
  };

  // Cargar habit cards existentes al montar el componente
  useEffect(() => {
    loadUserHabitCards();
    loadDailyProgress();
  }, []);

  // Recargar el progreso cuando se actualicen las habit cards (por si se agregó una nueva)
  useEffect(() => {
    if (monthCards.length > 0) {
      loadDailyProgress();
    }
  }, [monthCards.length]);

  // Animaciones con GSAP
  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.sidebar', 
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );

        gsap.fromTo('.main-content', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
        );

        gsap.fromTo('.stats-card', 
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.4, ease: 'power3.out' }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  // Animación del modal
  useEffect(() => {
    if (deleteModal.isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [deleteModal.isOpen]);

  // Función para obtener el color basado en la cantidad de hábitos completados
  const getContributionColor = (completedHabits: number, totalHabits: number): string => {
    if (completedHabits === 0) return '#161b22';
    
    if (completedHabits >= 4) return '#39d353';
    if (completedHabits === 3) return '#26a641';
    if (completedHabits === 2) return '#0e7a3a';
    return '#216e39';
  };

  // Función para obtener el tooltip
  const getTooltip = (data: HabitData): string => {
    if (data.completedHabits === 0) {
      return `${data.date} - No completaste ningún hábito`;
    }
    return `${data.date} - Completaste ${data.completedHabits} hábitos`;
  };

  // Función para toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Cerrar sidebar al hacer clic fuera (solo en móviles)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobile && isSidebarOpen && !target.closest('.sidebar') && !target.closest('.menu-toggle-btn')) {
        setIsSidebarOpen(false);
      }
    };

    if (isMobile && isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile, isSidebarOpen]);

  return (
    <div ref={containerRef} className="dashboard-layout">
      {/* Overlay para móviles */}
      {isSidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar de navegación */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Trophy className="logo-icon" />
            <span className="logo-text">HabitQuest</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item active">
              <a href="#" className="nav-link">
                <Home className="nav-icon" />
                <span>Dashboard</span>
              </a>
            </li>
            {/* Sección comentada temporalmente - Progreso, Logros, Comunidad, Soporte, Compartir */}
            {/* 
            <li className="nav-item">
              <a href="#" className="nav-link">
                <BarChart3 className="nav-icon" />
                <span>Progreso</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <Award className="nav-icon" />
                <span>Logros</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <Users className="nav-icon" />
                <span>Comunidad</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <MessageCircle className="nav-icon" />
                <span>Soporte</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <Share2 className="nav-icon" />
                <span>Compartir</span>
              </a>
            </li>
            */}
          </ul>
        </nav>

        <div className="sidebar-footer">
          {/* Sección comentada temporalmente - Botones sociales TG, DC, TT, X */}
          {/* 
          <div className="social-links">
            <a href="#" className="social-link">TG</a>
            <a href="#" className="social-link">DC</a>
            <a href="#" className="social-link">TT</a>
            <a href="#" className="social-link">X</a>
          </div>
          */}
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Header superior */}
        <header className="top-header">
          {/* Header con título centrado y acciones a la derecha */}
          <div className="header-content">
            <button className="menu-toggle-btn" onClick={toggleSidebar} aria-label="Toggle menu">
              <Menu className="menu-icon" />
            </button>
            <div className="header-title">
              <h1>Dashboard</h1>
            </div>
            <div className="header-actions">
              <button className="header-action-btn" onClick={handleLogout}>
                <LogOut className="header-action-icon" />
                <span className="tooltip-text">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </header>

        {/* Contenido del dashboard */}
        <div className="dashboard-content">
          {/* Tarjetas de estadísticas */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stats-card glass-card">
                <div className="stats-icon">
                  <CheckCircle className="icon-success" />
                </div>
                <div className="stats-content">
                  <h3 className="stats-number">{habitStats.completedToday}</h3>
                  <p className="stats-label">Completados hoy</p>
                </div>
              </div>

              <div className="stats-card glass-card">
                <div className="stats-icon">
                  <Trophy className="icon-warning" />
                </div>
                <div className="stats-content">
                  <h3 className="stats-number">{habitStats.currentStreak}</h3>
                  <p className="stats-label">Racha actual</p>
                </div>
              </div>

              <div className="stats-card glass-card">
                <div className="stats-icon">
                  <Target className="icon-primary" />
                </div>
                <div className="stats-content">
                  <h3 className="stats-number">{habitStats.longestStreak}</h3>
                  <p className="stats-label">Mejor racha</p>
                </div>
              </div>

              <div className="stats-card glass-card">
                <div className="stats-icon">
                  <TrendingUp className="icon-success" />
                </div>
                <div className="stats-content">
                  <h3 className="stats-number">{habitStats.monthlyProgress}%</h3>
                  <p className="stats-label">Progreso mensual</p>
                </div>
              </div>
            </div>
          </section>

          {/* Grid de contribuciones */}
          <section className="contributions-section">
            <div className="contributions-header">
              <h2 className="section-title">
                <Calendar className="section-icon" />
                Progreso de Hábitos
              </h2>
              <div className="contribution-legend">
                <span className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#161b22' }}></span>
                  <span>Sin actividad</span>
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#216e39' }}></span>
                  <span>1 hábito</span>
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#0e7a3a' }}></span>
                  <span>2 hábitos</span>
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#26a641' }}></span>
                  <span>3 hábitos</span>
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#39d353' }}></span>
                  <span>4+ hábitos</span>
                </span>
              </div>
            </div>

            <div className="contribution-container">
              <div className="days-labels">
                <span></span>
                <span>Mon</span>
                <span></span>
                <span>Wed</span>
                <span></span>
                <span>Fri</span>
                <span></span>
              </div>

              <div className="contribution-content">
                <div className="months-labels">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                    <span key={month} style={{ gridColumn: `${index * 4 + 1} / span 4` }}>
                      {month}
                    </span>
                  ))}
                </div>

                <div className="contribution-grid">
                  {isLoadingProgress ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      Cargando progreso...
                    </div>
                  ) : (
                    habitData.map((data, index) => (
                      <div
                        key={data.date}
                        className="contribution-cell"
                        style={{
                          backgroundColor: getContributionColor(data.completedHabits, data.totalHabits),
                          animationDelay: `${index * 0.01}s`
                        }}
                        title={getTooltip(data)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="contribution-footer">
              <p className="contribution-info">
                {habitData.filter(d => d.completedHabits > 0).length} de {habitData.length} días con actividad
              </p>
            </div>
          </section>

          {/* Sección de cards de meses */}
          <section className="month-cards-section">
            <div className="month-cards-header">
              <h2 className="section-title">
                <Calendar className="section-icon" />
                Meses Agregados
              </h2>
              <button 
                className="add-month-btn" 
                onClick={handleAddMonthCard}
                disabled={isLoading}
              >
                <Plus className="add-icon" />
                <span>{isLoading ? 'Agregando...' : 'Agregar Mes'}</span>
              </button>
            </div>
            
            {/* Mostrar mensaje de error si existe */}
            {error && (
              <div className="error-message">
                <AlertTriangle className="error-icon" />
                <span>{error}</span>
                <button 
                  className="retry-btn" 
                  onClick={loadUserHabitCards}
                  disabled={isInitialLoading}
                >
                  Reintentar
                </button>
              </div>
            )}
            
            {/* Estado de carga inicial */}
            {isInitialLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p className="loading-text">Cargando tarjetas de hábito...</p>
              </div>
            ) : monthCards.length > 0 ? (
              <div className="month-cards-grid">
                {monthCards.map((card) => (
                  <MonthCard
                    key={card.id}
                    id={card.id}
                    month={card.month}
                    year={card.year}
                    createdAt={card.createdAt}
                    onCardClick={handleCardClick}
                    onRemoveCard={handleRemoveMonthCard}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Calendar className="empty-icon" />
                <p className="empty-text">No hay meses agregados aún</p>
                <p className="empty-subtext">Haz clic en "Agregar Mes" para comenzar a trackear tus hábitos</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal de confirmación de eliminación */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div 
            ref={modalRef} 
            className="delete-modal glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-icon">
                <AlertTriangle className="warning-icon" />
              </div>
              <h3 className="modal-title">Confirmar Eliminación</h3>
            </div>
            
            <div className="modal-content">
              <p className="modal-message">
                ¿Estás seguro de que quieres eliminar la card de <strong>{deleteModal.cardToDelete?.month} {deleteModal.cardToDelete?.year}</strong>?
              </p>
              <p className="modal-warning">
                Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="modal-btn modal-btn-cancel" 
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button 
                className="modal-btn modal-btn-confirm" 
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 