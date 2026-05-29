import axios from "axios";

const addressApi = axios.create({
    baseURL: "/api/address",
    withCredentials: true,
});

export const getAddresses = async () => {
    const res = await addressApi.get("/");
    return res.data;
};

export const addAddress = async (addressData) => {
    const res = await addressApi.post("/", addressData);
    return res.data;
};

export const updateAddress = async (id, addressData) => {
    const res = await addressApi.put(`/${id}`, addressData);
    return res.data;
};

export const deleteAddressApi = async (id) => {
    const res = await addressApi.delete(`/${id}`);
    return res.data;
};
