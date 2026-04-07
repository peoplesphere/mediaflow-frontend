import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage?.getItem("user")) || null,
    token: localStorage.getItem("accessToken") || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null
}

const reducers = {
    setLoading: (state, action) => { state.loading = action.payload },
    setCredentials: (state, action) => {
        state.user = action.payload.user,
            state.token = action.payload.token,
            state.isAuthenticated = true
        //save data in localhost also
        localStorage.setItem("user", JSON.stringify(action.payload.user))
        localStorage.setItem("accessToken", JSON.stringify(action.payload.token))
    },
    logout: (state, action) => {
        state.user = null,
            state.token = null,
            state.isAuthenticated = false

        //remove data from localstorage also
        localStorage.removeItem("user")
        localStorage.removeItem("accessToken")
    },
    setError: (state, action) => {
        state.error = action.payload
        state.loading = false
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers
})

export const { setLoading, setCredentials, logout, setError } = authSlice.actions
export default authSlice.reducer;