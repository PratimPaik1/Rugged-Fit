import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowRight, Shield, Award } from "lucide-react";
import Button from "./Button";
import { useSelector } from "react-redux";

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop",
];

const testimonials = [
    {
        quote: "The gear that moves with you.",
        name: "Alex Rivera",
        role: "Pro Athlete"
    },
    {
        quote: "Built for performance and comfort.",
        name: "Jordan Lee",
        role: "Fitness Coach"
    },
    {
        quote: "RuggedFit changed my training game.",
        name: "Sam Carter",
        role: "Gym Trainer"
    },
    {
        quote: "Unmatched quality and durability.",
        name: "Chris Nolan",
        role: "Strength Trainer"
    },
    {
        quote: "Feels like a second skin during workouts.",
        name: "Taylor Brooks",
        role: "CrossFit Athlete"
    }
];

const Hero = () => {
    const user = useSelector((state) => state.auth.user);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
                setIsTransitioning(false);
            }, 50); // fade-out duration
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-accent)]/5 skew-x-12 -z-10 translate-x-32 hidden lg:block" />
            <div className="absolute -top-24 -left-24 w-64 h-64 sm:w-96 sm:h-96 bg-[var(--color-accent)]/10 rounded-full blur-[80px] sm:blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 flex-col-reverse">
                    {/* Left — Text */}
                    <div className="flex-1 text-center lg:text-left space-y-6 sm:space-y-8 animate-fade-in order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent)]/10 rounded-full border border-[var(--border-subtle)]">
                            <Zap size={12} className="text-[var(--color-accent)]" />
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                                New Collection • {new Date().toLocaleString("en-US", { month: "long" })}
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-[var(--text-primary)] leading-[0.9]">
                            PUSH YOUR <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)]">
                                LIMITS.
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto lg:mx-0">
                            Premium performance wear engineered for the modern athlete. Experience unmatched comfort and durability in every thread.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            {user?.role === "seller" ? (
                                <Link to="/dashboard" className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto px-8 py-3.5 text-sm flex items-center justify-center gap-2 group rounded-xl">
                                        Go to Dashboard
                                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/store" className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto px-8 py-3.5 text-sm flex items-center justify-center gap-2 group rounded-xl">
                                        Shop The Drop
                                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-4 sm:pt-8 opacity-40 grayscale">
                            <div className="flex items-center gap-2">
                                <Shield size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Quality</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — Image Slider */}
                    <div className="flex-1 w-full max-w-md lg:max-w-none relative animate-fade-in [animation-delay:200ms] order-1 lg:order-2">
                        <div className="relative z-10 w-full aspect-[4/3] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl">
                            {/* Sliding images */}
                            {HERO_IMAGES.map((src, i) => (
                                <img
                                    key={src}
                                    src={src}
                                    alt={`Fitness model ${i + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    style={{
                                        opacity: i === currentIndex ? (isTransitioning ? 0 : 1) : 0,
                                        transition: "opacity 0.8s ease-in-out",
                                        zIndex: i === currentIndex ? 1 : 0,
                                    }}
                                />
                            ))}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                            {/* Quote card */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 sm:p-6 bg-[var(--color-primary)]/10 backdrop-blur-md rounded-2xl border border-[var(--color-primary)]/20 z-20 overflow-hidden">
                                <div className="relative h-[48px] sm:h-[60px]">
                                    {testimonials.map((t, i) => (
                                        <div
                                            key={i}
                                            className="absolute inset-0 flex flex-col justify-center transition-opacity duration-500"
                                            style={{
                                                opacity: i === currentIndex ? (isTransitioning ? 0 : 1) : 0,
                                                zIndex: i === currentIndex ? 1 : 0,
                                            }}
                                        >
                                            <p className="text-white/60 text-xs sm:text-sm font-medium italic">
                                                "{t.quote}"
                                            </p>
                                            <p className="text-white/50 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
                                                - {t.name}, {t.role}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dot indicators */}
                            <div className="absolute top-4 right-4 flex gap-1.5 z-20">
                                {HERO_IMAGES.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className="rounded-full transition-all duration-300"
                                        style={{
                                            width: i === currentIndex ? "24px" : "8px",
                                            height: "8px",
                                            background: i === currentIndex ? "var(--color-accent)" : "rgba(255,255,255,0.4)",
                                        }}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-[var(--color-accent)] rounded-2xl -z-10 animate-bounce-slow" />
                        <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 border-4 border-[var(--color-accent-secondary)] rounded-full -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
