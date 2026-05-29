import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../app/ThemeContext";
import { Zap, Search, ShoppingCart, User, LogIn, Moon, Sun, Menu, X } from "lucide-react";
import Button from "./Button";
import { useSelector } from "react-redux"
import { useAuth } from "../../auth/hooks/useAuth";

const Navbar = () => {
    const { isDark, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = useSelector((state) => state.auth.user)
    const cart = useSelector((state) => state.cart.cart) || []
    const cartCount = Array.isArray(cart) ? cart.reduce((total, item) => total + item.quantity, 0) : 0
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    return (
        <nav className="sticky top-0 z-[100] w-full bg-[var(--color-primary)] border-b border-[var(--border-subtle)] transition-all duration-500 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <span className="text-black font-bold text-xs">RF</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">RUGGED<span className="text-[var(--text-secondary)]">FIT</span></span>
                    </Link>

                    {/* Nav Links - Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className={`text-sm font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-all pb-1 border-b-2 ${currentPath === '/' ? 'text-[var(--text-primary)] border-[var(--color-accent)]' : 'text-[var(--text-secondary)] border-transparent'}`}>Home</Link>
                        {user?.role !== "seller" && <Link to="/store" className={`text-sm font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-all pb-1 border-b-2 ${currentPath === '/store' ? 'text-[var(--text-primary)] border-[var(--color-accent)]' : 'text-[var(--text-secondary)] border-transparent'}`}>Store</Link>}
                        {user && user.role !== "seller" && <Link to="/orders" className={`text-sm font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-all pb-1 border-b-2 ${currentPath === '/orders' ? 'text-[var(--text-primary)] border-[var(--color-accent)]' : 'text-[var(--text-secondary)] border-transparent'}`}>Orders</Link>}
                        <Link to="#" className={`text-sm font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-all pb-1 border-b-2 ${currentPath === '/community' ? 'text-[var(--text-primary)] border-[var(--color-accent)]' : 'text-[var(--text-secondary)] border-transparent'}`}>Community</Link>
                        {user?.role === "seller" && <Link to="/dashboard" className={`text-sm font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-all pb-1 border-b-2 ${currentPath.startsWith('/dashboard') ? 'text-[var(--text-primary)] border-[var(--color-accent)]' : 'text-[var(--text-secondary)] border-transparent'}`}>Seller Dashboard</Link>}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={(e) => toggleTheme(e)}
                            className="text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-colors p-2 rounded-xl hover:bg-[var(--border-subtle)]"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button className="hidden sm:flex text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-colors p-2 rounded-xl hover:bg-[var(--border-subtle)]">
                            <Search size={18} />
                        </button>

                        {(user?.role === "buyer" || !user) && (
                            <div className={`relative flex items-center h-16 border-b-2 transition-all ${currentPath === '/cart' ? 'border-[var(--color-accent)]' : 'border-transparent'}`}>
                                <button
                                    className={`p-2 rounded-xl transition-colors ${currentPath === '/cart' ? 'text-[var(--text-primary)] bg-[var(--color-accent)]/10' : 'text-[var(--text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--border-subtle)]'}`}
                                    onClick={() => navigate("/cart")}
                                >
                                    <ShoppingCart size={20} />
                                    {cartCount > 0 && (
                                        <span className="absolute top-2 right-1 w-4 h-4 bg-[var(--color-accent)] text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[var(--color-primary)]">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="hidden md:flex items-center gap-3 ml-2">
                            <div className="h-6 w-px bg-[var(--border-subtle)] mx-1" />
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden lg:block">
                                        <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">{user.fullname}</p>
                                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tighter">{user.role}</p>
                                    </div>
                                    <Link to={user.role === 'seller' ? '/dashboard' : '/profile'} className="w-9 h-9 bg-[var(--color-background)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-center hover:border-[var(--color-accent)] transition-all shadow-sm">
                                        <User size={18} className="text-[var(--text-secondary)]" />
                                    </Link>
                                    <div>
                                        <Button className="flex items-center gap-2 py-2 px-5 text-sm rounded-xl" onClick={handleLogout}>
                                            <LogIn size={18} />
                                            <span>Sign Out</span>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login">
                                    <Button className="flex items-center gap-2 py-2 px-5 text-sm rounded-xl">
                                        <LogIn size={18} />
                                        <span>Sign In</span>
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Hamburger Menu - Mobile */}
                        <button
                            className="md:hidden text-[var(--text-primary)] p-2 hover:bg-[var(--border-subtle)] rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 top-[64px] z-[90] md:hidden flex items-center justify-center bg-black/40 backdrop-blur-md transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                {/* Menu content */}
                <div className={`relative flex flex-col p-6 space-y-4 bg-white/5 backdrop-blur-lg border border-[var(--border-subtle)] rounded-xl max-w-sm w-11/12 mx-auto my-4 shadow-2xl transition-transform duration-300 ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
                    <button className="self-end p-2 rounded-full hover:bg-[var(--border-subtle)] transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <X size={20} className="text-[var(--text-primary)]" />
                    </button>
                    <Link
                        to="/"
                        className={`text-xl font-black tracking-widest p-4 rounded-2xl border transition-all ${currentPath === '/' ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/20' : 'bg-[var(--color-primary)] text-[var(--text-primary)] border-[var(--border-subtle)]'}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        HOME
                    </Link>
                    {user?.role !== "seller" && <Link
                        to="/store"
                        className={`text-xl font-black tracking-widest p-4 rounded-2xl border transition-all ${currentPath === '/store' ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/20' : 'bg-[var(--color-primary)] text-[var(--text-primary)] border-[var(--border-subtle)]'}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        STORE
                    </Link>}
                    {user && user.role !== "seller" && <Link
                        to="/orders"
                        className={`text-xl font-black tracking-widest p-4 rounded-2xl border transition-all ${currentPath === '/orders' ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/20' : 'bg-[var(--color-primary)] text-[var(--text-primary)] border-[var(--border-subtle)]'}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        MY ORDERS
                    </Link>}
                    <Link
                        to="#"
                        className={`text-xl font-black tracking-widest p-4 rounded-2xl border transition-all ${currentPath === '/community' ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/20' : 'bg-[var(--color-primary)] text-[var(--text-primary)] border-[var(--border-subtle)]'}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        COMMUNITY
                    </Link>
                    {user?.role === "seller" && <Link
                        to="/dashboard"
                        className={`text-xl font-black tracking-widest p-4 rounded-2xl border transition-all ${currentPath.startsWith('/dashboard') ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/20' : 'bg-[var(--color-primary)] text-[var(--text-primary)] border-[var(--border-subtle)]'}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        SELLER DASHBOARD
                    </Link>}
                    {user ? <div>
                        <button className="flex items-center gap-2 py-2 px-5 justify-start text-sm rounded-xl w-full bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20" onClick={handleLogout}>
                            <LogIn size={18} />
                            <span className="text-xl ">Sign Out</span>
                        </button>
                    </div> : null}

                    <div className="pt-6">
                        {user ? (
                            <Link
                                to={user.role === 'seller' ? '/dashboard' : '/profile'}
                                className="flex items-center gap-4 p-4 bg-[var(--color-primary)] rounded-3xl border border-[var(--border-subtle)] shadow-sm active:scale-[0.98] transition-transform"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="w-14 h-14 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20">
                                    <User size={28} className="text-black" />
                                </div>
                                <div>
                                    <p className="font-extrabold text-[var(--text-primary)] text-lg leading-tight">{user.fullname}</p>
                                    <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mt-1">{user.role}</p>
                                </div>
                            </Link>

                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full py-5 text-xl font-black rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl">
                                    <LogIn size={24} />
                                    <span>SIGN IN</span>
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Theme Toggle in Mobile Menu */}
                    <div className="pt-8 flex justify-center">
                        <button
                            onClick={(e) => toggleTheme(e)}
                            className="flex items-center gap-3 px-6 py-3 bg-[var(--color-primary)] rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold text-sm shadow-sm"
                        >
                            {isDark ? <Sun size={18} className="text-[var(--color-accent)]" /> : <Moon size={18} className="text-[var(--color-accent)]" />}
                            <span>SWITCH TO {isDark ? 'LIGHT' : 'DARK'} MODE</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
