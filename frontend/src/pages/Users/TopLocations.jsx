import React, { useEffect, useState } from 'react';
import { getTopLocations } from '../../ApiCalls/GeoApi';

function TopLocations() {
    const [locations, setLocations] = useState([]);
    const [type, setType] = useState('country');

    useEffect(() => {
        const fetchTopLocations = async () => {
            try {
                const data = await getTopLocations(type);
                console.log(`Top ${type} data:`, data);
                setLocations(data?.top_locations || []);
            } catch (error) {
                console.error('Error fetching top locations:', error);
                setLocations([]);
            }
        };

        fetchTopLocations();
    }, [type]);

    const types = ['country', 'state', 'city'];

    const getRankEmoji = (index) => {
        const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        return rankEmojis[index] || `${index + 1}.`;
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">
                Top  <span className="capitalize">{type}</span> by User Count
            </h2>


            {/* Type selector */}
            <div className="flex flex-wrap gap-2 mb-6">
                {types.map((t) => (
                    <button
                        key={t}
                        onClick={() => setType(t)}
                        aria-pressed={type === t}
                        className={`px-4 py-2 rounded-md border cursor-pointer  text-sm font-medium transition-colors duration-300
              ${type === t
                                ? 'bg-main-accent-500 text-white border-main-accent-500 dark:bg-main-accent-500 dark:text-white dark:border-main-accent-500'
                                : ''
                            }`}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Leaderboard list */}
            <div className="space-y-3  rounded-xl">
                {locations.length > 0 ? (
                    locations.map((location, index) => (
                        <div
                            key={index}
                            className={`p-4 flex items-center justify-between rounded-lg border transition-all duration-300
                ${index === 0
                                    ? 'bg-primary-300 border-primary-300 dark:border-primary-400 dark:bg-primary-400'
                                    : index === 1
                                    ? 'bg-primary-200 border-primary-200 dark:border-primary-300 dark:bg-primary-300'
                                        : index === 2
                                        ? 'bg-primary-100 border-primary-100 dark:border-primary-200 dark:bg-primary-300'
                                        : 'bg-primary-50 border-primary-50 dark:border-primary-100 dark:bg-primary-100'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{getRankEmoji(index)}</span>
                                <span className="font-semibold">
                                    {location.name || 'Unknown'}
                                </span>
                            </div>
                            <span className="text-sm">
                                {location.user_count} users
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="">No data available.</p>
                )}
            </div>
        </div>
    );
}

export default TopLocations;
