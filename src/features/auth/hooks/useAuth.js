import { useDispatch, useSelector } from "react-redux";
import { setLoading, setCredentials, logout, setError } from "../authSlice";
import authService from "../services/authService";

const useAuth = () => {
    const dispatch = useDispatch()
    const {
        user,
        token,
        isAuthenticated,
        loading,
        error
    } = useSelector()

    const signup = async (userData) => {
        try {
            dispatch(setLoading(true))
            const data = await authService.signup(userData)
            dispatch(setCredentials({ user: data.user, token: data.token }))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Signup Failed'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const login = async (credentials) => {
        try {
            dispatch(setLoading(true))
            const data = authService.login(credentials)
            dispatch(setCredentials({ user: data.user, token: data.token }))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'login Failed'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const logoutUser = async () => {
        try {
            dispatch(setLoading(true))
            const data = authService.logout()
            dispatch(setCredentials({ user: null, token: null }))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'logout Failed'))
        } finally {
            dispatch(setLoading(false))
        }

    }

    return {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        signup,
        login,
        logoutUser
    }
}

export default useAuth;
