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
    } = useSelector((state) => (state.auth))

    const signup = async (userData) => {
        try {
            dispatch(setLoading(true))
            const data = await authService.signup(userData)
            dispatch(setCredentials({ user: data.data?.user, token: data.data?.accessToken }))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Signup Failed'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const login = async (credentials) => {
        try {
            dispatch(setLoading(true))
            const data = await authService.login(credentials)
            console.log("data->", data);
            dispatch(setCredentials({ user: data.data?.user, token: data.data?.accessToken }))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'login Failed'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const logoutUser = async () => {
        try {
            dispatch(setLoading(true))
            await authService.logout()
            dispatch(logout())
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
