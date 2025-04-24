import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('register/', {
        username: username,
        password: password,
        password2: password2,
        email: email,
      });

      if (response.status === 201) {
        const loginResponse = await axios.post('token/', {
          username: username,
          password: password,
        });

        if (loginResponse.status === 200) {
          const { access, refresh } = loginResponse.data;
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);

          navigate('/');
        } else {
          setError('Login failed after registration');
        }
      } else {
        setError('Registration failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      console.error('Registration error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <label>
        Confirm Password:
        <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;

