import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const homeSlice = createSlice({
    name: "home",
    initialState: {
        buyerProducts: [],
        productDetails: null,
        loading: false,
        error: null
    },
    reducers: {
        
        setBuyerProducts: (state, action) => {
            state.buyerProducts = action.payload
        },
        setProductDetails: (state, action) => {
            state.productDetails = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }

    },

})

export const { setBuyerProducts, setLoading, setError, setProductDetails } = homeSlice.actions
export default homeSlice.reducer