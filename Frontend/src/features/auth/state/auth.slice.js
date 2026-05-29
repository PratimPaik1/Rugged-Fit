import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        error: null,
        loading: false,
        isInitialized: false
    },
    reducers: {

        setUser: (state, action) => {
            state.user = action.payload;
            state.isInitialized = true;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isInitialized = true;
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setUser, setError, setLoading } = authSlice.actions
export default authSlice.reducer
