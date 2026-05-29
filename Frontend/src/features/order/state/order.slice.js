import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: [],
    loading: false,
    error: null
}

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setOrders: (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        },
        setError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
})

export const { setLoading, setOrders, setError } = orderSlice.actions;

export default orderSlice.reducer;