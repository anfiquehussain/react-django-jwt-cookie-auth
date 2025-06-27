import httpClient from "../api/httpClient";

export const getCountries = async () => {
    try {
        const response = await httpClient.get(`/accounts/countries/`); // Call backend logout if exists
        return response.data;
    } catch (err) {
        console.error('Fetch countries error:', err);
        return null;
    }
}


export const getStatesByCountry = async (countryId) => {
    try {
        const response = await httpClient.get(`/accounts/countries/${countryId}/states/`);
        return response.data;
    } catch (err) {
        console.error('Fetch states error:', err);
        return [];
    }
};

export const getCitiesByState = async (stateId) => {
    try {
        const response = await httpClient.get(`/accounts/states/${stateId}/cities/`);
        return response.data;
    } catch (err) {
        console.error('Fetch cities error:', err);
        return [];
    }
};
  

export const getTopLocations = async (type) => {
    try {
        const response = await httpClient.get(`/analytics/top_locations/users/count/?level=${type}`);
        console.log(type);
        return response.data;
    } catch (err) {
        console.error('Fetch top locations error:', err);
        return [];
    }
};