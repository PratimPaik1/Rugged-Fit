import axios from "axios";

const orderApi = axios.create({
    baseURL: "/api/order",
    withCredentials: true,
});

export const createOrderApi = async ({ cartId, addressId, paymentMode }) => {
    const res = await orderApi.post("/create", { cartId, addressId, paymentMode });
    return res.data;
};

export const getUserOrdersApi = async () => {
    const res = await orderApi.get("/user");
    return res.data;
};
