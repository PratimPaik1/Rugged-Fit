import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        cartId: null,
        totalPrice: 0,
        totalQuantity: 0,
        totalMrp: 0,
        totalDiscount: 0,
        taxAmount: 0,
        taxRate: 0,
        shipingCharge: 0,
        totalDiscountPercent: 0,
        finalAmount: 0,
        loading: false,
        error: null
    },
    reducers: {
        setCart: (state, action) => {
            const cartData = action.payload;
            // Handle both array (legacy) and object (new) payloads
            if (Array.isArray(cartData)) {
                state.cart = cartData.filter(item => item && item.variant);
                state.totalQuantity = state.cart.reduce((total, item) => total + item.quantity, 0);
                state.totalPrice = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                state.totalMrp = state.cart.reduce((total, item) => total + (item.mrp * item.quantity), 0);
            } else if (cartData) {
                state.cartId = cartData._id || null;
                state.cart = (cartData.items || []).filter(item => item && item.variant);
                state.totalPrice = cartData.totalPrice || 0;
                state.totalMrp = cartData.totalMRP || 0;
                state.totalDiscount = cartData.totalDiscount || 0;
                state.taxAmount = cartData.taxAmount || 0;
                state.taxRate = cartData.taxRate || 0;
                state.shipingCharge = cartData.shipingCharge || 0;
                state.totalDiscountPercent = cartData.totalDiscountPercent || 0;
                state.finalAmount = cartData.finalAmount || 0;
                state.totalQuantity = state.cart.reduce((total, item) => total + item.quantity, 0);
            }
        },
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.cart.find(item => item.variant === product.variant);
            if (existingItem) {
                existingItem.quantity += (product.quantity || 1);

            } else {
                state.cart.push({ ...product, quantity: product.quantity || 1 });
            }
        },
        updateCartQuantity: (state, action) => {
            const { variantId, quantity } = action.payload;
            const item = state.cart.find(item => item.variant === variantId);
            if (item) {
                item.quantity = quantity;
            }
        },
        removeFromCart: (state, action) => {
            const variantId = action.payload;
            state.cart = state.cart.filter(item => item.variant !== variantId);
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearCart: (state) => {
            state.cart = [];
            state.cartId = null;
            state.totalPrice = 0;
            state.totalQuantity = 0;
            state.totalMrp = 0;
            state.totalDiscount = 0;
            state.taxAmount = 0;
            state.taxRate = 0;
            state.shipingCharge = 0;
            state.totalDiscountPercent = 0;
            state.finalAmount = 0;
        }
    }
})

export const { setCart, addToCart, updateCartQuantity, removeFromCart, setLoading, setError, clearCart } = cartSlice.actions

export default cartSlice.reducer