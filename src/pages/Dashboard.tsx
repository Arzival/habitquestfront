import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
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
  Share2
} from 'lucide-react';
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

const Dashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Datos mock para la aplicación
  const [habitStats, setHabitStats] = useState<HabitStats>({
    totalHabits: 10,
    completedToday: 6,
    currentStreak: 7,
    longestStreak: 21,
    monthlyProgress: 75
  });

  // Generar datos de ejemplo para el último año (estilo GitHub)
  const generateHabitData = (): HabitData[] => {
    const data: HabitData[] = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const randomValue = Math.random();
      let completedHabits = 0;
      
      if (randomValue > 0.7) {
        completedHabits = Math.floor(Math.random() * 2) + 1;
      } else if (randomValue > 0.4) {
        completedHabits = Math.floor(Math.random() * 2) + 3;
      } else if (randomValue > 0.15) {
        completedHabits = Math.floor(Math.random() * 4) + 5;
      } else if (randomValue > 0.05) {
        completedHabits = Math.floor(Math.random() * 5) + 9;
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        completedHabits,
        totalHabits: 10
      });
    }
    
    return data;
  };

  const [habitData] = useState<HabitData[]>(generateHabitData());

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

  return (
    <div ref={containerRef} className="dashboard-layout">
      {/* Sidebar de navegación */}
      <aside className="sidebar">
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
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="social-links">
            <a href="#" className="social-link">TG</a>
            <a href="#" className="social-link">DC</a>
            <a href="#" className="social-link">TT</a>
            <a href="#" className="social-link">X</a>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Header superior */}
        <header className="top-header">
          <div className="header-left">
            <div className="search-bar">
              <input type="text" placeholder="Buscar hábitos..." />
            </div>
          </div>
          
          <div className="header-center">
            <div className="stats-summary">
              <span>Últimos 7 días:</span>
              <div className="summary-numbers">
                <span className="summary-number">6</span>
                <span className="summary-number">8</span>
                <span className="summary-number">4</span>
                <span className="summary-number">9</span>
                <span className="summary-number">7</span>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-balance">
              <span className="balance-amount">215.00</span>
              <span className="balance-label">Puntos</span>
            </div>
            <div className="user-avatar">
              <div className="avatar-placeholder">U</div>
            </div>
            <div className="notification-icons">
              <div className="notification-dot"></div>
              <div className="notification-dot"></div>
              <div className="notification-dot"></div>
            </div>
          </div>
        </header>

        {/* Botón Agregar */}
        <div className="add-button-container">
          <button className="add-button">
            <Plus className="add-icon" />
            <span>Agregar</span>
          </button>
        </div>

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
                  {habitData.map((data, index) => (
                    <div
                      key={data.date}
                      className="contribution-cell"
                      style={{
                        backgroundColor: getContributionColor(data.completedHabits, data.totalHabits),
                        animationDelay: `${index * 0.01}s`
                      }}
                      title={getTooltip(data)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="contribution-footer">
              <p className="contribution-info">
                {habitData.filter(d => d.completedHabits > 0).length} de {habitData.length} días con actividad
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 