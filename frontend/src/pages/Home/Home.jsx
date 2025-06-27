import React from 'react';
import { useAuth } from '../../context/AuthContext';
import CountCard from '../../components/cards/CountCard';
import Title from '../../components/basic/Title';
import { fetchCardData } from '../../ApiCalls/CardApis';

function Home() {
    const { loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    const cards = [
        { title: "Total Users", fetcher: fetchCardData("users/count/"),display_filter: true },
        { title: "Signups Today", fetcher: fetchCardData("users/signup/today/count/"), display_filter: false },
        { title: "New This Month", fetcher: fetchCardData("users/this_month/count/") , display_filter: false },
        { title: "Top Country", fetcher: fetchCardData("top_one_country/users/count/") }, 
    ];

    return (
        <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((card, idx) => (
                    <CountCard
                        key={idx}
                        title={card.title}
                        fetcher={card.fetcher}
                        display_filter={card.display_filter}
                    />                  
                ))}
            </div>
            <div>
                <Title />
            </div>
        </div>
    );
}

export default Home;
