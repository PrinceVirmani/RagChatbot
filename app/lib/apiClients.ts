import axios from "axios";

// axios instance
// Use local proxy (/api/v1) to avoid cross-origin cookie issues
// The proxy is configured in next.config.ts to forward to the actual API

const isDev = process.env.NODE_ENV === 'development';

const apiClient = axios.create({
    baseURL: '/api/v1',
    timeout: 10000,
    headers:{
        'Content-Type': 'application/json'
    },
});

// requesting interceptor before every api call
// purpose - cookie sending for CORS requests withCredentials: true

apiClient.interceptors.request.use(
    (config)=>{

        // sending cookies with CORS requests
        config.withCredentials = true;
        if (isDev) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error)=>{

        // handling error
        if (isDev) {
            console.error("[API Request Error]", error);
        }
        return Promise.reject(error);
    }
);

// response interceptor after receiving response
// before the response is returned to components
// purpose - handling auth errors and auto refresh tokens

apiClient.interceptors.response.use(

    // if response is 2XX returning the response

    (response)=>{
        if (isDev) {
            console.log(`[API Response] ${response.status} ${response.config.url}`);
        }
        return response
    },

    async (error)=>{
        const originalRequest = error.config;

        // Check if this is a 401 error AND not already a retry attempt AND not a refresh request itself
        // This prevents infinite loops when refresh token is also invalid
        // Don't auto-refresh for login/register/me requests
        // /auth/me is used for session check on app load - let AuthProvider handle the failure

        if(
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh') &&
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.includes('/auth/register') &&
            !originalRequest.url?.includes('/auth/me')
        ){
            originalRequest._retry = true;

            try{
                if (isDev) {
                    console.warn("[API Response] 401 Unauthorized - attempting token refresh");
                }

                // calling refresh endpoint with withCredentials to send refresh token cookie
                const refreshResponse = await apiClient.post('/auth/refresh');

                if (isDev) {
                    console.log('[TOKEN REFRESH] token refreshed successfully', refreshResponse.data);
                }

                // retrying original request with new token
                return apiClient(originalRequest);

            }catch(refreshError){
                // If refresh fails, just reject - don't redirect here
                // Let the component/AuthProvider handle the redirect to prevent loops
                if (isDev) {
                    console.error('[TOKEN REFRESH FAILED] User needs to login again');
                }
                return Promise.reject(refreshError);
            }
        }

        // Don't log 401 errors for /auth/me - they're expected when not authenticated
        const isAuthMeRequest = error.config?.url?.includes('/auth/me');
        const is401Error = error.response?.status === 401;

        if (isDev && !(isAuthMeRequest && is401Error)) {
            console.error('[API ERROR]', error.response?.status, error.message, error.config?.url);
        }

        return Promise.reject(error);
    }
);

export default apiClient;

