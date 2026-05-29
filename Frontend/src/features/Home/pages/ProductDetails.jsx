import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHome } from "../hooks/use.home";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useCart } from "../../cart/hooks/use.cart"
import { toast } from "react-toastify";
import {
    ShoppingCart,
    Zap,
    ShieldCheck,
    Truck,
    RefreshCcw,
    Star,
    ChevronRight,
    Heart,
    Minus,
    Plus,
    AlertCircle
} from "lucide-react";

const ProductDetails = () => {
    const { id } = useParams();
    const cart = useSelector((state) => state.cart.cart) || [];
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { getProductByIdHandler } = useHome();
    const { productDetails: product, loading } = useSelector((state) => state.home);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const user = useSelector((state) => state.auth.user)

    const { handleAddToCart, handleUpdateQuantity } = useCart()

    const firstVariantId = selectedVariant ? selectedVariant._id : product?.variants?.[0]?._id;

    const itemVariantId = (item) => {
        if (!item.variant) return null;
        return typeof item.variant === 'object' ? item.variant._id : item.variant;
    };

    const cartItem = Array.isArray(cart)
        ? cart.find(item => itemVariantId(item) === firstVariantId)
        : null;

    useEffect(() => {
        const fetchProduct = async () => {
            await getProductByIdHandler(id);
            window.scrollTo(0, 0);
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product && product.variants?.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    useEffect(() => {
        if (cartItem && user) {
            setQuantity(cartItem.quantity);
        } else {
            setQuantity(1);
        }
    }, [cartItem, firstVariantId]);

    const handleQuantityChange = async (newQty) => {
        if (user == null) {
            navigate('/login');
            return;
        }

        const currentVariant = selectedVariant || product?.variants?.[0];
        const stock = currentVariant?.stock || 0;

        if (newQty > stock) {
            toast.error(`Only ${stock} items available in stock`, {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        const qty = Math.max(1, newQty);
        setQuantity(qty);
        if (cartItem) {
            await handleUpdateQuantity(firstVariantId, qty);
        }
    };

    const handleAddToCartButton = () => {
        if (user == null) {
            navigate('/login');
            return;
        }
        if (!product) return;

        const currentVariant = selectedVariant || product.variants[0];
        if (currentVariant.stock <= 0) {
            toast.error("Item is currently out of stock");
            return;
        }

        handleAddToCart({
            variant: currentVariant,
            quantity,
            price: selectedVariant
                ? { ...product.price, amount: selectedVariant.price, sellingPrice: selectedVariant.sellingPrice }
                : product.price,
            image: selectedVariant
                ? selectedVariant.images?.[0]?.url
                : product.images?.[0]?.url,
            title: selectedVariant ? selectedVariant.title : product.title,
            description: product.description,
            productId: id,
            mrp: product.price.amount,
        });
    };

    const handleBuyNow = () => {
        if (!user) {
            navigate("/login");
            return;
        }
        const currentVariant = selectedVariant || product.variants[0];
        if (currentVariant.stock <= 0) {
            toast.error("Item is currently out of stock");
            return;
        }
        handleAddToCartButton();
        navigate("/cart");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-background)]">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="flex-1 aspect-square bg-[var(--color-primary)] rounded-3xl" />
                        <div className="flex-1 space-y-6">
                            <div className="h-10 bg-[var(--color-primary)] rounded-xl w-3/4" />
                            <div className="h-6 bg-[var(--color-primary)] rounded-lg w-1/4" />
                            <div className="h-32 bg-[var(--color-primary)] rounded-2xl w-full" />
                            <div className="h-14 bg-[var(--color-primary)] rounded-xl w-full" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-[var(--color-background)] transition-colors duration-500">


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-8">
                    <button onClick={() => navigate("/")} className="hover:text-[var(--color-accent)] transition-colors">Home</button>
                    <ChevronRight size={14} />
                    <button onClick={() => navigate("/store")} className="hover:text-[var(--color-accent)] transition-colors">Store</button>
                    <ChevronRight size={14} />
                    <span className="text-[var(--text-primary)] truncate">{product.title}</span>
                </nav>

                <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
                    {/* Left: Image Gallery */}
                    <div className="w-full md:w-[350px] lg:w-[380px] space-y-4 shrink-0 mx-auto lg:mx-0">
                        <div className="relative aspect-square sm:aspect-[4/5] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-[var(--color-primary)] border border-[var(--border-subtle)] shadow-sm group p-4">
                            <img
                                src={selectedVariant?.images?.length > 0
                                    ? selectedVariant.images[activeImage]?.url
                                    : product.images?.[activeImage]?.url}
                                alt={product.title}
                                className="w-full h-full object-contain transition-all duration-700 hover:scale-105"
                            />

                            {/* Slider Controls */}
                            {((selectedVariant?.images?.length > 1) || (!selectedVariant && product.images?.length > 1)) && (
                                <>
                                    <button
                                        onClick={() => {
                                            const imgs = selectedVariant?.images?.length > 0 ? selectedVariant.images : product.images;
                                            setActiveImage((prev) => (prev === 0 ? imgs.length - 1 : prev - 1));
                                        }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/30 backdrop-blur-md rounded-full border border-white/40 text-black opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50"
                                    >
                                        <ChevronRight size={20} className="rotate-180" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const imgs = selectedVariant?.images?.length > 0 ? selectedVariant.images : product.images;
                                            setActiveImage((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/30 backdrop-blur-md rounded-full border border-white/40 text-black opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-xl border border-white/20 text-[var(--text-secondary)] hover:text-red-500 transition-all">
                                <Heart size={18} />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        {((selectedVariant?.images?.length > 1) || (!selectedVariant && product.images?.length > 1)) && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center lg:justify-start">
                                {(selectedVariant?.images?.length > 0 ? selectedVariant.images : product.images).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative w-14 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-[var(--color-accent)] scale-105' : 'border-[var(--border-subtle)] opacity-50'
                                            }`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex-1 space-y-8">
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-accent)]/10 rounded-lg border border-[var(--color-accent)]/20">
                                    <Zap size={12} className="text-[var(--color-accent)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)]">Latest Drop</span>
                                </div>
                                {(selectedVariant?.stock <= 0 || (!selectedVariant && product.variants?.[0]?.stock <= 0)) && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                                        <AlertCircle size={12} className="text-red-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Out of Stock</span>
                                    </div>
                                )}
                                {(selectedVariant?.stock > 0 && selectedVariant?.stock <= 20) && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                        <AlertCircle size={12} className="text-orange-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Only {selectedVariant.stock} left!</span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-[var(--text-primary)] leading-[0.9]">
                                {selectedVariant?.title || product.title}
                            </h1>
                            <div className="flex flex-col gap-1 pt-1">
                                <div className="flex items-center gap-3">
                                    <p className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
                                        {product.price.currency} {(selectedVariant?.sellingPrice || product.price.sellingPrice).toLocaleString()}
                                    </p>
                                    {(selectedVariant?.sellingPrice < selectedVariant?.price || (!selectedVariant && product.price.sellingPrice < product.price.amount)) && (
                                        <p className="text-lg sm:text-xl font-bold text-[var(--text-muted)] line-through opacity-70">
                                            {product.price.currency} {(selectedVariant?.price || product.price.amount).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className={i < 4 ? "text-[var(--color-accent)]" : "text-[var(--text-muted)]"} fill={i < 4 ? "currentColor" : "none"} />
                                    ))}
                                    <span className="text-[10px] font-bold text-[var(--text-muted)] ml-1">4.8 (120 reviews)</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-[var(--text-secondary)] leading-relaxed text-base sm:text-lg">
                            {selectedVariant?.description || product.description}
                        </p>

                        {/* Variant Selection */}
                        {product.variants?.length > 0 && !(product.variants.length === 1 && product.variants[0].attributes?.size === "Standard") && (
                            <div className="space-y-4 pt-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Available Variants</p>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant, idx) => (
                                        <button
                                            key={variant._id || idx}
                                            onClick={() => {
                                                setSelectedVariant(variant);
                                                setActiveImage(0);
                                                setQuantity(1);
                                            }}
                                            className={`px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-3 ${selectedVariant?._id === variant._id
                                                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 shadow-md"
                                                : "border-[var(--border-subtle)] hover:border-[var(--color-accent)]/50"
                                                } ${variant.stock <= 0 ? 'opacity-50 grayscale-[0.5]' : ''}`}
                                        >
                                            <div className="flex flex-col items-start gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold leading-none">
                                                        {variant.title || variant.attributes?.size || `Variant ${idx + 1}`}
                                                    </span>
                                                    {variant.stock <= 0 && <span className="text-[7px] bg-red-500 text-white px-1 rounded-sm">SOLD OUT</span>}
                                                </div>
                                                <span className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-tighter">
                                                    {product.price.currency} {variant.sellingPrice || variant.price}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {user?.role !== 'seller' && (
                            <>
                                {/* Quantity Selector */}
                                <div className={`space-y-3 ${(selectedVariant?.stock <= 0) ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Quantity</p>
                                    <div className="inline-flex items-center bg-[var(--color-primary)] border border-[var(--border-subtle)] rounded-xl p-1 shadow-inner">
                                        <button
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            disabled={selectedVariant?.stock <= 0}
                                            className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)]/10 rounded-lg"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-black text-xl text-[var(--text-primary)]">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            disabled={selectedVariant?.stock <= 0}
                                            className="p-2.5 text-[var(--text-primary)] hover:text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)]/10 rounded-lg"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                        onClick={cartItem ? () => navigate("/cart") : handleAddToCartButton}
                                        disabled={!cartItem && selectedVariant?.stock <= 0}
                                        className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 group transition-all duration-500 border-2 ${cartItem
                                            ? "bg-green-500/10 border-green-500/30 text-green-500 hover:text-white hover:bg-green-500"
                                            : selectedVariant?.stock <= 0
                                                ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                                                : "bg-black text-white border-black hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-black"
                                            }`}
                                    >
                                        <ShoppingCart size={18} className="transition-transform group-hover:scale-110" />
                                        <span className="font-bold uppercase tracking-widest text-xs">
                                            {cartItem ? "Go to cart" : selectedVariant?.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                                        </span>
                                    </Button>
                                    <Button
                                        onClick={handleBuyNow}
                                        disabled={selectedVariant?.stock <= 0}
                                        className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl ${selectedVariant?.stock <= 0
                                            ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                                            : "bg-[var(--color-accent)] text-black border-black hover:opacity-90"
                                            }`}
                                    >
                                        <ShoppingCart size={18} />
                                        <span className="font-bold uppercase tracking-widest text-xs">Buy Now</span>
                                    </Button>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-2 gap-6 pt-10 border-t border-[var(--border-subtle)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--color-background)] flex items-center justify-center text-[var(--color-accent)] border border-[var(--border-subtle)]">
                                            <Truck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">Free Shipping</p>
                                            <p className="text-[10px] text-[var(--text-secondary)]">On orders over ₹1,999</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-accent)] border border-[var(--border-subtle)]">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">Secure Payment</p>
                                            <p className="text-[10px] text-[var(--text-secondary)]">100% Protected</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-accent)] border border-[var(--border-subtle)]">
                                            <RefreshCcw size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">Easy Returns</p>
                                            <p className="text-[10px] text-[var(--text-secondary)]">14 Day Policy</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--color-background)] flex items-center justify-center text-[var(--color-accent)] border border-[var(--border-subtle)]">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">Fast Delivery</p>
                                            <p className="text-[10px] text-[var(--text-secondary)]">2-3 Business Days</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>


        </div>
    );
};

export default ProductDetails;
