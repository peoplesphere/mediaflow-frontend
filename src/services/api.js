// import axios from "axios"

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.mediaflow.com",
//     withCredentials: true
// })

// // create Interceptor to auto inject token /
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('accessToken')
//     if (config) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
// })

// export default api;

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5006/api",
    withCredentials: true,
});

// Request interceptor — token add karo
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — 401 aaye toh token refresh karo
api.interceptors.response.use(
    (response) => response, // success → as it is return karo

    async (error) => {
        const originalRequest = error.config;

        // 401 aaya aur yeh retry nahi hai
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // infinite loop rokne ke liye

            try {
                // Refresh token se naya access token lo
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    // Refresh token bhi nahi hai → logout
                    localStorage.clear();
                    window.location.href = "/auth/login";
                    return Promise.reject(error);
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
                    { refreshToken }
                );

                const newAccessToken = response.data.data.accessToken;

                // New token save karo
                localStorage.setItem("accessToken", newAccessToken);

                // Original request dobara bhejo naye token ke saath
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh bhi fail → logout karo
                localStorage.clear();
                window.location.href = "/auth/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;