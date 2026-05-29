import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = 'text', error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className={`flex flex-col mb-4 w-full ${props.className || ""}`}>
      {label && (
        <label className="mb-2 text-xs font-bold text-text-secondary tracking-[0.1em] uppercase ml-1">
          {label}
        </label>
      )}
      <div className="relative w-full group">
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`w-full bg-black/60 border ${
            error ? 'border-red-500/50' : 'border-white/10'
          } rounded-xl px-5 py-3.5 text-white placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/50
          transition-all duration-300 font-medium`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-red-500 text-[10px] font-bold mt-1.5 uppercase tracking-wider ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
