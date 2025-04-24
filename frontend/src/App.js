import React, { useEffect } from 'react';
import axios from 'axios';
import RegistrationForm from './components/RegistrationForm';
import Home from './pages/Home'; // Import the Home component
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://127.0.0.1:8000'; // Set base URL

function App() {
  const navigate = useNavigate(); // Use useNavigate

  useEffect(() => {
    // Add a request interceptor to attach the access token to every request
    axios.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor to handle token refresh and authentication errors
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const tokenResponse = await axios.post('/api/core/token/refresh/', {
                refresh: refreshToken,
              });

              const { access } = tokenResponse.data;
              localStorage.setItem('access_token', access);
              axios.defaults.headers.common['Authorization'] = `Bearer ${access}`; // Apply the new token to axios defaults

              originalRequest.headers.Authorization = `Bearer ${access}`; // Set the new token to the original request
              return axios(originalRequest); // Retry the original request
            } catch (refreshError) {
              // If token refresh fails, redirect to login
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              navigate('/login'); // Use navigate for redirection
              return Promise.reject(refreshError);
            }
          } else {
            // If no refresh token, redirect to login
            navigate('/login'); // Use navigate for redirection
          }
        }
        return Promise.reject(error);
      }
    );
  }, [navigate]); // Include navigate in the dependency array

  return (
    <div>
      <h1>My App</h1>
      {/* Your other components */}
      <Routes>
        <Route path="/" element={<Home />} />  {/* Add the route for the Home component */}
        <Route path="/register" element={<RegistrationForm />} />
        {/* Your other routes */}
      </Routes>
    </div>
  );
}

export default App;
