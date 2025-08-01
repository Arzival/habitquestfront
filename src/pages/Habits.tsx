import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ArrowLeft,
  Edit3
} from 'lucide-react';
import '../styles/Habits.css';

interface MonthData {
  month: string;
  year: number;
  id: string;
}

interface HabitData {
  date: string;
  completedHabits: number;
  totalHabits: number;
}

const Habits: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Estado para los datos del mes seleccionado
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  
  // Estado para la frase del mes
  const [monthPhrase, setMonthPhrase] = useState<string>('');
  const [isEditingPhrase, setIsEditingPhrase] = useState<boolean>(false);

  // Generar datos de ejemplo para el mes específico
  const generateMonthHabitData = (month: string, year: number): HabitData[] => {
    const data: HabitData[] = [];
    const monthIndex = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ].indexOf(month);
    
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      
      // Generar datos más realistas para el mes
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

  const [habitData] = useState<HabitData[]>(() => {
    if (monthData) {
      return generateMonthHabitData(monthData.month, monthData.year);
    }
    return [];
  });

  // Cargar datos del mes desde localStorage
  useEffect(() => {
    const savedMonth = localStorage.getItem('selectedMonth');
    if (savedMonth) {
      const parsedMonth = JSON.parse(savedMonth);
      setMonthData(parsedMonth);
    } else {
      // Si no hay datos, redirigir al dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  // Generar datos cuando cambie el mes
  useEffect(() => {
    if (monthData) {
      const newData = generateMonthHabitData(monthData.month, monthData.year);
      // Aquí podrías actualizar el estado de habitData si fuera necesario
    }
  }, [monthData]);

  // Función para navegar de vuelta al dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Función para manejar la edición de la frase
  const handlePhraseEdit = () => {
    setIsEditingPhrase(true);
  };

  // Función para guardar la frase
  const handlePhraseSave = () => {
    setIsEditingPhrase(false);
    // Aquí podrías guardar la frase en localStorage o en el backend
    localStorage.setItem(`monthPhrase_${monthData?.id}`, monthPhrase);
  };

  // Función para cancelar la edición
  const handlePhraseCancel = () => {
    setIsEditingPhrase(false);
    // Restaurar la frase original
    const savedPhrase = localStorage.getItem(`monthPhrase_${monthData?.id}`) || '';
    setMonthPhrase(savedPhrase);
  };

  // Cargar frase guardada
  useEffect(() => {
    if (monthData) {
      const savedPhrase = localStorage.getItem(`monthPhrase_${monthData.id}`) || '';
      setMonthPhrase(savedPhrase);
    }
  }, [monthData]);

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

  // Animaciones con GSAP
  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.habits-header', 
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        gsap.fromTo('.phrase-section', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
        );

        gsap.fromTo('.month-contributions-section', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  if (!monthData) {
    return <div>Cargando...</div>;
  }

  return (
    <div ref={containerRef} className="habits-layout">
      {/* Header con navegación */}
      <header className="habits-header glass">
        <div className="header-content">
          <button className="back-button" onClick={handleBackToDashboard}>
            <ArrowLeft className="back-icon" />
            <span>Volver al Dashboard</span>
          </button>
          
          <div className="month-info">
            <Calendar className="month-icon" />
            <div className="month-text">
              <h1 className="month-title">{monthData.month} {monthData.year}</h1>
              <p className="month-subtitle">Progreso detallado del mes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="habits-main">
        <div className="habits-content">
          {/* Sección de frase del mes */}
          <section className="phrase-section">
            <div className="phrase-container glass-card">
              <div className="phrase-header">
                <h2 className="phrase-title">
                  <Edit3 className="phrase-icon" />
                  Frase del Mes
                </h2>
                {!isEditingPhrase && (
                  <button className="edit-phrase-btn" onClick={handlePhraseEdit}>
                    <Edit3 className="edit-icon" />
                    <span>Editar</span>
                  </button>
                )}
              </div>
              
              <div className="phrase-content">
                {isEditingPhrase ? (
                  <div className="phrase-edit">
                    <textarea
                      value={monthPhrase}
                      onChange={(e) => setMonthPhrase(e.target.value)}
                      placeholder="Escribe una frase motivacional o un objetivo para este mes..."
                      className="phrase-textarea"
                      rows={3}
                    />
                    <div className="phrase-actions">
                      <button className="phrase-btn phrase-btn-save" onClick={handlePhraseSave}>
                        Guardar
                      </button>
                      <button className="phrase-btn phrase-btn-cancel" onClick={handlePhraseCancel}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="phrase-display">
                    {monthPhrase ? (
                      <p className="phrase-text">{monthPhrase}</p>
                    ) : (
                      <p className="phrase-placeholder">
                        No hay frase definida para este mes. Haz clic en "Editar" para agregar una.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Sección de contribuciones del mes */}
          <section className="month-contributions-section">
            <div className="contributions-header">
              <h2 className="section-title">
                <Calendar className="section-icon" />
                Progreso de {monthData.month} {monthData.year}
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

            <div className="month-contribution-container">
              <div className="days-labels">
                <span>Dom</span>
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
              </div>

              <div className="month-contribution-grid">
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

            <div className="contribution-footer">
              <p className="contribution-info">
                {habitData.filter(d => d.completedHabits > 0).length} de {habitData.length} días con actividad en {monthData.month}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Habits; 