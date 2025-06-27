import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import httpClient, { ensureCsrfToken } from '../api/httpClient';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Start as loading true on mount
    const [error, setError] = useState('');

    // Use useCallback to memoize the function so it's stable for useEffect dependencies
    const checkAuthenticated = useCallback(async () => {
        setLoading(true);
        try {
            const response = await httpClient.get('/accounts/is_authenticated/');
            const isAuth = response?.data?.authenticated === true;
            setIsAuthenticated(isAuth);
            setError('');
        } catch (error) {
            // Handle errors gracefully, no console noise for 401
            if (error.response?.status !== 401) {
                console.error('Unexpected error:', error);
                setError('Unexpected error occurred.');
            } else {
                setError('');
            }
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);
      
    
    // Register user
    const register = async (data) => {
        setLoading(true);
        try {
            await httpClient.post('/accounts/register/', data);
            await checkAuthenticated(); // refresh auth state after registration
        } catch (err) {
            setIsAuthenticated(false);
            setUser(null);

            if (err.response && err.response.data) {
                const serverErrors = err.response.data;
                if (typeof serverErrors === 'object') {
                    const messages = Object.entries(serverErrors)
                        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                        .join('\n');
                    setError(messages);
                } else {
                    setError(serverErrors);
                }
            } else {
                setError('Registration failed. Please try again.');
            }

            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (formData) => {
        setLoading(true);
        try {
            await httpClient.post('/accounts/login/', formData);
            await checkAuthenticated();
            setError('');
        } catch (err) {
            setIsAuthenticated(false);
            setUser(null);
            setError('Login failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logout = async () => {
        await ensureCsrfToken();
        try {
            await httpClient.post('/accounts/logout/');
        } catch (err) {
            console.error('Logout error:', err);
        }
        setIsAuthenticated(false);
        setUser(null);
        setError('');
    };

    // Initial auth check on mount
    useEffect(() => {
        const initAuthCheck = async () => {
            setLoading(true);
            await checkAuthenticated();
            setLoading(false);
        };
        initAuthCheck();
    }, [checkAuthenticated]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                error,
                setError,
                register,
                login,
                logout,
                checkAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
