import React from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "../../../features/cart/hooks/use.cart";
import Button from "../components/Button";
const BuyerProductCard = ({ product }) => {
    const user = useSelector((state) => state.auth.user);
    const { handleAddToCart } = useCart();
    const cart = useSelector((state) => state.cart.cart) || [];
    const navigate = useNavigate();

    const selectedVariant =
        product.variants?.find(variant => variant.stock > 0) ||
        product.variants?.[0];

    const selectedVariantId = selectedVariant?._id;
    const cartItem = Array.isArray(cart)
        ? cart.find((item) => {
            const itemVariantId =
                typeof item.variant === "object"
                    ? item.variant?._id
                    : item.variant;

            return itemVariantId === selectedVariantId;
        })
        : null;

    function handleAddToCartButton(e) {
        if (user == null) {
            navigate('/login');
            return;
        }
        e.stopPropagation();
        handleAddToCart({
            variant: selectedVariant,
            quantity: 1,
            price: selectedVariant.sellingPrice,
            image: selectedVariant.images[0]?.url,
            title: selectedVariant.title || product.name,
            description: product.description,
            productId: product._id,
            mrp: selectedVariant.price,
        });
    }


    return (
        <div className="group card p-0 border-none bg-transparent hover:translate-y-0 transition-none" onClick={() => navigate(`/product/${product._id}`)}>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-sm border border-[var(--border-subtle)] group-hover:shadow-lg transition-all duration-500 ">
                <img
                    src={selectedVariant.images[0]?.url}
                    alt={selectedVariant.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[var(--color-accent)] transition-colors">
                        <ShoppingCart size={14} className="text-black" />
                    </button>
                </div>
                {(Math.round(((selectedVariant.price.amount - selectedVariant.price.sellingPrice) / selectedVariant.price.amount) * 100)) > 45 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        Sale
                    </div>
                )}
            </div>
            <div className="px-1 ">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-0.5">{product.category || 'Apparel'}</p>
                <h3 className="font-bold text-base mb-0.5 line-clamp-1">{selectedVariant.title || product.title}</h3>
                <div className="flex flex-col gap-0.5">
                    <p className="text-[var(--color-accent-secondary)] font-black text-lg leading-none">
                        {product.price.currency === 'INR' ? '₹' : '$'}{selectedVariant.sellingPrice || selectedVariant.price.amount || selectedVariant.price}
                    </p>
                    {selectedVariant.sellingPrice && selectedVariant.sellingPrice < selectedVariant.price && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--text-muted)] line-through">
                                {product.price.currency === 'INR' ? '₹' : '$'}{selectedVariant.price}
                            </span>
                            <span className="text-[10px] font-bold text-green-500">

                                {Math.round(((selectedVariant.price - selectedVariant.sellingPrice) / selectedVariant.price) * 100)}% OFF
                            </span>
                        </div>
                    )}
                </div>
                {user?.role === "seller" ? <button className="text-[var(--color-background)] font-bold text-lg bg-[var(--color-accent-secondary)] px-2 rounded" onClick={() => navigate(`/product/edit/${product._id}`)}>Edit Product</button> : <div className="flex gap-5 mt-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            cartItem ? navigate("/cart") : handleAddToCartButton(e);
                        }}
                        className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 group transition-all duration-500 border-2 ${cartItem
                            ? "bg-green-500/10 border-green-500/30 text-green-500 hover:text-white hover:bg-green-500 transition-colors duration-300"
                            : "bg-black text-white border-black hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-black shadow-lg shadow-black/10"
                            }`}
                    >
                        <span className="font-bold uppercase tracking-widest text-xs">
                            {cartItem ? "Go to cart" : "Add to Cart"}
                        </span>
                    </button>
                    <Button className="text-[var(--color-accent-secondary)] text-sm bg-[var(--color-accent)] px-2 py-1 rounded" onClick={() => navigate(`/product/${product._id}`)}>Buy Now</Button></div>}
            </div>
        </div>
    );
};

export default BuyerProductCard;
