import { getAllProducts, getProductById } from "../services/home.api"
import { useDispatch } from "react-redux"
import { setLoading, setError, setBuyerProducts, setProductDetails } from "../states/home.slice"


export const useHome = () => {
    const dispatch = useDispatch()


    const getAllProductByBuyer = async () => {
        try {
            dispatch(setLoading(true))
            const data = await getAllProducts()
            dispatch(setBuyerProducts(data.products))
            return data
        } catch (error) {
            dispatch(setError(error.message))
            return error

        } finally {
            dispatch(setLoading(false))
        }

    }

    const getProductByIdHandler = async (id) => {
        try {
            dispatch(setLoading(true))

            const data = await getProductById(id)
            dispatch(setProductDetails(data.product))

            return data
        } catch (error) {
            dispatch(setError(error.message))
            return error

        } finally {
            dispatch(setLoading(false))
        }

    }

    return { getAllProductByBuyer, getProductByIdHandler }

}
