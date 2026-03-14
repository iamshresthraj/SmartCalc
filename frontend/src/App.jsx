import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  PiggyBank, 
  Target, 
  TrendingDown, 
  BarChart4,
  ArrowRight,
  Sun,
  Moon,
  Calculator,
  Binary,
  GraduationCap
} from 'lucide-react';

// Import modules
import SIPSimulator from './components/SIPSimulator';
import LumpSumCalculator from './components/LumpSumCalculator';
import GoalPlanner from './components/GoalPlanner';
import InflationCalculator from './components/InflationCalculator';
import ExpenseRatioSimulator from './components/ExpenseRatioSimulator';
import BasicCalculator from './components/BasicCalculator';
import ScientificCalculator from './components/ScientificCalculator';

const modules = [
  { id: 'sip', title: 'SIP Growth Simulator', icon: TrendingUp, desc: 'See how small monthly investments grow exponentially', component: SIPSimulator },
  { id: 'lumpsum', title: 'Lump Sum Investment', icon: PiggyBank, desc: 'Watch a one-time investment compound over years', component: LumpSumCalculator },
  { id: 'goal', title: 'Financial Goal Planner', icon: Target, desc: 'Calculate exactly what you need to invest for your dreams', component: GoalPlanner },
  { id: 'inflation', title: 'Inflation Impact', icon: TrendingDown, desc: 'Understand how inflation eats away purchasing power', component: InflationCalculator },
  { id: 'expense', title: 'Expense Ratio Impact', icon: BarChart4, desc: 'Discover how tiny fees destroy massive wealth over time', component: ExpenseRatioSimulator },
  { id: 'basic', title: 'Basic Calculator', icon: Calculator, desc: 'A simple, fast calculator for daily math', component: BasicCalculator },
  { id: 'scientific', title: 'Scientific Calculator', icon: Binary, desc: 'Advanced math functions & history for power users', component: ScientificCalculator },
];

function App() {
  const [activeModule, setActiveModule] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const ActiveComponent = activeModule ? modules.find(m => m.id === activeModule)?.component : null;

  return (
    <div className="min-h-screen bg-background text-text selection:bg-primary/30 font-sans flex flex-col items-center transition-colors duration-300">
      
      {/* Header */}
      <header className="w-full max-w-6xl p-6 flex justify-between items-center z-10">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => setActiveModule(null)}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <GraduationCap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text to-muted">
            SmartCalc
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-surface hover:bg-text/5 border border-text/10 transition-colors text-muted hover:text-text"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {activeModule && (
            <button 
              onClick={() => setActiveModule(null)}
              className="px-4 py-2 rounded-lg bg-surface hover:bg-text/5 border border-text/10 transition-colors flex items-center gap-2 text-sm text-muted hover:text-text"
            >
              ← Back to Menu
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl p-6 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {!activeModule ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center py-12"
            >
              <div className="text-center max-w-2xl mb-16">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl font-bold mb-6 text-text"
                >
                  Understand how your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">money grows.</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-muted"
                >
                  Interactive financial learning calculators for the real world. No spreadsheets required.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {modules.map((mod, i) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.3 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveModule(mod.id)}
                    className="glass-panel p-6 cursor-pointer group hover:border-primary/50 hover:shadow-primary/20 transition-all duration-300"
                  >
                    <div className="bg-surface border border-text/5 p-3 rounded-xl inline-block mb-4 text-secondary group-hover:text-primary transition-colors">
                      <mod.icon size={28} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-text">{mod.title}</h3>
                    <p className="text-sm text-muted mb-6">{mod.desc}</p>
                    <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-2 transition-transform duration-300">
                      Explore Simulator <ArrowRight size={16} className="ml-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="module"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex-1"
            >
              <ActiveComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}

export default App;
