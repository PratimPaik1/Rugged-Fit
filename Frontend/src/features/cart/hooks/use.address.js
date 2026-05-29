import { useState, useEffect } from "react";
import { getAddresses, addAddress, updateAddress, deleteAddressApi } from "../services/address.api";
import { toast } from "react-toastify";

export const useAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const res = await getAddresses();
            if (res.success) {
                setAddresses(res.addresses);
            }
        } catch (err) {
            setError(err.message);
            toast.error("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (addressData) => {
        try {
            setLoading(true);
            const res = await addAddress(addressData);
            if (res.success) {
                toast.success("Address added successfully");
                await fetchAddresses();
                return res.address;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add address");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAddress = async (id, addressData) => {
        try {
            setLoading(true);
            const res = await updateAddress(id, addressData);
            if (res.success) {
                toast.success("Address updated successfully");
                await fetchAddresses();
                return res.address;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update address");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            setLoading(true);
            const res = await deleteAddressApi(id);
            if (res.success) {
                toast.success("Address deleted successfully");
                await fetchAddresses();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete address");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return {
        addresses,
        loading,
        error,
        fetchAddresses,
        handleAddAddress,
        handleUpdateAddress,
        handleDeleteAddress
    };
};
