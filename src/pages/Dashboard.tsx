import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Lenis from '@studio-freight/lenis';
import { Calendar, Trophy, Target, TrendingUp, CheckCircle, XCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import '../styles/Dashboard.css';

// Tipos para los datos de hábitos
interface HabitData {
  date: string;
  completedHabits: number; // Número de hábitos completados ese día
  totalHabits: number; // Total de hábitos disponibles
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
      
      // Generar datos más realistas para GitHub-style
      const randomValue = Math.random();
      let completedHabits = 0;
      
      if (randomValue > 0.7) {
        // 30% de probabilidad de completar 1-2 hábitos
        completedHabits = Math.floor(Math.random() * 2) + 1;
      } else if (randomValue > 0.4) {
        // 30% de probabilidad de completar 3-4 hábitos
        completedHabits = Math.floor(Math.random() * 2) + 3;
      } else if (randomValue > 0.15) {
        // 25% de probabilidad de completar 5-8 hábitos
        completedHabits = Math.floor(Math.random() * 4) + 5;
      } else if (randomValue > 0.05) {
        // 10% de probabilidad de completar 9+ hábitos
        completedHabits = Math.floor(Math.random() * 5) + 9;
      }
      // 15% de probabilidad de no completar nada (completedHabits = 0)
      
      data.push({
        date: date.toISOString().split('T')[0],
        completedHabits,
        totalHabits: 10 // Aumentado para permitir más hábitos
      });
    }
    
    return data;
  };

  const [habitData] = useState<HabitData[]>(generateHabitData());

  // Scroll nativo instantáneo (Lenis deshabilitado)
  // useEffect(() => {
  //   const lenis = new Lenis({
  //     duration: 1.2,
  //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  //   });

  //   function raf(time: number) {
  //     lenis.raf(time);
  //     requestAnimationFrame(raf);
  //   }

  //   requestAnimationFrame(raf);

  //   return () => {
  //     lenis.destroy();
  //   };
  // }, []);

  // Animaciones con GSAP
  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        // Animación de entrada para las tarjetas de estadísticas
        gsap.fromTo('.stats-card', 
          { 
            opacity: 0, 
            y: 50,
            scale: 0.9
          },
          { 
            opacity: 1, 
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
          }
        );

        // Animación para el título
        gsap.fromTo('.dashboard-title', 
          { 
            opacity: 0, 
            x: -50 
          },
          { 
            opacity: 1, 
            x: 0,
            duration: 1,
            ease: 'power3.out'
          }
        );

        // Animación para el grid de contribuciones
        gsap.fromTo('.contribution-grid', 
          { 
            opacity: 0,
            scale: 0.95
          },
          { 
            opacity: 1,
            scale: 1,
            duration: 1.2,
            delay: 0.3,
            ease: 'power3.out'
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  // Función para obtener el color basado en la cantidad de hábitos completados (estilo GitHub)
  const getContributionColor = (completedHabits: number, totalHabits: number): string => {
    if (completedHabits === 0) return '#161b22'; // Sin actividad (gris oscuro como GitHub)
    
    if (completedHabits >= 4) return '#39d353'; // 4+ hábitos (verde intenso)
    if (completedHabits === 3) return '#26a641'; // 3 hábitos (verde medio)
    if (completedHabits === 2) return '#0e7a3a'; // 2 hábitos (verde claro)
    return '#216e39'; // 1 hábito (verde muy claro)
  };

  // Función para obtener el tooltip
  const getTooltip = (data: HabitData): string => {
    if (data.completedHabits === 0) {
      return `${data.date} - No completaste ningún hábito`;
    }
    return `${data.date} - Completaste ${data.completedHabits} hábitos`;
  };

  return (
    <div ref={containerRef} className="dashboard-container">
      {/* Header con título y navegación */}
      <header className="dashboard-header glass">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1 className="dashboard-title">
                <Trophy className="title-icon" />
                HabitQuest
              </h1>
              <p className="dashboard-subtitle">
                Tu progreso en el viaje de los hábitos
              </p>
            </div>
            <div className="header-right">
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span>Sistema Activo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
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

          {/* Grid de contribuciones estilo GitHub */}
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
              {/* Etiquetas de días de la semana */}
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
                {/* Etiquetas de meses */}
                <div className="months-labels">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                    <span key={month} style={{ gridColumn: `${index * 4 + 1} / span 4` }}>
                      {month}
                    </span>
                  ))}
                </div>

                {/* Grid de contribuciones */}
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