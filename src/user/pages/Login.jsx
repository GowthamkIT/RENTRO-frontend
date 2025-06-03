import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import '../styles/Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle regular email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Call your login method from AuthContext (make sure it returns user info)
      await login(email, password);

      // Save user email for later use
      localStorage.setItem('userEmail', email);

      // Navigate to home or admin page after login
      navigate('/home');
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth login success
  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded token:", decoded);

      if (decoded && decoded.email) {
        localStorage.setItem('userEmail', decoded.email);
        navigate('/home');
      } else {
        setErrors({ general: "Could not retrieve email from Google login." });
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setErrors({ general: "Google login failed. Please try again." });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ general: "Google login failed. Please try again." });
    console.log('Google login failed');
  };

  const goToAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="login-container">
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/login_car.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="login-card" role="main" aria-label="Login form">
        <header className="login-header">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to login</p>
        </header>

        <form onSubmit={handleLogin} className="login-form" noValidate>
          {errors.general && <div className="error-message general-error">{errors.general}</div>}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              disabled={isLoading || googleLoading}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={isLoading || googleLoading}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="options-row">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" disabled={isLoading || googleLoading} />
              <label htmlFor="remember">Remember me</label>
            </div>
            <NavLink to="/forgot-password" className="forgot-password">
              Forgot password?
            </NavLink>
          </div>

          <button type="submit" className="login-button" disabled={isLoading || googleLoading} aria-busy={isLoading}>
            {isLoading ? (
              <span className="spinner" aria-label="Loading"></span>
            ) : (
              'Login'
            )}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="social-login">
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                disabled={isLoading || googleLoading}
                size="large"
                text="continue_with"
                shape="rectangular"
                width="300"
              />
            </div>
            
          </div>

          <div className="signup-link">
            Don't have an account? <NavLink to="/register">Sign up</NavLink>
          </div>
        </form>

        <div className="admin-login-container" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            className="admin-login-button"
            onClick={goToAdminLogin}
            disabled={isLoading || googleLoading}
            aria-label="Go to Admin Login"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}
