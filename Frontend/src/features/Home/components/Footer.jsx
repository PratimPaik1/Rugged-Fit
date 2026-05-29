import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[var(--color-accent-secondary)] dark:bg-[#090E1A] text-[var(--color-primary)] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Zap className="text-white" fill="currentColor" />
                    <span className="text-2xl font-bold text-white tracking-tighter uppercase">RUGGED<span className="opacity-60 italic">FIT</span></span>
                </div>
                <p className="opacity-60 text-sm max-w-md mx-auto mb-8 text-white">
                    The ultimate destination for premium fitness apparel and equipment. Join our community and elevate your training.
                </p>
                <div className="flex justify-center gap-8 mb-12 text-white">
                    <Link to="#" className="opacity-60 hover:opacity-100 hover:text-[var(--color-accent)] transition-all uppercase text-xs font-bold tracking-widest">Privacy Policy</Link>
                    <Link to="#" className="opacity-60 hover:opacity-100 hover:text-[var(--color-accent)] transition-all uppercase text-xs font-bold tracking-widest">Terms of Service</Link>
                    <Link to="#" className="opacity-60 hover:opacity-100 hover:text-[var(--color-accent)] transition-all uppercase text-xs font-bold tracking-widest">Contact Us</Link>
                </div>
                <p className="opacity-30 text-[10px] uppercase tracking-widest font-bold text-white">
                    © 2024 RuggedFit Apparel Co. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
