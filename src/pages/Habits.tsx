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



const Habits: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Estado para los datos del mes seleccionado
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  
  // Estado para la frase del mes
  const [monthPhrase, setMonthPhrase] = useState<string>('');
  const [isEditingPhrase, setIsEditingPhrase] = useState<boolean>(false);



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


        </div>
      </main>
    </div>
  );
};

export default Habits; 