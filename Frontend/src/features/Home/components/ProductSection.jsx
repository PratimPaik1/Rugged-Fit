import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import BuyerProductCard from "./BuyerProductCard";
import { useSelector } from "react-redux";

const ProductSection = ({ loading, products }) => {
    const user = useSelector((state) => state.auth.user);
    return (
        <section className="py-16 bg-[var(--color-background)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter mb-2">{user?.role === "seller" ? "Your Drop" : "Latest Drops"}</h2>
                        <div className="h-1 w-16 bg-[var(--color-accent)] rounded-full" />
                    </div>
                    <Link to="/store" className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-2">
                        View All Products <ArrowRight size={16} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="space-y-4 animate-pulse">
                                <div className="aspect-[3/4] bg-[var(--color-background)] rounded-2xl" />
                                <div className="h-4 bg-[var(--color-background)] rounded w-2/3" />
                                <div className="h-4 bg-[var(--color-background)] rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : products?.length === 0 ? (
                    <div className="text-center py-20 bg-[var(--color-background)] rounded-3xl border-2 border-dashed border-[var(--border-subtle)]">
                        <ShoppingBag size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
                        <h3 className="text-xl font-bold mb-2">No products found</h3>
                        <p className="text-[var(--text-secondary)]">We're restocked soon. Stay tuned!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <BuyerProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductSection;
