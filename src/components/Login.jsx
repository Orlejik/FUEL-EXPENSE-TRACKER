import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      // setError(err.response?.data?.detail || 'Login failed');
      setError(
  typeof err.response?.data?.detail === 'string'
    ? err.response.data.detail
    : JSON.stringify(err.response?.data?.detail || 'Login failed')
);
    } finally {
      setLoading(false);
    }
    console.log('Login attempt with email:', email);
    console.log('Login attempt with password:', password);
  };

  return (
    <div className="login-container">
      <h1>Fuel Expense Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
