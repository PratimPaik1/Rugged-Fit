import axios from "axios";

const API = axios.create({
    baseURL: "/api/product",
    withCredentials: true
})

const SellerAPI = axios.create({
    baseURL: "/api/order",
    withCredentials: true
})

export async function createProduct(formData) {
    const res = await API.post("/add-product", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res.data


}

export const getProductsBySeller = async () => {
    const res = await API.get("get-products-by-seller")
    return res.data
}
export const deleteProduct = async (id) => {
    const res = await API.delete(`/${id}`);
    return res.data;
};

export const getAllProducts = async () => {
    const res = await API.get("/");
    return res.data;
};

export const getProductById = async (id) => {
    const res = await API.get(`/${id}`);
    return res.data;
}

export const updateProduct = async (id, formData) => {
    const res = await API.put(`/update/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res.data
}

export const getSellerProductDetials = async (id) => {

    const res = await API.get(`/seller/${id}`)
    return res.data
}


export const getAllOrder = async () => {
    const res = await SellerAPI.get("/seller")
    return res.data
}

export const updateSellerOrderStatus = async (id, status) => {
    const res = await SellerAPI.put(`/status/${id}`, { orderStatus: status })
    return res.data
}