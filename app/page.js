'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ArrowUpCircle, Target, Landmark,
  ArrowRight, Sun, Moon, GraduationCap,
} from 'lucide-react';
import { Disclaimer } from './components/ui/SharedUI';

import SIPCalculator from './components/SIPCalculator';
import SWPCalculator from './components/SWPCalculator';
import TopUpSIPCalculator from './components/TopUpSIPCalculator';
import GoalBasedCalculator from './components/GoalBasedCalculator';
import RetirementCalculator from './components/RetirementCalculator';

const modules = [
  { id: 'sip', title: 'SIP Calculator', icon: TrendingUp, desc: 'Calculate how regular monthly investments grow over time through compounding.', component: SIPCalculator },
  { id: 'swp', title: 'SWP Calculator', icon: TrendingDown, desc: 'Plan systematic withdrawals from your corpus while it continues to earn returns.', component: SWPCalculator },
  { id: 'topup', title: 'Top-Up SIP Calculator', icon: ArrowUpCircle, desc: 'See how increasing your SIP annually can dramatically accelerate wealth creation.', component: TopUpSIPCalculator },
  { id: 'goal', title: 'Goal-Based Calculator', icon: Target, desc: 'Find the exact monthly SIP needed to reach any financial goal, adjusted for inflation.', component: GoalBasedCalculator },
  { id: 'retirement', title: 'Retirement Planner', icon: Landmark, desc: 'Plan your retirement corpus and calculate the SIP needed to get there.', component: RetirementCalculator },
];

export default function Home() {
  const [activeModule, setActiveModule] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const ActiveComponent = activeModule ? modules.find(m => m.id === activeModule)?.component : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'background 0.3s' }}>
      {/* ===== Header ===== */}
      <header style={{ width: '100%', maxWidth: '1200px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} role="banner">
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => setActiveModule(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActiveModule(null)}
          aria-label="Go to home page"
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #224c87, #da3832)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(34,76,135,0.3)',
          }}>
            <GraduationCap size={22} color="white" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
            SmartCalc
          </h1>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }} aria-label="Main navigation">
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              padding: '8px', borderRadius: '10px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              cursor: 'pointer', color: 'var(--muted)', display: 'flex',
              transition: 'all 0.2s',
            }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {activeModule && (
            <button
              onClick={() => setActiveModule(null)}
              aria-label="Back to calculator menu"
              style={{
                padding: '8px 16px', borderRadius: '10px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                cursor: 'pointer', color: 'var(--muted)', fontSize: '0.85rem',
                fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              ← Back to Menu
            </button>
          )}
        </nav>
      </header>

      {/* ===== Main Content ===== */}
      <main style={{ width: '100%', maxWidth: '1200px', padding: '0 24px 40px', flex: 1 }} role="main">
        <AnimatePresence mode="wait">
          {!activeModule ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '48px' }}
            >
              {/* Hero */}
              <section style={{ textAlign: 'center', maxWidth: '680px', marginBottom: '48px' }} aria-label="Introduction">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text)', lineHeight: 1.2, letterSpacing: '-1px' }}
                >
                  Understand how your{' '}
                  <span style={{ color: '#224c87' }}>financial future</span>{' '}
                  takes <span style={{ color: '#da3832' }}>shape.</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.6 }}
                >
                  Interactive financial calculators built for learning. Explore how compounding, inflation, and systematic investing work — no spreadsheets, no sales pitch.
                </motion.p>
              </section>

              {/* Module Grid */}
              <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', width: '100%' }} aria-label="Calculator modules">
                {modules.map((mod, i) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i + 0.3 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveModule(mod.id)}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveModule(mod.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open ${mod.title}`}
                    className="glass-panel"
                    style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.3s' }}
                  >
                    <div style={{
                      background: 'var(--surface-hover)', border: '1px solid var(--border)',
                      padding: '10px', borderRadius: '12px', display: 'inline-flex',
                      marginBottom: '16px', color: '#224c87',
                    }}>
                      <mod.icon size={26} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>{mod.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '20px', lineHeight: 1.5 }}>{mod.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#224c87' }}>
                      Explore Calculator <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                    </div>
                  </motion.div>
                ))}
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="module"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ width: '100%' }}
            >
              <ActiveComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer Disclaimer */}
      <Disclaimer />
    </div>
  );
}
