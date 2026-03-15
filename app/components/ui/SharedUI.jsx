'use client';
import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

/* ============ Card ============ */
export function Card({ children, className = '', style, ...props }) {
  return (
    <section
      className={`glass-panel ${className}`}
      style={{ padding: '24px', ...style }}
      {...props}
    >
      {children}
    </section>
  );
}

/* ============ Slider ============ */
export function Slider({ label, value, min, max, step, onChange, format, suggestion, id: customId }) {
  const autoId = useId();
  const id = customId || autoId;
  const percentage = ((value - min) / (max - min)) * 100;

  const handleInputChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(Math.min(max, Math.max(min, val)));
    }
  };

  return (
    <div style={{ marginBottom: '20px' }} role="group" aria-labelledby={`${id}-label`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label id={`${id}-label`} htmlFor={`${id}-input`} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted)' }}>
          {label}
        </label>
        <input
          id={`${id}-input`}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleInputChange}
          aria-label={`${label} value`}
          style={{
            width: '100px', textAlign: 'right', padding: '4px 8px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '8px', color: 'var(--text)', fontWeight: 600,
            fontSize: '0.95rem', fontFamily: 'inherit',
          }}
        />
      </div>
      <input
        id={`${id}-range`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={format ? format(value) : String(value)}
        style={{
          background: `linear-gradient(to right, var(--primary) ${percentage}%, var(--track-bg) ${percentage}%)`,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: 'var(--muted)' }}>
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
      {suggestion && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '6px', fontWeight: 500 }}
          role="status"
          aria-live="polite"
        >
          💡 {suggestion}
        </motion.p>
      )}
    </div>
  );
}

/* ============ InfoTooltip ============ */
export function InfoTooltip({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '16px', marginTop: '12px',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)',
          fontWeight: 600, fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <Info size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        {title}
        <span style={{ marginLeft: 'auto' }}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>
              {children}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ FormulaExplainer ============ */
export function FormulaExplainer({ title, steps }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '16px', marginTop: '12px',
    }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)',
          fontWeight: 600, fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        📐 {title}
        <span style={{ marginLeft: 'auto' }}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <ol style={{ marginTop: '12px', paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.8 }}>
              {steps.map((step, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--text)' }}>{step.label}:</strong>{' '}
                  <code style={{ background: 'var(--background)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {step.formula}
                  </code>
                  {step.result && (
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}> = {step.result}</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ Disclaimer ============ */
export function Disclaimer() {
  return (
    <footer className="disclaimer-bar" role="contentinfo">
      <p>
        <strong>Disclaimer:</strong> This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
      </p>
    </footer>
  );
}

/* ============ ResultCard ============ */
export function ResultCard({ label, value, highlight, accent }) {
  return (
    <Card
      style={{
        textAlign: 'center',
        borderColor: highlight ? 'var(--primary)' : undefined,
        boxShadow: highlight ? '0 0 0 1px var(--primary), var(--card-shadow)' : undefined,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {highlight && (
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '80px', height: '80px',
          background: 'radial-gradient(circle, rgba(34,76,135,0.15), transparent)',
          filter: 'blur(20px)', pointerEvents: 'none',
        }} />
      )}
      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500, marginBottom: '4px' }}>{label}</p>
      <p className="animate-number" style={{
        fontSize: '1.5rem', fontWeight: 700,
        color: accent === 'success' ? 'var(--success)' : accent === 'danger' ? 'var(--danger)' : highlight ? 'var(--primary)' : 'var(--text)',
      }}>
        {value}
      </p>
    </Card>
  );
}
