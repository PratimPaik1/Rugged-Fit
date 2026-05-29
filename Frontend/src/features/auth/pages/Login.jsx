import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import AuthLayout from "../components/AuthLayout";
import Input from "../../products/components/Input";
import Button from "../../products/components/Button";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";
import { useAuth } from "../hooks/useAuth";
import loginBG from "../../assets/ruggedfit_hero.png";

const Login = () => {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
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
        identifier: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.identifier || !formData.password) {
            toast.error("Please provide both email and password.");
            return;
        }

        try {
            setLoading(true);
            const res = await handleLogin(formData);

            if (res.user?.role === "seller") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
            toast.success("Login successful!");

        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue"
            visualImage={loginBG}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                    <Input
                        label="Email or Contact"
                        name="identifier"
                        placeholder="john@example.com"
                        value={formData.identifier}
                        onChange={handleChange}
                        required
                    />

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
                        <div className="flex justify-end">
                            <Link
                                to="#"
                                className="text-xs font-medium text-[var(--color-accent-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full text-base py-2"
                    >
                        Sign In
                    </Button>
                </div>
            </form>

            <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--border-strong)]" />
                <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">OR</span>
                <div className="h-px flex-1 bg-[var(--border-strong)]" />
            </div>

            <ContinueWithGoogle />

            <div className="mt-4 text-center pt-3 border-t border-[var(--border-subtle)]">
                <p className="text-sm text-[var(--text-secondary)]">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-semibold text-[var(--text-primary)] hover:text-[var(--color-accent)] transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    Are you a seller?{' '}
                    <Link
                        to="/register-seller"
                        className="font-medium text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-colors underline"
                    >
                        Create a seller account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;