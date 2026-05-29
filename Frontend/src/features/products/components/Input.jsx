import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, name, textarea = false, rows = 4, className = '', helperText = '' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const currentType = isPasswordType && showPassword ? 'text' : type;

  const inputStyles = `w-full px-4 py-2.5 bg-[var(--color-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all duration-300 text-sm ${className} ${isPasswordType ? 'pr-10' : ''}`;

  return (
    <div className="w-full space-y-1.5 group">
      {label && (
        <div className="flex justify-between items-end">
          <label className="text-sm font-medium text-[var(--text-primary)]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {helperText && <span className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">{helperText}</span>}
        </div>
      )}
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputStyles}
        />
      ) : (
        <div className="relative">
          <input
            type={currentType}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={inputStyles}
          />
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
