import React, { useEffect, useState } from 'react';
import { SearchUser } from '../../ApiCalls/User';
import { getCountries, getStatesByCountry, getCitiesByState } from '../../ApiCalls/GeoApi';

function Users() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState({
        sort: 'random',
        username: '',
        country: '',
        state: '',
        city: ''
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchInitial = async () => {
            const fetchedCountries = await getCountries();
            setCountries(fetchedCountries || []);
        };
        fetchInitial();
    }, []);

    useEffect(() => {
        if (searchQuery.country) {
            const fetchStates = async () => {
                const fetchedStates = await getStatesByCountry(searchQuery.country);
                setStates(fetchedStates || []);
                setSearchQuery(prev => ({ ...prev, state: '', city: '' }));
                setCities([]);
            };
            fetchStates();
        }
    }, [searchQuery.country]);

    useEffect(() => {
        if (searchQuery.state) {
            const fetchCities = async () => {
                const fetchedCities = await getCitiesByState(searchQuery.state);
                setCities(fetchedCities || []);
                setSearchQuery(prev => ({ ...prev, city: '' }));
            };
            fetchCities();
        }
    }, [searchQuery.state]);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await SearchUser(searchQuery);
            setUsers(fetchedUsers || []);
        };
        fetchUsers();
    }, [searchQuery]);

    const inputClass = `
    w-full p-2 rounded-lg border border-secondary bg-main-primary-500 dark:bg-main-primary-500 text-main-background-500
    dark:border-gray-700 focus:outline-none 
    focus:ring-2 focus:ring-accent transition hover:scale-[1.02]
`;


    return (
        <div className="min-h-screen p-6 bg-background dark:bg-background text-text dark:text-text">
            <h1 className="text-3xl font-bold mb-6 text-accent dark:text-accent text-center">
                🔎 User Search
            </h1>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-background-secondary dark:bg-background-secondary p-4 rounded-xl shadow mb-10">
                <input
                    type="text"
                    placeholder="Username"
                    className={inputClass}
                    value={searchQuery.username}
                    onChange={(e) => setSearchQuery({ ...searchQuery, username: e.target.value })}
                />
                <select
                    className={inputClass}
                    value={searchQuery.country}
                    onChange={(e) => setSearchQuery({ ...searchQuery, country: e.target.value })}
                >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                        <option className='text-text' key={country.id} value={country.id}>{country.name}</option>
                    ))}
                </select>
                <select
                    className={inputClass}
                    value={searchQuery.state}
                    onChange={(e) => setSearchQuery({ ...searchQuery, state: e.target.value })}
                    disabled={!states.length}
                >
                    <option value="">Select State</option>
                    {states.map((state) => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                </select>
                <select
                    className={inputClass}
                    value={searchQuery.city}
                    onChange={(e) => setSearchQuery({ ...searchQuery, city: e.target.value })}
                    disabled={!cities.length}
                >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </select>
                <select
                    className={inputClass}
                    value={searchQuery.sort}
                    onChange={(e) => setSearchQuery({ ...searchQuery, sort: e.target.value })}
                >
                    <option value="random">Random</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
                <button
                    className="w-full p-2 bg-main-primary-500 dark:bg-main-primary-500 text-main-background-500 rounded-lg hover:scale-[1.02] transition"
                    onClick={() => setSearchQuery({ ...searchQuery, username: '', country: '', state: '', city: '' })}
                >
                    Clear Filters
                </button>
            </div>

            {/* User Cards */}
            {users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {users.map(user => (
                        <div
                            key={user.id}
                            className="p-6 rounded-2xl shadow-lg dark:bg-secondary-200 hover:shadow-xl hover:scale-[1.02] transition-transform"
                        >
                            <h2 className="text-xl font-semibold text-[var(--color-accent)]  mb-1" style={{ wordBreak: 'break-word' }}>
                                {user.username}
                            </h2>
                            <p className="text-text-secondary dark:text-text-secondary">🌍 {user.country}</p>
                            <p className="text-text-secondary dark:text-text-secondary">🏙️ {user.state}, {user.city}</p>
                            <p className="text-sm text-secondary dark:text-secondary mt-2">
                                📅 Joined: {new Date(user.date_joined).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-text-secondary dark:text-text-secondary mt-10">
                    No users found.
                </p>
            )}
        </div>
    );
}

export default Users;
