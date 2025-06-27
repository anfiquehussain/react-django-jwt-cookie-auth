import httpClient from '../api/httpClient';

export const refreshAccessToken = async () => {
    try {
        await httpClient.post('/accounts/token/refresh/', {}, {
            headers: {
                'X-CSRFToken': httpClient.defaults.headers.common['X-CSRFToken'],
            },
        });
        return true;
    } catch (err) {
        return false;
    }
};



