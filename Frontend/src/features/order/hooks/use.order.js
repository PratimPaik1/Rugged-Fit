import { createOrderApi, getUserOrdersApi } from "../services/order.api";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setOrders } from "../state/order.slice";


export const useOrder = () => {
    const dispatch = useDispatch()
    const createOrder = async ({ cartId, addressId, paymentMode }) => {
        try {
            dispatch(setLoading(true))
            const data = await createOrderApi({ cartId, addressId, paymentMode })

            dispatch(setOrders(data.order))
            return data
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }
    const getUserOrder = async () => {
        try {
            dispatch(setLoading(true))
            const data = await getUserOrdersApi()
            const response = data.order.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            dispatch(setOrders(response))
            return data
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { createOrder, getUserOrder }
}
