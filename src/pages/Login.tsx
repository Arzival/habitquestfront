import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import '../styles/Auth.css';

const Login: React.FC = () => {
  // Estados básicos solo para la UI
  const [showPassword, setShowPassword] = useState<boolean>(false);

  /**
   * Maneja el envío del formulario (solo para demostración)
   * @param e - Evento del formulario
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Solo prevenir el comportamiento por defecto - no hay lógica de autenticación
    console.log('Login form submitted - MOCKUP');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Trophy style={{ width: '2rem', height: '2rem', color: 'var(--darkblue-accent)', filter: 'drop-shadow(0 0 15px rgba(79, 70, 229, 0.6))' }} />
            <h1 className="auth-title">HabitQuest</h1>
          </div>
          <h2 className="auth-subtitle">Iniciar Sesión</h2>
          <p className="auth-description">
            Bienvenido de vuelta. Continúa tu aventura de hábitos.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          {/* Campo Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="form-input"
                placeholder="Tu contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            className="auth-button"
          >
            Iniciar Sesión
          </button>

          {/* Enlaces adicionales */}
          <div className="auth-links">
            <p className="auth-link-text">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="auth-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
