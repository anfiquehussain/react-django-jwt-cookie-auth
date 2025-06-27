import axios from 'axios';
import BASE_URL from '../contents/BASE_URL';
import { refreshAccessToken } from '../ApiCalls/AuthApi';

const httpClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // sends cookies (like sessionid and csrftoken)
});

let csrfToken = '';

const fetchCsrfToken = async () => {
    try {
        const res = await httpClient.get('/accounts/csrf/');
        csrfToken = res.data.csrfToken;
        console.log('Fetched CSRF token:', res);
        httpClient.defaults.headers.common['X-CSRFToken'] = csrfToken;
    } catch (err) {
        console.error('Failed to fetch CSRF token', err);
    }
};

// Call this once on app start or before POST/PUT/DELETE
export const ensureCsrfToken = async () => {
    if (!csrfToken) {
        await fetchCsrfToken();
    }
};

// Interceptor: retry logic for token refresh
httpClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/accounts/token/refresh/')
        ) {
            originalRequest._retry = true;
            try {
                await refreshAccessToken();
                return httpClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default httpClient;
