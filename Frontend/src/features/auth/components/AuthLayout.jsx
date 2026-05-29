import React from "react";

const AuthLayout = ({ children, title, subtitle, visualImage }) => {
  return (
    <div className="dark h-[100vh] flex bg-[var(--color-background)] font-sans selection:bg-[var(--color-accent)] selection:text-black">

      {/* Left Panel: Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--color-primary)] border-r border-[var(--border-subtle)] overflow-hidden items-center justify-center">
        {visualImage ? (
          <img
            src={visualImage}
            alt="Fitness Visual"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
        )}

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 p-12 w-full h-full flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-sm tracking-wider">RF</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
              RUGGED<span className="text-white/80">FIT</span>
            </span>
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl font-bold text-white drop-shadow-md leading-tight">
              Elevate your performance.
            </h2>
            <p className="text-white/80 text-lg drop-shadow">
              The premier marketplace for premium fitness gear, supplements, and accessories.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Form Area */}
      <div className="w-full  lg:w-1/2 flex items-center justify-center p-2 sm:p-8 lg:p-12 relative overflow-y-auto">

        {/* Mobile Brand Header */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden pt-3">
          <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-black font-bold text-xs tracking-wider">RF</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
            RUGGED<span className="text-[var(--text-secondary)]">FIT</span>
          </span>
        </div>

        <div className="w-full max-w-[400px] space-y-4 py-8 pt-15 flex flex-col ">
          <header className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] text-center">
              {title}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] text-center">
              {subtitle}
            </p>
          </header>

          <div className="bg-[var(--color-primary)] border border-[var(--border-subtle)] p-6 rounded-xl shadow-sm">
            {children}
          </div>

          <footer className="text-center text-[10px] text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} RuggedFit. All rights reserved.
          </footer>
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;