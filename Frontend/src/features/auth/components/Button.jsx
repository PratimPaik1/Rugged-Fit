import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "w-full py-4 px-8 rounded-xl font-bold uppercase tracking-[0.15em] transition-all duration-300 flex justify-center items-center focus:outline-none btn-shine";
  
  const variants = {
    primary: "bg-primary text-black hover:scale-[1.02] shadow-primary hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-white/5 text-white border border-white/10 hover:border-white/30 hover:bg-white/10 active:scale-95",
    ghost: "bg-transparent text-text-secondary hover:text-primary active:scale-95 text-xs tracking-widest"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
