import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import '../styles/Auth.css';
import { loginUser, saveAuthToken, saveUserData } from '../requests/authRequests';
import type { LoginRequest } from '../requests/authRequests';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  
  // Estados para la UI
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string[]}>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');

  /**
   * Maneja los cambios en los campos del formulario
   * @param e - Evento del input
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores específicos del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Valida el formulario antes de enviarlo
   * @returns true si es válido, false si hay errores
   */
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string[]} = {};
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = ['El email es obligatorio'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ['El formato del email no es válido'];
    }
    
    // Validar contraseña
    if (!formData.password) {
      newErrors.password = ['La contraseña es obligatoria'];
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario de login
   * @param e - Evento del formulario
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Limpiar mensajes anteriores
    setGeneralError('');
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await loginUser(formData);
      
      if (response.success && response.data) {
        // Guardar token y datos del usuario
        saveAuthToken(response.data.accessToken, response.data.tokenType);
        saveUserData(response.data.user);
        
        setSuccessMessage(response.message);
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // Manejar errores de validación del servidor
        if (response.errors) {
          setErrors(response.errors);
        } else {
          setGeneralError(response.message || 'Error desconocido');
        }
      }
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
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
          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="alert alert-success">
              <CheckCircle size={20} />
              <span>{successMessage}</span>
            </div>
          )}
          
          {/* Mensaje de error general */}
          {generalError && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{generalError}</span>
            </div>
          )}
          
          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="tu@email.com"
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && (
              <div className="field-error">
                {errors.email.map((error, index) => (
                  <span key={index}>{error}</span>
                ))}
              </div>
            )}
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
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <div className="field-error">
                {errors.password.map((error, index) => (
                  <span key={index}>{error}</span>
                ))}
              </div>
            )}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
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
