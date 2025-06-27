import httpClient from "../api/httpClient";

export const getUser = async () => {
    try {
        const response = await httpClient.get(`/accounts/user/`); // Call backend logout if exists
        console.log(response);
        return response.data;
    } catch (err) {
        console.error('Logout error:', err);
        return null;
    }
}



//sort:random
//sort:newst
//sort:oldest
//name:new11gmail
//country:1
//state:1
//city:1
export const SearchUser = async (filters = {}) => {
    try {
        const params = new URLSearchParams();

        for (const key in filters) {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        }

        const response = await httpClient.get(`/accounts/users/?${params.toString()}`);
        return response.data;
    } catch (err) {
        console.error('Search user error:', err);
        return null;
    }
};
