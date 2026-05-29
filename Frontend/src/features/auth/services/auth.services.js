import axios from "axios";
const authApiInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
});


export async function register({ email, contact, password, fullname, isSeller }) {
    console.log(isSeller, email, fullname, password, contact)

    const response = await authApiInstance.post("/register", {
        email,
        contact,
        password,
        fullname,
        isSeller
    })
    return response.data
}

export async function login({ identifier, password }) {

    const response = await authApiInstance.post("/login", {
        identifier, password
    })
    return response.data
}


export const getCurrentUser = async () => {
    const response = await authApiInstance.get("/me");
    return response.data;
};

export const logoutUser = async () => {
    const response = await authApiInstance.post("/logout");
    return response.data;
};
