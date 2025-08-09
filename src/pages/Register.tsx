import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import '../styles/Auth.css';
import { registerUser, saveAuthToken, saveUserData } from '../requests/authRequests';
import type { RegisterRequest } from '../requests/authRequests';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  
  // Estados para la UI
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);
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
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = ['El nombre es obligatorio'];
    } else if (formData.name.length > 255) {
      newErrors.name = ['El nombre no puede exceder 255 caracteres'];
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = ['El email es obligatorio'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ['El formato del email no es válido'];
    } else if (formData.email.length > 255) {
      newErrors.email = ['El email no puede exceder 255 caracteres'];
    }
    
    // Validar contraseña
    if (!formData.password) {
      newErrors.password = ['La contraseña es obligatoria'];
    } else if (formData.password.length < 8) {
      newErrors.password = ['La contraseña debe tener al menos 8 caracteres'];
    }
    
    // Validar confirmación de contraseña
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = ['Debes confirmar tu contraseña'];
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = ['Las contraseñas no coinciden'];
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario de registro
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
      const response = await registerUser(formData);
      
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
          <h2 className="auth-subtitle">Crear Cuenta</h2>
          <p className="auth-description">
            Únete a HabitQuest y comienza tu aventura de mejores hábitos.
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
          
          {/* Campo Nombre */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Tu nombre completo"
              autoComplete="name"
              disabled={isLoading}
            />
            {errors.name && (
              <div className="field-error">
                {errors.name.map((error, index) => (
                  <span key={index}>{error}</span>
                ))}
              </div>
            )}
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
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
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

          {/* Campo Password Confirmation */}
          <div className="form-group">
            <label htmlFor="password_confirmation" className="form-label">
              Confirmar contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswordConfirmation ? 'text' : 'password'}
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                className={`form-input ${errors.password_confirmation ? 'error' : ''}`}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                disabled={isLoading}
              >
                {showPasswordConfirmation ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password_confirmation && (
              <div className="field-error">
                {errors.password_confirmation.map((error, index) => (
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
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
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
