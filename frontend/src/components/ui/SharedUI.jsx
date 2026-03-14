import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Card = ({ children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-panel p-6 ${className}`}
  >
    {children}
  </motion.div>
);

export const Slider = ({ label, value, min, max, step, onChange, format = (v) => v, tooltip = "", suggestion = "" }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-3">
        <div>
          <label className="block text-sm font-medium text-muted mb-1 flex items-center gap-1">
            {label}
            {tooltip && (
              <span className="text-muted/60 hover:text-muted cursor-help transition-colors text-xs border border-muted/30 rounded-full w-4 h-4 inline-flex items-center justify-center font-bold" title={tooltip}>
                ?
              </span>
            )}
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const val = e.target.value === '' ? min : Number(e.target.value);
              onChange(val);
            }}
            onBlur={(e) => {
              let val = Number(e.target.value);
              if (val < min) val = min;
              if (val > max) val = max;
              onChange(val);
            }}
            className="w-24 text-right text-xl font-bold text-text bg-surface px-2 py-1 rounded-lg border border-text/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-muted text-sm font-medium">
            {label.includes('%') ? '%' : label.includes('Yrs') || label.includes('Years') ? 'Yrs' : ''}
          </span>
        </div>
      </div>
      
      <div className="relative h-6 flex items-center shrink-0">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full relative z-20 cursor-pointer"
          style={{ 
            background: `linear-gradient(to right, var(--color-primary) ${percentage}%, var(--track-bg) ${percentage}%)` 
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {suggestion && (
          <motion.p 
            key={suggestion}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="mt-2 text-xs font-medium text-secondary flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            Tip: {suggestion}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export const InfoTooltip = ({ title, children }) => (
  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 my-6 flex gap-4">
    <div className="mt-1 text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    </div>
    <div>
      <h4 className="font-semibold text-text mb-1">{title}</h4>
      <p className="text-sm text-muted leading-relaxed">{children}</p>
    </div>
  </div>
);
