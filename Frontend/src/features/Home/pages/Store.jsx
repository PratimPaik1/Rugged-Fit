import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, Search } from "lucide-react";
import { useProducts } from "../../products/hooks/use.products";
import { useHome } from "../hooks/use.home";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import BuyerProductCard from "../components/BuyerProductCard";
import Footer from "../components/Footer";
const Store = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const buyerProducts = useSelector((state) => state.home.buyerProducts);
  const sellerProducts = useSelector((state) => state.product.products);
  const homeLoading = useSelector((state) => state.home.loading);
  const productLoading = useSelector((state) => state.product.loading);
  const loading = user?.role === "seller" ? productLoading : homeLoading;

  const { getProducts } = useProducts();
  const { getAllProductByBuyer } = useHome();

  const productsToShow = user?.role === "seller" ? sellerProducts : buyerProducts;

  const cart = useSelector((state) => state.cart.cart);
  useEffect(() => {
    if (user?.role === "seller") {
      getProducts();
    } else {
      getAllProductByBuyer();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">


      {/* Products */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
          {user?.role === "seller" ? "My Products" : "Featured Gear"}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)] rounded-full"></div>
          </div>
        ) : productsToShow?.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-primary)] rounded-2xl border">
            <h3>No products found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsToShow?.map((product, i) => (
              <BuyerProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

    </div>

  );
};

export default Store;
