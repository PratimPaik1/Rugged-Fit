import react from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";

const Protected = ({ children, role = "buyer" }) => {
    const { user, isInitialized } = useSelector((state) => state.auth);

    if (!isInitialized) return null;
    if (!user) return <Navigate to="/login" />;
    if (user.role !== role) return <Navigate to="/" />;
    return children;
};

export default Protected;