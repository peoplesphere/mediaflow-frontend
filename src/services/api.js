import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.mediaflow.com",
    withCredentials: true
})

// create Interceptor to auto inject token /
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (config) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api;