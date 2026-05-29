import React from "react";
import { Zap, Shield, ShoppingBag } from "lucide-react";

const Features = () => {
    return (
        <section className="py-16 border-t border-[var(--border-subtle)] bg-[var(--color-background)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center space-y-4 transform hover:scale-105 transition-transform duration-300">
                        <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-sm border border-[var(--border-subtle)]">
                            <Zap size={20} className="text-[var(--color-accent)]" />
                        </div>
                        <h4 className="font-bold text-base">Fast Delivery</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Get your gear delivered within 48 hours in major cities.</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4 transform hover:scale-105 transition-transform duration-300">
                        <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-sm border border-[var(--border-subtle)]">
                            <Shield size={20} className="text-[var(--color-accent)]" />
                        </div>
                        <h4 className="font-bold text-base">Secure Payment</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Multiple secure payment options for a worry-free experience.</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4 transform hover:scale-105 transition-transform duration-300">
                        <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-sm border border-[var(--border-subtle)]">
                            <ShoppingBag size={20} className="text-[var(--color-accent)]" />
                        </div>
                        <h4 className="font-bold text-base">Easy Returns</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Not satisfied? Return your products within 30 days easily.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
