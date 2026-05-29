import React, { useEffect, useState } from "react";
import Footer from "../../Home/components/Footer";
import Navbar from "../../Home/components/Navbar";
import { useCart } from "../hooks/use.cart";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CartCard from "../components/CartCard";
import CartSummery from "../components/CartSummery";
const Cart = () => {
    const cart = useSelector((state) => state.cart.cart);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const loading = useSelector((state) => state.cart.loading);
    const { handleUpdateQuantity, handleRemoveItem, getCart } = useCart();

    if (loading && cart.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex flex-col">

                <div className="flex-1 flex items-center justify-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--color-accent)] border-solid border-[var(--border-subtle)]"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="text-[var(--color-accent)] animate-pulse" size={20} />
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col font-sans transition-colors duration-500 overflow-x-hidden">


            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-all shadow-sm hover:shadow-md border border-[var(--border-subtle)]">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Shopping Cart</h1>
                            <p className="text-[var(--text-secondary)] text-[10px] md:text-sm mt-0.5">Manage your selected items and checkout</p>
                        </div>
                    </div>
                    {cart.length > 0 && (
                        <div className="bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-4 py-2 rounded-2xl text-[10px] md:text-sm font-bold flex items-center gap-2 self-start md:self-center border border-[var(--color-accent)]/20">
                            <ShoppingBag size={16} className="md:w-[18px] md:h-[18px]" />
                            {totalQuantity === 1 ? totalQuantity + " ITEM" : totalQuantity + " ITEMS"} IN CART
                        </div>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className="bg-[var(--color-primary)] rounded-3xl shadow-xl shadow-black/5 p-12 text-center max-w-2xl mx-auto border border-[var(--border-subtle)]">
                        <div className="bg-[var(--color-accent)]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <ShoppingBag className="text-[var(--color-accent)]" size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Your cart is currently empty</h2>
                        <p className="text-[var(--text-secondary)] mb-10 text-lg max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our premium fitness products and find your perfect fit!</p>
                        <Link to="/" className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-2xl text-black bg-[var(--color-accent)] hover:scale-105 transition-all shadow-lg shadow-[var(--color-accent)]/20 active:scale-95">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            {cart.map((item) => (
                                <CartCard
                                    key={item.variant}
                                    item={item}
                                    handleQuantityChange={handleUpdateQuantity}
                                    handleRemove={handleRemoveItem}
                                    handleUpdateQuantity={handleUpdateQuantity}
                                />
                            ))}
                        </div>

                        {/* Order Summary */}
                        <CartSummery />
                    </div>
                )}
            </main>

        </div>
    );
};

export default Cart;