import React from 'react';
import { Calendar, X } from 'lucide-react';

// Interfaz para los datos de la card
interface MonthCardProps {
  id: string;
  month: string;
  year: number;
  createdAt: string;
  onCardClick: (card: { month: string; year: number; id: string }) => void;
  onRemoveCard: (id: string) => void;
}

const MonthCard: React.FC<MonthCardProps> = ({
  id,
  month,
  year,
  createdAt,
  onCardClick,
  onRemoveCard
}) => {
  // Función para manejar el click en la card
  const handleCardClick = () => {
    onCardClick({ month, year, id });
  };

  // Función para manejar la eliminación
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveCard(id);
  };

  return (
    <div
      id={id}
      className="month-card glass-card clickable"
      onClick={handleCardClick}
    >
      <div className="month-card-header">
        <div className="month-card-title">
          <Calendar className="month-card-icon" />
          <div className="month-card-text">
            <h3 className="month-name">{month}</h3>
            <p className="month-year">{year}</p>
          </div>
        </div>
        <button
          className="remove-month-btn"
          onClick={handleRemoveClick}
          title="Eliminar mes"
        >
          <X className="remove-icon" />
        </button>
      </div>
      <div className="month-card-content">
        <p className="month-card-description">
          Card agregada el {new Date(createdAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

export default MonthCard;
