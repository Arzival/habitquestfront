import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import '../styles/Auth.css';

const Register: React.FC = () => {
  // Estados básicos solo para la UI
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);

  /**
   * Maneja el envío del formulario (solo para demostración)
   * @param e - Evento del formulario
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Solo prevenir el comportamiento por defecto - no hay lógica de registro
    console.log('Register form submitted - MOCKUP');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Trophy style={{ width: '2rem', height: '2rem', color: 'var(--darkblue-accent)', filter: 'drop-shadow(0 0 15px rgba(79, 70, 229, 0.6))' }} />
            <h1 className="auth-title">HabitQuest</h1>
          </div>
          <h2 className="auth-subtitle">Crear Cuenta</h2>
          <p className="auth-description">
            Únete a HabitQuest y comienza tu aventura de mejores hábitos.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Tu nombre completo"
              autoComplete="name"
            />
          </div>

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
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
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

          {/* Campo Password Confirmation */}
          <div className="form-group">
            <label htmlFor="passwordConfirmation" className="form-label">
              Confirmar contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswordConfirmation ? 'text' : 'password'}
                id="passwordConfirmation"
                name="passwordConfirmation"
                className="form-input"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
              >
                {showPasswordConfirmation ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            className="auth-button"
          >
            Crear Cuenta
          </button>

          {/* Enlaces adicionales */}
          <div className="auth-links">
            <p className="auth-link-text">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="auth-link">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
