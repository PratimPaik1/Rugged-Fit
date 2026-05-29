import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import AuthLayout from "../components/AuthLayout";
import Input from "../../products/components/Input";
import Button from "../../products/components/Button";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import { useAuth } from "../hooks/useAuth";
import registerBG from "../../assets/ruggedfit_hero.png"; // You might want a different BG for sellers later

const RegisterSeller = () => {
    const navigate = useNavigate();
    const { handleRegister } = useAuth();
    const { user } = useSelector((state) => state.auth);

    React.useEffect(() => {
        if (user) {
            if (user.role === "seller") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        contact: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, color: "bg-[var(--border-subtle)]", label: "Empty" };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1) return { strength: 25, color: "bg-red-500", label: "Weak" };
        if (score <= 3) return { strength: 60, color: "bg-[var(--color-accent)]", label: "Good" };
        return { strength: 100, color: "bg-green-500", label: "Strong" };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullname.trim()) newErrors.fullname = "Company/Full name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.contact) newErrors.contact = "Contact number is required";
        else if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = "10-digit number required";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8) newErrors.password = "Minimum 8 characters required";

        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        const firstError = Object.values(newErrors)[0];
        if (firstError) toast.error(firstError);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            const { confirmPassword, ...payload } = formData;
            // Registering as a seller
            await handleRegister({ ...payload, isSeller: true });
            toast.success("Seller account created successfully. Welcome!");
            navigate("/login");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Become a Seller"
            subtitle="Start selling your fitness products today"
            visualImage={registerBG}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                    <Input
                        label="Company or Full Name"
                        name="fullname"
                        placeholder="Fitness Gear Inc."
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            label="Business Email"
                            name="email"
                            type="email"
                            placeholder="sales@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Contact Number"
                            name="contact"
                            placeholder="0123456789"
                            value={formData.contact}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        {/* Password Strength Indicator */}
                        <div className="flex items-center justify-between px-1">
                            <div className="flex-1 h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden mr-4">
                                <div
                                    className={`h-full transition-all duration-500 ease-out ${passwordStrength.color}`}
                                    style={{ width: `${passwordStrength.strength}%` }}
                                />
                            </div>
                            <span className={`text-[10px] font-medium transition-opacity duration-300 ${formData.password ? 'opacity-100 text-[var(--text-secondary)]' : 'opacity-0'}`}>
                                {passwordStrength.label}
                            </span>
                        </div>
                    </div>

                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full text-base py-2 bg-[#0F172A] text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white border-none"
                    >
                        Create Seller Account
                    </Button>
                </div>
            </form>

            <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--border-strong)]" />
                <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">OR</span>
                <div className="h-px flex-1 bg-[var(--border-strong)]" />
            </div>

            <ContinueWithGoogle isSeller={true} />

            <div className="mt-4 text-center pt-3 border-t border-[var(--border-subtle)]">
                <p className="text-sm text-[var(--text-secondary)]">
                    Already a seller?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-[var(--text-primary)] hover:text-[var(--color-accent)] transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    Not selling?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-colors underline"
                    >
                        Create a standard account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default RegisterSeller;
