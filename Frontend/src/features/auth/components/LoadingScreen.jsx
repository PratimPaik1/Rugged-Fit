import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0F172A]">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-accent)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative flex flex-col items-center">
        {/* Logo Animation */}
        <div className="mb-8 relative">
          <div className="text-5xl font-black tracking-tighter text-white flex items-center gap-1">
            <span className="relative">
              Rugged
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[var(--color-accent)] rounded-full animate-width-grow"></span>
            </span>
            <span className="text-[var(--color-accent)] italic">FIT</span>
          </div>

          {/* Animated rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/5 rounded-full animate-ping-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full animate-ping-slower"></div>
        </div>

        {/* Loading status */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce"></div>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 ml-1">
            Initializing System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
