import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useProducts } from "../../products/hooks/use.products";
import { useHome } from "../hooks/use.home";
// Components
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const { getProducts } = useProducts();
    const { getAllProductByBuyer } = useHome()
    const buyerProducts = useSelector((state) => state.home.buyerProducts);
    const loading = useSelector((state) => state.product.loading);
    const user = useSelector((state) => state.auth.user);
    const products = useSelector((state) => state.product.products);
    const navigate = useNavigate()
    useEffect(() => {
        if (user?.role === "seller") {
            getProducts();
            navigate('/dashboard')
        } else {
            getAllProductByBuyer();
        }
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-background)]">

            <main>
                <Hero />
                <ProductSection loading={loading} products={user?.role === "seller" ? products : buyerProducts} />
                <Features />
            </main>

        </div>
    );
};

export default Home;
