import React, { useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import Home from './pages/Home';
import FlashcardList from './components/FlashcardList';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        axios.interceptors.request.use(
            config => {
                const accessToken = localStorage.getItem('access_token');
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            response => {
                return response;
            },
            async error => {
                const originalRequest = error.config;

                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        try {
                            const tokenResponse = await axios.post('/api/core/token/refresh/', {
                                refresh: refreshToken
                            });

                            const { access } = tokenResponse.data;
                            localStorage.setItem('access_token', access);
                            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                            originalRequest.headers.Authorization = `Bearer ${access}`;
                            return axios(originalRequest);

                        } catch (refreshError) {
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            navigate('/login');
                            return Promise.reject(refreshError);
                        }
                    } else {
                        navigate('/login');
                    }
                }
                return Promise.reject(error);
            }
        );
    }, [navigate]);

    return (
        <div>
            <h1>My App</h1>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/flashcards" element={<FlashcardList />} /> {/* Add FlashcardList route */}
            </Routes>
        </div>
    );
}

export default App;
