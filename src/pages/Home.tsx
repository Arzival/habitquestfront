import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Award,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-header">
            <div className="logo-hero">
              <Trophy className="logo-icon-hero" />
              <h1 className="hero-title">HabitQuest</h1>
            </div>
            <h2 className="hero-subtitle">
              Transforma tu vida en una aventura épica
            </h2>
            <p className="hero-description">
              Convierte tus hábitos diarios en misiones emocionantes. Gana puntos, 
              desbloquea logros y construye la mejor versión de ti mismo con nuestro 
              sistema de gamificación revolucionario.
            </p>
          </div>

          <div className="hero-actions">
            <Link to="/register" className="cta-button primary">
              <Sparkles className="button-icon" />
              Comenzar Aventura
              <ArrowRight className="button-icon" />
            </Link>
            <Link to="/login" className="cta-button secondary">
              <Trophy className="button-icon" />
              Ya soy un Héroe
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="stats-preview">
            <div className="stat-item">
              <div className="stat-icon">
                <CheckCircle className="icon-success" />
              </div>
              <div className="stat-content">
                <span className="stat-number">127</span>
                <span className="stat-label">Hábitos Completados</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Target className="icon-warning" />
              </div>
              <div className="stat-content">
                <span className="stat-number">45</span>
                <span className="stat-label">Días de Racha</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Award className="icon-primary" />
              </div>
              <div className="stat-content">
                <span className="stat-number">12</span>
                <span className="stat-label">Logros Desbloqueados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            <Zap className="section-icon" />
            ¿Por qué elegir HabitQuest?
          </h2>
          <p className="section-description">
            Descubre las características que hacen de HabitQuest la herramienta 
            más poderosa para construir hábitos duraderos.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Trophy className="icon-feature" />
            </div>
            <h3 className="feature-title">Sistema de Puntos</h3>
            <p className="feature-description">
              Gana puntos por cada hábito completado. Acumula experiencia y 
              desbloquea nuevos niveles de progreso personal.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Calendar className="icon-feature" />
            </div>
            <h3 className="feature-title">Seguimiento Visual</h3>
            <p className="feature-description">
              Visualiza tu progreso con gráficas estilo GitHub. Ve tu consistencia 
              y mantén la motivación día tras día.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Target className="icon-feature" />
            </div>
            <h3 className="feature-title">Metas Personalizadas</h3>
            <p className="feature-description">
              Define objetivos específicos para cada hábito. Establece metas 
              alcanzables y celebra cada victoria.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Award className="icon-feature" />
            </div>
            <h3 className="feature-title">Logros y Insignias</h3>
            <p className="feature-description">
              Desbloquea logros especiales por consistencia, rachas y hitos 
              importantes en tu journey personal.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 className="icon-feature" />
            </div>
            <h3 className="feature-title">Análisis Detallado</h3>
            <p className="feature-description">
              Obtén insights profundos sobre tus patrones de comportamiento 
              y optimiza tu rutina para máximo éxito.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Users className="icon-feature" />
            </div>
            <h3 className="feature-title">Comunidad Activa</h3>
            <p className="feature-description">
              Conéctate con otros heroes en su journey. Comparte logros y 
              mantente motivado con la comunidad.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">
            <TrendingUp className="section-icon" />
            ¿Cómo funciona?
          </h2>
          <p className="section-description">
            Tres simples pasos para transformar tu vida en una aventura épica
          </p>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">Crea tu Perfil</h3>
              <p className="step-description">
                Regístrate y personaliza tu avatar de héroe. Define qué hábitos 
                quieres convertir en tu aventura diaria.
              </p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">Completa Misiones</h3>
              <p className="step-description">
                Cada hábito es una misión. Completa tus tareas diarias y gana 
                puntos de experiencia para subir de nivel.
              </p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">Desbloquea Logros</h3>
              <p className="step-description">
                Mantén rachas consistentes, alcanza hitos importantes y 
                desbloquea logros épicos en tu journey personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            ¿Listo para comenzar tu aventura?
          </h2>
          <p className="cta-description">
            Únete a miles de heroes que ya están transformando sus vidas. 
            Tu journey épico comienza con un solo clic.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary large">
              <Sparkles className="button-icon" />
              Comenzar Gratis
              <ArrowRight className="button-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Trophy className="footer-logo" />
            <span className="footer-brand-text">HabitQuest</span>
          </div>
          <p className="footer-text">
            Transformando vidas, un hábito a la vez.
          </p>
          <div className="footer-links">
            <Link to="/login" className="footer-link">Iniciar Sesión</Link>
            <Link to="/register" className="footer-link">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
