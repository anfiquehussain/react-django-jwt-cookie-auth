import React, { useEffect, useState } from 'react';
import { PiUsersThree } from "react-icons/pi";
import { BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";

function CountCard({ title, fetcher, display_filter = true }) {
  const [selectedType, setSelectedType] = useState('week');
  const [data, setData] = useState({
    user_count: 0,
    user_count_today: 0,
    percentage: 0,
    country_name: ''
  });
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setFade(false);
      const res = await fetcher(selectedType);
      setTimeout(() => {
        if (res) {
          setData(res);
          setFade(true);
        }
      }, 150);
    };
    fetchData();
  }, [selectedType, fetcher]);

  const isPositive = data.percentage >= 0;

  const renderCount = () => {
    if (data.country_name) return `${data.country_name} (${data.user_count})`;
    return data.user_count_today ?? data.user_count ?? 0;
  };

  return (
    <div className="p-4 bg-secondary-200 dark:bg-secondary-200 rounded-xl flex flex-col gap-3 w-full transition-all duration-300">

      {/* Icon & Title */}
      <div className="flex items-center gap-2 text-base">
        <PiUsersThree className="text-xl text-main-accent-500 dark:text-main-accent-500" />
        <p>{title}</p>
      </div>

      {/* Count */}
      <div className={`transition-all duration-500 transform ${fade ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"}`}>
        <h1 className="text-3xl font-bold">{renderCount()}</h1>
      </div>

      {/* Growth + Filter */}
      <div className="flex justify-between items-center text-sm text-text-main-secondary dark:text-text-main-secondary">

        {/* Percentage growth */}
        <div className={`flex items-center gap-2 transition-all duration-300 transform ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
          {isPositive ? (
            <BsGraphUpArrow size={20} className="text-main-accent-500 dark:text-main-accent-500" />
          ) : (
            <BsGraphDownArrow size={20} className="text-main-accent-500 dark:text-main-accent-500" />
          )}
          <p className="font-medium text-main-accent-500 dark:text-main-accent-500">
            {isPositive ? `+${data.percentage}%` : `${data.percentage}%`}
          </p>
        </div>

        {/* Optional Week/All Filter */}
        {display_filter && (
          <div className="flex gap-1">
            {['week', 'all'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2 py-1 rounded text-xs cursor-pointer transition-all duration-300 ${selectedType === type
                    ? 'bg-main-accent-500 dark:bg-main-accent-500 text-white'
                    : 'text-text-main-secondary dark:text-text-main-secondary'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CountCard;
