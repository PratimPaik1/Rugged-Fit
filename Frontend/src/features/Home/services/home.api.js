import axios from "axios";

const API = axios.create({
    baseURL: "/api/product",
    withCredentials: true
})


export const getAllProducts = async () => {
    const res = await API.get("/");
    return res.data;
};

export const getProductById = async (id) => {
    const res = await API.get(`/${id}`);
    return res.data;
}   
