import React, { useState } from 'react';
import { useSelector } from "react-redux"
import CheckoutModal from './CheckoutModal';

import { ArrowLeft, Tag } from "lucide-react";
const CartSummery = () => {
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const totalMrp = useSelector((state) => state.cart.totalMrp);
    const totalDiscountPercent = useSelector((state) => state.cart.totalDiscountPercent);
    const finalAmount = useSelector((state) => state.cart.finalAmount);
    const taxAmount = useSelector((state) => state.cart.taxAmount);
    const shipingCharge = useSelector((state) => state.cart.shipingCharge);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    return (
        <div className="lg:col-span-4 lg:sticky lg:top-24 bg-[var(--color-background)] rounded-[2.5rem] p-2 shadow-2xl shadow-black/10 transition-colors duration-500">
            <div className="bg-[var(--color-primary)] rounded-[2rem] shadow-xl shadow-black/5 p-6 md:p-8 border border-[var(--border-subtle)] overflow-hidden relative h-full">
                {/* Decorative elements */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl opacity-50"></div>

                <div className="relative">
                    <h2 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] mb-6 md:mb-8 flex items-center gap-2">
                        Summary
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                    </h2>

                    {/* Coupon Section */}
                    <div className="mb-8">
                        <label className="block text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase mb-3 ml-1">Promotional Code</label>
                        <div className="flex gap-2 p-1.5 bg-[var(--color-background)] rounded-2xl border border-[var(--border-subtle)] focus-within:border-[var(--color-accent)]/50 focus-within:bg-[var(--color-primary)] transition-all">
                            <div className="relative flex-1">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className="w-full pl-10 pr-2 py-2 bg-transparent text-sm font-semibold text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-muted)]"
                                />
                            </div>
                            <button className="px-5 py-2 bg-[var(--text-primary)] text-[var(--color-primary)] rounded-xl text-sm font-bold hover:bg-[var(--color-accent)] hover:text-black transition-all active:scale-95 shadow-md">
                                Apply
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-[var(--text-secondary)] font-medium">
                            <span className="text-sm md:text-base">Subtotal</span>
                            <span className="text-[var(--text-primary)] font-bold">₹{totalPrice}</span>
                        </div>
                        <div className="flex justify-between items-center text-[var(--text-secondary)] font-medium">
                            <span className="text-sm md:text-base">Shipping</span>
                            <span className="text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-lg text-xs">{shipingCharge === 0 ? "FREE" : `₹${shipingCharge}`}</span>
                        </div>
                        <div className="flex justify-between items-center text-[var(--text-secondary)] font-medium">
                            <span className="text-sm md:text-base">Tax Estimate</span>
                            <span className="text-[var(--text-primary)] font-bold">₹{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="pt-6 mt-6 border-t border-dashed border-[var(--border-subtle)] flex justify-between items-center flex-wrap gap-4 ">
                            <div className="flex flex-col">
                                <span className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Total Mrp</span>
                                <span className="text-2xl md:text-3xl font-black text-gray-600 mt-1 line-through">₹{totalMrp}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Discount Percentage</span>
                                <span className="text-2xl md:text-2xl font-black text-green-500 mt-1 ">{totalDiscountPercent.toFixed(2)}%</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Total Amount</span>
                                <span className="text-2xl md:text-3xl font-black text-[var(--color-accent)] mt-1 ">₹{finalAmount.toFixed(2)}</span>
                            </div>



                        </div>
                    </div>

                    <button onClick={() => setIsCheckoutModalOpen(true)} className="w-full py-4 md:py-5 bg-[var(--color-accent)] text-black rounded-2xl md:rounded-[1.25rem] font-bold text-base md:text-lg shadow-xl shadow-[var(--color-accent)]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group active:scale-[0.98]">
                        Proceed to Checkout
                        <ArrowLeft size={22} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-[var(--color-background)] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border border-[var(--border-subtle)]">
                            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-[8px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter text-center">Secure Payment</span>
                        </div>
                        <div className="bg-[var(--color-background)] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border border-[var(--border-subtle)]">
                            <div className="w-6 h-6 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-[var(--color-accent)] rounded-full"></div>
                            </div>
                            <span className="text-[8px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter text-center">Fast Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <CheckoutModal 
                isOpen={isCheckoutModalOpen} 
                onClose={() => setIsCheckoutModalOpen(false)} 
            />
        </div>
    )
}

export default CartSummery