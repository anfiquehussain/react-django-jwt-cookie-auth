import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { login, error, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [localLoading, setLocalLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalLoading(true);           // start local loading
        await login(formData);
        setLocalLoading(false);          // stop local loading when login finishes
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    // Combine localLoading and global loading from context
    const isLoading = loading || localLoading;

    return (
        <div className="flex justify-center items-center h-[85vh] transition-colors duration-300 px-4">
            <div className="w-full max-w-md p-8 rounded-xl border-2 border-main-accent-500">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full p-3 border border-main-accent-500 rounded-md focus:outline-none focus:ring-2 focus:ring-main-accent-500"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full p-3 rounded-md border border-main-accent-500 focus:outline-none focus:ring-2 focus:ring-main-accent-500"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-main-accent-500 hover:bg-accent-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                        )}
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                    {error && <p className="text-red-600 mt-4 whitespace-pre-line text-sm">{error}</p>}
                </form>
            </div>
        </div>
    );
      
}

export default Login;
