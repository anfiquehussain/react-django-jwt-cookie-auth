import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCountries, getStatesByCountry, getCitiesByState } from '../../ApiCalls/GeoApi';

function Register() {
    const { register, error, setError, loading, isAuthenticated } = useAuth();

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
        country: '',
        state: '',
        city: '',
    });

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await getCountries();
                setCountries(data || []);
            } catch (err) {
                console.error('Error fetching countries:', err);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        if (!formData.country) {
            setStates([]);
            setFormData((prev) => ({ ...prev, state: '', city: '' }));
            return;
        }

        const fetchStates = async () => {
            setLoadingStates(true);
            try {
                const data = await getStatesByCountry(formData.country);
                setStates(data || []);
                setFormData((prev) => ({ ...prev, state: '', city: '' }));
            } catch (err) {
                console.error('Error fetching states:', err);
            }
            setLoadingStates(false);
        };
        fetchStates();
    }, [formData.country]);

    useEffect(() => {
        if (!formData.state) {
            setCities([]);
            setFormData((prev) => ({ ...prev, city: '' }));
            return;
        }

        const fetchCities = async () => {
            setLoadingCities(true);
            try {
                const data = await getCitiesByState(formData.state);
                setCities(data || []);
                setFormData((prev) => ({ ...prev, city: '' }));
            } catch (err) {
                console.error('Error fetching cities:', err);
            }
            setLoadingCities(false);
        };
        fetchCities();
    }, [formData.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        register(formData);
    };

    return (
        <div className="flex justify-center items-center min-h-[90vh] px-4">
            <div className="w-full max-w-md p-8 rounded-xl border-2 border-main-accent-500">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Username + Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full p-3 border border-main-accent-500 rounded-md focus:outline-none focus:ring-2 focus:ring-main-accent-500"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full p-3 border border-main-accent-500 rounded-md focus:outline-none focus:ring-2 focus:ring-main-accent-500"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password + Confirm Password */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Password</label>
                            <input
                                type="password"
                                name="password1"
                                className="w-full p-3 border border-main-accent-500 rounded-md focus:outline-none focus:ring-2 focus:ring-main-accent-500"
                                value={formData.password1}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Confirm Password</label>
                            <input
                                type="password"
                                name="password2"
                                className="w-full p-3 border border-main-accent-500 rounded-md focus:outline-none focus:ring-2 focus:ring-main-accent-500"
                                value={formData.password2}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Country + State */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Country</label>
                            <select
                                name="country"
                                className="w-full p-3 border border-main-accent-500 rounded-md focus:outline-none focus:ring-2 focus:ring-main-accent-500"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            >
                                <option className='bg-primary-100' value="">Select country</option>
                                {countries.map((c) => (
                                    <option className='bg-primary-100' key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">State</label>
                            <select
                                name="state"
                                className="w-full p-3 border border-main-accent-500 rounded-md focus:outline-none focus:ring-2 focus:ring-main-accent-500"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                disabled={!formData.country || loadingStates}
                            >
                                <option className='bg-primary-100' value="">
                                    {loadingStates ? 'Loading states...' : 'Select state'}
                                </option>
                                {states.map((s) => (
                                    <option className='bg-primary-100' key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* City */}
                    <div>
                        <label className="block mb-1 font-medium">City</label>
                        <select
                            name="city"
                            className="w-full p-3 border border-main-accent-500 rounded-md focus:outline-none focus:ring-2 focus:ring-main-accent-500"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            disabled={!formData.state || loadingCities}
                        >
                            <option className='bg-primary-100' value="">
                                {loadingCities ? 'Loading cities...' : 'Select city'}
                            </option>
                            {cities.map((c) => (
                                <option className='bg-primary-100' key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-main-accent-500 hover:bg-accent-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    {/* Error Display */}
                    {error && (
                        <div className="text-red-600 text-sm whitespace-pre-wrap">
                            {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
                        </div>
                    )}

                    {/* Success Message */}
                    {isAuthenticated && (
                        <p className="text-green-600 font-semibold text-center">
                            Registered successfully!
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Register;
