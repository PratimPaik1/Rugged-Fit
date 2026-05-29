import React from 'react';

const Button = ({ children, onClick, type = 'button', loading = false, disabled = false, className = '', variant = 'primary' }) => {
  const baseStyles = 'px-6 py-3 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 outline-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm';

  const variants = {
    primary: 'bg-[var(--color-accent)] text-black hover:bg-yellow-500',
    outline: 'bg-[var(--color-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] hover:border-[var(--border-strong)]',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

export default Button;
