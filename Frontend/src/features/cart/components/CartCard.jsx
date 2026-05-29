import {
    ArrowLeftIcon,
    ShoppingBagIcon,
    Minus,
    Plus,
    Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CartCard = ({
    item,

    handleRemove,
    handleUpdateQuantity
}) => {
    return (
        <div className="group bg-[var(--color-primary)] rounded-2xl md:rounded-3xl shadow-sm p-3 md:p-6 transition-all hover:shadow-xl hover:shadow-black/5 border border-[var(--border-subtle)] relative overflow-hidden">
            {/* Glass effect background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/0 via-transparent to-transparent group-hover:from-[var(--color-accent)]/5 transition-all duration-500"></div>

            <div className="relative flex items-center gap-3 md:gap-6">
                {/* Product Image */}
                <div className="relative w-16 h-16 md:w-32 md:h-32 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-[var(--color-background)] border border-[var(--border-subtle)] group-hover:scale-105 transition-transform duration-500">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-1 md:p-2"
                    />
                </div>

                {/* Product Details & Actions */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-6 min-w-0">
                    <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-xs md:text-lg font-bold text-[var(--text-primary)] leading-tight line-clamp-2 mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                            {item.title}
                        </h3>
                        <p className="hidden md:block text-[var(--text-secondary)] text-sm mb-4 line-clamp-2 leading-relaxed">
                            {item.description}
                        </p>

                        {/* Mobile Price */}
                        <div className="flex items-center gap-2 md:hidden">
                            <span className="text-[10px] font-bold text-[var(--text-primary)]">₹{item.current_price}</span>
                            <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">/ pc</span>
                        </div>

                        {/* Stock Message */}
                        {item.message && (
                            <p className={`text-[10px] font-bold uppercase tracking-tight mt-2 ${item.isOutOfStock ? 'text-red-500' : 'text-orange-500'}`}>
                                {item.message}
                            </p>
                        )}
                        {item.current_price > item.price ? (
                            <p className="text-[8px] md:text-[10px] font-bold text-red-600 uppercase tracking-widest mb-0.5 ">
                                <span className=" line-through">
                                    ₹{item.price}
                                </span>
                                <span className=" ml-1">
                                    Price Updated:
                                    ₹{item.current_price}
                                </span>
                                /pc
                            </p>
                        ) : item.current_price < item.price ? (
                            <p className="text-[8px] md:text-[10px] font-bold text-green-500 uppercase tracking-widest mb-0.5">
                                You are saving more ₹{item.price - item.current_price} /pc
                            </p>
                        ) : (
                            <p className="text-[8px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-0.5">
                                ₹{item.price} /pc
                            </p>
                        )}
                    </div>

                    {/* Quantity and Actions Container */}
                    <div className="flex items-center justify-between md:justify-end gap-2 md:gap-8 mt-1 md:mt-0">
                        {/* Quantity Control */}
                        <div className={`flex items-center bg-[var(--color-background)] rounded-lg md:rounded-xl p-0.5 md:p-1 border border-[var(--border-subtle)] shadow-inner ${item.isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button
                                onClick={() => handleUpdateQuantity(item.variant, item.quantity - 1)}
                                disabled={item.quantity <= 1 || item.isOutOfStock}
                                className={`w-6 h-6 md:w-9 md:h-9 flex items-center justify-center rounded-md md:rounded-lg transition-all ${item.quantity <= 1 || item.isOutOfStock ? 'text-[var(--text-muted)] cursor-not-allowed' : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-accent)]'}`}
                            >
                                <Minus size={12} className="md:w-4 md:h-4" strokeWidth={2.5} />
                            </button>
                            <span className="w-6 md:w-8 text-center text-xs md:text-base font-bold text-[var(--text-primary)]">{item.quantity}</span>
                            <button
                                onClick={() => handleUpdateQuantity(item.variant, item.quantity + 1)}
                                disabled={item.isOutOfStock || item?.message?.startsWith("Only")}
                                className={`w-6 h-6 md:w-9 md:h-9 flex items-center justify-center rounded-md md:rounded-lg transition-all ${item.isOutOfStock || item?.message?.startsWith("Only") ? 'text-[var(--text-muted)] cursor-not-allowed' : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-accent)]'}`}
                            >
                                <Plus size={12} className="md:w-4 md:h-4" strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Price & Delete Button */}
                        <div className="flex items-center gap-2 md:gap-4 shrink-0">
                            <div className="text-right hidden sm:block">
                                <p className="text-[8px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-0.5">Subtotal</p>
                                <p className="text-xs md:text-base font-bold text-[var(--color-accent)]">₹{item.current_price} <span className="text-[8px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-0.5">/pc</span></p>
                            </div>
                            <button
                                onClick={() => handleRemove(item.variant)}
                                className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                                title="Remove item"
                            >
                                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartCard;