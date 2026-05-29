import { addToCartServices, getCartServices, updateCartQuantityServices, removeCartItemServices } from "../services/cart.api";
import { addToCart, setCart, setLoading, setError, updateCartQuantity, removeFromCart } from "../state/cart.slice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export const useCart = () => {
    const dispatch = useDispatch()

    const handleAddToCart = async (item) => {
        try {
            dispatch(setLoading(true))
            await addToCartServices(item)
            await getCart()
            toast.success("Item added to cart")
        } catch (error) {
            console.log(error)
            dispatch(setError(error.message))
            toast.error(error.response?.data?.message || "Failed to add to cart")
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleUpdateQuantity = async (variantId, quantity) => {
        try {
            if (quantity < 1) return;
            // Optimistic update
            dispatch(updateCartQuantity({ variantId, quantity }))
            await updateCartQuantityServices({ variantId, quantity })
            await getCart()
        } catch (error) {
            console.log(error)
            dispatch(setError(error.message))
            toast.error(error.response?.data?.message || "Failed to update quantity")
            await getCart() // Revert optimistic update
        }
    }

    const handleRemoveItem = async (variantId) => {
        try {
            // Optimistic update
            dispatch(removeFromCart(variantId))
            await removeCartItemServices(variantId)
            await getCart()
            toast.success("Item removed from cart")
        } catch (error) {
            console.log(error)
            dispatch(setError(error.message))
            toast.error("Failed to remove item")
        }
    }

    const getCart = async () => {
        try {
            dispatch(setLoading(true))
            const res = await getCartServices()
            dispatch(setCart(res))
        } catch (error) {
            console.log(error)
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {

        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveItem,
        getCart
    }
}