import axios from "axios";

const cartApi = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
})

export const addToCartServices = async ({ variant, quantity, price, image, title, description, productId, mrp }) => {
    const res = await cartApi.post("/add-to-cart", { variant, quantity, price, image, title, description, productId, mrp })
    return res.data
}

export const getCartServices = async () => {
    const res = await cartApi.get("/get-cart")
    return res.data
}

export const updateCartQuantityServices = async ({ variantId, quantity }) => {
    const res = await cartApi.put("/update-quantity", { variantId, quantity })
    return res.data
}

export const removeCartItemServices = async (variantId) => {
    const res = await cartApi.delete(`/remove-item/${variantId}`)
    return res.data
}