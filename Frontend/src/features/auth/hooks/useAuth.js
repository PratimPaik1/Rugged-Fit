import { register, login, getCurrentUser, logoutUser } from "../services/auth.services";
import { setUser, setError, setLoading } from "../state/auth.slice";
import { clearCart } from "../../cart/state/cart.slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
export const useAuth = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleRegister = async ({ fullname, email, contact, password, isSeller = false }) => {
        try {
            dispatch(setLoading(true));
            const res = await register({ fullname, email, contact, password, isSeller })

            dispatch(setUser(res.user));
            return res;
        } catch (error) {
            dispatch(setError(error.response.data.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleLogin = async ({ identifier, password }) => {
        try {
            dispatch(setLoading(true));
            const res = await login({ identifier, password })

            dispatch(setUser(res.user));
            return res;
        } catch (error) {
            dispatch(setError(error.response.data.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
    const handleCurrentUser = async () => {
        try {
            dispatch(setLoading(true));
            const res = await getCurrentUser();
            dispatch(setUser(res.user));
            return res;
        } catch (error) {
            dispatch(setError(error.response.data.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleLogout = async () => {
        try {
            dispatch(setLoading(true));
            await logoutUser();
            dispatch(setUser(null));
            dispatch(clearCart());
        } catch (error) {
            dispatch(setError(error.response?.data?.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
    return { handleRegister, handleLogin, handleCurrentUser, handleLogout }

}
