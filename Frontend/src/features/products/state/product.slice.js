import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        productDetails: null,
        cart: JSON.parse(localStorage.getItem("cart")) || [],
        sellerOrders: [],
        loading: false,
        error: null
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.products = action.payload
        },
        setProductDetails: (state, action) => {
            state.productDetails = action.payload
        },
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.cart.find(item => item._id === product._id);
            if (existingItem) {
                existingItem.quantity += (product.quantity || 1);
            } else {
                state.cart.push({ ...product, quantity: product.quantity || 1 });
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        updateCartQuantity: (state, action) => {
            const { _id, quantity } = action.payload;
            const item = state.cart.find(item => item._id === _id);
            if (item) {
                item.quantity = quantity;
                if (item.quantity <= 0) {
                    state.cart = state.cart.filter(i => i._id !== _id);
                }
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setSellerOrder: (state, action) => {
            state.sellerOrders = action.payload
        }

    },

})

export const { setSellerProducts, setLoading, setError, setProductDetails, addToCart, updateCartQuantity, setSellerOrder } = productSlice.actions
export default productSlice.reducer