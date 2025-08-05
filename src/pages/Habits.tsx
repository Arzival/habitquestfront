import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ArrowLeft,
  Edit3,
  Trophy,
  Plus,
  Settings,
  TrendingUp,
  Check
} from 'lucide-react';
import '../styles/Habits.css';

interface MonthData {
  month: string;
  year: number;
  id: string;
}

interface DailyAchievement {
  day: number;
  achievement: string;
}

interface Activity {
  id: string;
  name: string;
  color: string;
}

interface DailyActivity {
  day: number;
  activityId: string;
  completed: boolean;
}



const Habits: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Estado para los datos del mes seleccionado
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  
  // Estado para la frase del mes
  const [monthPhrase, setMonthPhrase] = useState<string>('');
  const [isEditingPhrase, setIsEditingPhrase] = useState<boolean>(false);

  // Estado para los logros diarios
  const [dailyAchievements, setDailyAchievements] = useState<DailyAchievement[]>([]);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [tempAchievement, setTempAchievement] = useState<string>('');
  
  // Estados para el tracking de actividades
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [isManagingActivities, setIsManagingActivities] = useState<boolean>(false);
  const [newActivityName, setNewActivityName] = useState<string>('');
  
  // Refs para el scroll automático
  const achievementsGridRef = useRef<HTMLDivElement>(null);
  const activitiesTableRef = useRef<HTMLDivElement>(null);



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

  // Cargar logros diarios guardados
  useEffect(() => {
    if (monthData) {
      const savedAchievements = localStorage.getItem(`achievements_${monthData.id}`);
      if (savedAchievements) {
        setDailyAchievements(JSON.parse(savedAchievements));
      }
    }
  }, [monthData]);

  // Cargar actividades guardadas
  useEffect(() => {
    if (monthData) {
      const savedActivities = localStorage.getItem(`activities_${monthData.id}`);
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      } else {
        // Actividades por defecto
        const defaultActivities: Activity[] = [
          { id: '1', name: 'Ejercicio', color: '#FF6B6B' },
          { id: '2', name: 'Lectura', color: '#4ECDC4' },
          { id: '3', name: 'Programar', color: '#45B7D1' },
          { id: '4', name: 'Meditar', color: '#96CEB4' }
        ];
        setActivities(defaultActivities);
        localStorage.setItem(`activities_${monthData.id}`, JSON.stringify(defaultActivities));
      }

      const savedDailyActivities = localStorage.getItem(`dailyActivities_${monthData.id}`);
      if (savedDailyActivities) {
        setDailyActivities(JSON.parse(savedDailyActivities));
      }
    }
  }, [monthData]);

  // Scroll automático al día actual cuando se carga el componente
  useEffect(() => {
    if (monthData && achievementsGridRef.current) {
      // Pequeño delay para asegurar que el DOM esté renderizado
      const timer = setTimeout(() => {
        scrollToCurrentDay();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [monthData]);

  // Función para obtener los días del mes
  const getDaysInMonth = (month: string, year: number): number => {
    const monthIndex = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ].indexOf(month);
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  // Función para obtener el día actual
  const getCurrentDay = (): number => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    if (!monthData) return -1;
    
    const monthIndex = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ].indexOf(monthData.month);
    
    // Solo retornar el día actual si estamos en el mes y año correcto
    if (monthIndex === currentMonth && monthData.year === currentYear) {
      return today.getDate();
    }
    
    return -1; // No es el mes actual
  };

  // Función para hacer scroll al día actual
  const scrollToCurrentDay = () => {
    const currentDay = getCurrentDay();
    if (currentDay === -1 || !achievementsGridRef.current) return;

    // Calcular la posición del elemento del día actual
    const dayElement = achievementsGridRef.current.querySelector(`[data-day="${currentDay}"]`) as HTMLElement;
    if (dayElement) {
      dayElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Función para obtener el logro de un día específico
  const getAchievementForDay = (day: number): string => {
    const achievement = dailyAchievements.find(a => a.day === day);
    return achievement ? achievement.achievement : '';
  };

  // Función para iniciar la edición de un día
  const handleEditDay = (day: number) => {
    setEditingDay(day);
    setTempAchievement(getAchievementForDay(day));
  };

  // Función para guardar el logro de un día
  const handleSaveAchievement = () => {
    if (editingDay === null) return;

    const updatedAchievements = dailyAchievements.filter(a => a.day !== editingDay);
    
    if (tempAchievement.trim()) {
      updatedAchievements.push({
        day: editingDay,
        achievement: tempAchievement.trim()
      });
    }

    updatedAchievements.sort((a, b) => a.day - b.day);
    setDailyAchievements(updatedAchievements);
    
    // Guardar en localStorage
    if (monthData) {
      localStorage.setItem(`achievements_${monthData.id}`, JSON.stringify(updatedAchievements));
    }

    setEditingDay(null);
    setTempAchievement('');
  };

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    setEditingDay(null);
    setTempAchievement('');
  };

  // Funciones para manejar actividades
  const generateActivityColors = (): string[] => [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'
  ];

  const addActivity = () => {
    if (newActivityName.trim() && activities.length < 8) {
      const colors = generateActivityColors();
      const newActivity: Activity = {
        id: Date.now().toString(),
        name: newActivityName.trim(),
        color: colors[activities.length]
      };
      
      const updatedActivities = [...activities, newActivity];
      setActivities(updatedActivities);
      setNewActivityName('');
      
      if (monthData) {
        localStorage.setItem(`activities_${monthData.id}`, JSON.stringify(updatedActivities));
      }
    }
  };

  const removeActivity = (activityId: string) => {
    const updatedActivities = activities.filter(a => a.id !== activityId);
    setActivities(updatedActivities);
    
    // Remover también las actividades diarias relacionadas
    const updatedDailyActivities = dailyActivities.filter(da => da.activityId !== activityId);
    setDailyActivities(updatedDailyActivities);
    
    if (monthData) {
      localStorage.setItem(`activities_${monthData.id}`, JSON.stringify(updatedActivities));
      localStorage.setItem(`dailyActivities_${monthData.id}`, JSON.stringify(updatedDailyActivities));
    }
  };

  const toggleActivity = (day: number, activityId: string) => {
    const existingIndex = dailyActivities.findIndex(
      da => da.day === day && da.activityId === activityId
    );
    
    let updatedDailyActivities;
    if (existingIndex >= 0) {
      // Toggle existing activity
      updatedDailyActivities = [...dailyActivities];
      updatedDailyActivities[existingIndex].completed = !updatedDailyActivities[existingIndex].completed;
    } else {
      // Add new activity
      updatedDailyActivities = [...dailyActivities, {
        day,
        activityId,
        completed: true
      }];
    }
    
    setDailyActivities(updatedDailyActivities);
    
    if (monthData) {
      localStorage.setItem(`dailyActivities_${monthData.id}`, JSON.stringify(updatedDailyActivities));
    }
  };

  const isActivityCompleted = (day: number, activityId: string): boolean => {
    const activity = dailyActivities.find(da => da.day === day && da.activityId === activityId);
    return activity ? activity.completed : false;
  };

  const getCompletionPercentage = (day: number): number => {
    if (activities.length === 0) return 0;
    const completedCount = activities.filter(activity => 
      isActivityCompleted(day, activity.id)
    ).length;
    return Math.round((completedCount / activities.length) * 100);
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

        gsap.fromTo('.achievements-section', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' }
        );

        gsap.fromTo('.activity-tracker-section', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' }
        );

        gsap.fromTo('.progress-chart-section', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' }
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

          {/* Sección de logros diarios */}
          <section className="achievements-section">
            <div className="achievements-container glass-card">
              <div className="achievements-header">
                <h2 className="achievements-title">
                  <Trophy className="achievements-icon" />
                  Logros Diarios de {monthData.month}
                </h2>
                <p className="achievements-subtitle">
                  Registra un logro importante por cada día del mes
                </p>
              </div>
              
              <div className="achievements-grid" ref={achievementsGridRef}>
                {Array.from({ length: getDaysInMonth(monthData.month, monthData.year) }, (_, index) => {
                  const day = index + 1;
                  const achievement = getAchievementForDay(day);
                  const isEditing = editingDay === day;
                  const currentDay = getCurrentDay();
                  const isCurrentDay = day === currentDay;
                  
                  return (
                    <div 
                      key={day} 
                      className={`achievement-item ${achievement ? 'has-achievement' : ''} ${isCurrentDay ? 'current-day' : ''}`}
                      data-day={day}
                    >
                      <div className="achievement-day">
                        <span className="day-number">{day}</span>
                      </div>
                      
                      <div className="achievement-content">
                        {isEditing ? (
                          <div className="achievement-edit">
                            <input
                              type="text"
                              value={tempAchievement}
                              onChange={(e) => setTempAchievement(e.target.value)}
                              placeholder={`Logro del día ${day}...`}
                              className="achievement-input"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveAchievement();
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                            />
                            <div className="achievement-actions">
                              <button 
                                className="achievement-btn save-btn" 
                                onClick={handleSaveAchievement}
                                title="Guardar"
                              >
                                ✓
                              </button>
                              <button 
                                className="achievement-btn cancel-btn" 
                                onClick={handleCancelEdit}
                                title="Cancelar"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="achievement-display" onClick={() => handleEditDay(day)}>
                            {achievement ? (
                              <p className="achievement-text">{achievement}</p>
                            ) : (
                              <div className="achievement-placeholder">
                                <Plus className="plus-icon" />
                                <span>Agregar logro</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Sección de tracking de actividades */}
          <section className="activity-tracker-section">
            <div className="activity-tracker-container glass-card">
              <div className="activity-tracker-header">
                <h2 className="activity-tracker-title">
                  <Settings className="activity-tracker-icon" />
                  Tracking de Actividades
                </h2>
                <button 
                  className="manage-activities-btn"
                  onClick={() => setIsManagingActivities(!isManagingActivities)}
                >
                  <Settings className="settings-icon" />
                  <span>{isManagingActivities ? 'Cerrar' : 'Gestionar'}</span>
                </button>
              </div>

              {isManagingActivities && (
                <div className="activity-management">
                  <div className="add-activity">
                    <input
                      type="text"
                      value={newActivityName}
                      onChange={(e) => setNewActivityName(e.target.value)}
                      placeholder="Nueva actividad..."
                      className="activity-input"
                      maxLength={20}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addActivity();
                      }}
                    />
                    <button 
                      className="add-activity-btn"
                      onClick={addActivity}
                      disabled={activities.length >= 8 || !newActivityName.trim()}
                    >
                      <Plus className="plus-icon" />
                      Agregar
                    </button>
                  </div>
                  
                  <div className="activity-list">
                    {activities.map((activity) => (
                      <div key={activity.id} className="activity-item-manage">
                        <div 
                          className="activity-color" 
                          style={{ backgroundColor: activity.color }}
                        />
                        <span className="activity-name">{activity.name}</span>
                        <button 
                          className="remove-activity-btn"
                          onClick={() => removeActivity(activity.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <p className="activity-limit">
                    {activities.length}/8 actividades
                  </p>
                </div>
              )}

              <div className="activity-table-container" ref={activitiesTableRef}>
                <div className="activity-table">
                  <div className="activity-table-header">
                    <div className="day-header">Día</div>
                    {activities.map((activity) => (
                      <div key={activity.id} className="activity-header">
                        <div 
                          className="activity-dot" 
                          style={{ backgroundColor: activity.color }}
                        />
                        <span className="activity-header-text">{activity.name}</span>
                      </div>
                    ))}
                    <div className="percentage-header">%</div>
                  </div>

                  <div className="activity-table-body">
                    {Array.from({ length: getDaysInMonth(monthData.month, monthData.year) }, (_, index) => {
                      const day = index + 1;
                      const currentDay = getCurrentDay();
                      const isCurrentDay = day === currentDay;
                      const completionPercentage = getCompletionPercentage(day);
                      
                      return (
                        <div key={day} className={`activity-row ${isCurrentDay ? 'current-day-row' : ''}`}>
                          <div className="day-cell">
                            <span className="day-number">{day}</span>
                          </div>
                          
                          {activities.map((activity) => (
                            <div key={activity.id} className="activity-cell">
                              <button
                                className={`activity-checkbox ${isActivityCompleted(day, activity.id) ? 'completed' : ''}`}
                                style={{ 
                                  borderColor: activity.color,
                                  backgroundColor: isActivityCompleted(day, activity.id) ? activity.color : 'transparent'
                                }}
                                onClick={() => toggleActivity(day, activity.id)}
                              >
                                {isActivityCompleted(day, activity.id) && (
                                  <Check className="check-icon" />
                                )}
                              </button>
                            </div>
                          ))}
                          
                          <div className="percentage-cell">
                            <span className={`percentage-text ${completionPercentage === 100 ? 'perfect' : completionPercentage >= 50 ? 'good' : 'low'}`}>
                              {completionPercentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección de gráfica de progreso */}
          <section className="progress-chart-section">
            <div className="progress-chart-container glass-card">
              <div className="progress-chart-header">
                <h2 className="progress-chart-title">
                  <TrendingUp className="progress-chart-icon" />
                  Tendencia del Mes
                </h2>
              </div>
              
              <div className="chart-container">
                <div className="chart-grid">
                  {Array.from({ length: getDaysInMonth(monthData.month, monthData.year) }, (_, index) => {
                    const day = index + 1;
                    const percentage = getCompletionPercentage(day);
                    const height = Math.max(percentage, 5); // Mínimo 5% para visibilidad
                    
                    return (
                      <div key={day} className="chart-bar-container">
                        <div 
                          className="chart-bar"
                          style={{ 
                            height: `${height}%`,
                            backgroundColor: percentage === 100 ? '#4CAF50' : percentage >= 50 ? '#FF9800' : '#F44336'
                          }}
                          title={`Día ${day}: ${percentage}%`}
                        />
                        <span className="chart-day-label">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Habits; 