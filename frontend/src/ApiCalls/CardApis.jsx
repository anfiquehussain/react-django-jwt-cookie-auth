import httpClient from "../api/httpClient";

// Generic fetcher for a dynamic endpoint
export const fetchCardData = (endpoint) => async (type) => {
    try {
        const response = await httpClient.get(`analytics/${endpoint}?type=${type}`);
        console.log(`Fetched data for ${endpoint}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for ${endpoint}:`, error);
        return { user_count: 0, user_percent: 0 };
    }
};

