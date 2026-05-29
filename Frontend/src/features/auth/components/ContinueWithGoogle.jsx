import React from 'react'

const ContinueWithGoogle = ({ isSeller = false }) => {
    const authUrl = isSeller ? "/api/auth/google?role=seller" : "/api/auth/google";

    return (
        <div className="w-full">
            {/* Google Button */}
            <a
                href={authUrl}
                className="group w-full flex items-center justify-center gap-4 py-3 rounded-xl 
                bg-white text-black font-bold border border-zinc-200
                transition-all duration-300
                hover:bg-zinc-50 active:scale-[0.98]"
            >
                {/* Google Icon */}
                <svg
                    viewBox="0 0 48 48"
                    className="shrink-0"
                    width="18"
                    height="18"
                >
                    <path fill="#EA4335" d="M24 9.5c3.94 0 7.48 1.36 10.26 4.02l7.65-7.65C36.88 2.18 30.87 0 24 0 14.62 0 6.44 5.38 2.53 13.22l8.9 6.91C13.49 13.44 18.29 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.5 24.5c0-1.7-.15-3.33-.43-4.9H24v9.28h12.7c-.55 2.96-2.24 5.47-4.77 7.15l7.34 5.7C43.92 37.52 46.5 31.54 46.5 24.5z" />
                    <path fill="#FBBC05" d="M11.43 28.13c-.48-1.44-.75-2.98-.75-4.63s.27-3.19.75-4.63l-8.9-6.91C.91 15.17 0 19.49 0 24s.91 8.83 2.53 12.04l8.9-6.91z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.79l-7.34-5.7c-2.04 1.37-4.66 2.18-8.55 2.18-5.71 0-10.51-3.94-12.57-9.23l-8.9 6.91C6.44 42.62 14.62 48 24 48z" />
                </svg>

                <span className="text-sm font-semibold tracking-tight">
                    Continue with Google
                </span>
            </a>
        </div>
    )
}

export default ContinueWithGoogle