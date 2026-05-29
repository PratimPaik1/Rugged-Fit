import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import RegisterSeller from "../features/auth/pages/RegisterSeller.jsx";
import DashboardLayout from "../features/products/components/DashboardLayout.jsx";
import DashboardHome from "../features/products/pages/DashboardHome.jsx";
import MyProducts from "../features/products/pages/MyProducts.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import SellerOrders from "../features/products/pages/SellerOrders.jsx";
import Store from "../features/Home/pages/Store.jsx";

import Protected from "../features/auth/components/Protected.jsx";
import Home from "../features/Home/pages/Home.jsx";
import ProductDetails from "../features/Home/pages/ProductDetails.jsx";
import UpdateProduct from "../features/products/pages/UpdateProduct.jsx";
import Cart from "../features/cart/pages/Cart.jsx";
import UserOrders from "../features/order/pages/UserOrders.jsx";
import HomeLayout from "../features/Home/components/HomeLayout.jsx";
export const routes = createBrowserRouter([

    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/register-seller",
        element: <RegisterSeller />,
    },
    {
        element: <HomeLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/cart",
                element: <Protected><Cart /></Protected>
            },
            {
                path: "/orders",
                element: <Protected><UserOrders /></Protected>
            },
            {
                path: "/store",
                element: <Store />,
            },
            {
                path: "/product/:id",
                element: <ProductDetails />,
            },
        ]
    },
    {
        path: "/dashboard",
        element: <Protected role="seller"><DashboardLayout /></Protected>,
        children: [
            {
                index: true,
                element: <Protected role="seller"><DashboardHome /></Protected>,
            },
            {
                path: "/dashboard/products",
                element: <Protected role="seller"><MyProducts /></Protected>,
            },
            {
                path: "/dashboard/create-product",
                element: <Protected role="seller"><CreateProduct /></Protected>,
            },
            {
                path: "/dashboard/orders",
                element: <Protected role="seller"><SellerOrders /></Protected>,
            },
            {
                path: "/dashboard/seller-products/:id",
                element: <Protected role="seller"><UpdateProduct /></Protected>,
            }
        ]
    }
]);