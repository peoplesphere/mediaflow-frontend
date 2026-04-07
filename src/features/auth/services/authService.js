import api from "../../../services/api";

const authService = {

    signup: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    logout: async () => {
        const response = await api.get('/auth/logout');
        return response.data;
    },

}

export default authService;