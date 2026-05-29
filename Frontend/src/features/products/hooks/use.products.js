import { createProduct, getProductsBySeller, deleteProduct, updateProduct, getSellerProductDetials, getAllOrder, updateSellerOrderStatus } from "../services/product.api"
import { useDispatch } from "react-redux"
import { setSellerProducts, setLoading, setError, setProductDetails, setSellerOrder } from "../state/product.slice"


export const useProducts = () => {
    const dispatch = useDispatch()

    const addProduct = async (formData) => {
        try {
            dispatch(setLoading(true))
            const data = await createProduct(formData)

            return data
        } catch (error) {
            dispatch(setError(error.message))
            return error

        } finally {
            dispatch(setLoading(false))
        }

    }

    const getProducts = async () => {
        try {
            dispatch(setLoading(true))
            const data = await getProductsBySeller()
            dispatch(setSellerProducts(data.products))
            console.log("Seller Products")
            console.log(data.products)
            return data
        } catch (error) {
            dispatch(setError(error.message))
            return error

        } finally {
            dispatch(setLoading(false))
        }

    }
    const deleteProductBySaller = async (id) => {
        try {
            dispatch(setLoading(true))
            const data = await deleteProduct(id)

            return data
        } catch (error) {
            dispatch(setError(error.message))
            return error

        } finally {
            dispatch(setLoading(false))
        }

    }

    const updateProductBySaller = async (id, formData) => {
        try {
            dispatch(setLoading(true))
            const data = await updateProduct(id, formData)
            return data
        } catch (error) {
            dispatch(setError(error.message))
            return error

        } finally {
            dispatch(setLoading(false))
        }
    }

    const getProductDetails = async (id) => {
        try {
            dispatch(setLoading(true))
            const data = await getSellerProductDetials(id)

            dispatch(setProductDetails(data.products))
            return data
        } catch (error) {
            dispatch(setError(error.message))
            return error

        } finally {
            dispatch(setLoading(false))
        }
    }

    const getSellerOrders = async () => {
        try {
            dispatch(setLoading(true))
            const data = await getAllOrder()
            dispatch(setSellerOrder(data.order))
            return data
        } catch (error) {
            dispatch(setError(error.message))
            return error

        } finally {
            dispatch(setLoading(false))
        }
    }

    const updateOrderStatusBySeller = async (id, status) => {
        try {
            dispatch(setLoading(true))
            const data = await updateSellerOrderStatus(id, status)
            // Refresh order list
            await getSellerOrders()
            return data
        } catch (error) {
            dispatch(setError(error.message))
            return error
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { addProduct, getProducts, deleteProductBySaller, updateProductBySaller, getProductDetails, getSellerOrders, updateOrderStatusBySeller }

}
