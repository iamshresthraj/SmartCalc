import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/SharedUI';
import { Delete, Trash2, History as HistoryIcon, HelpCircle } from 'lucide-react';

const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState([]);

  const handleNumber = (num) => {
    setDisplay(prev => prev === '0' ? String(num) : prev + num);
  };

  const handleOperator = (op) => {
    setDisplay(prev => {
      const lastChar = prev.slice(-1);
      if (['+', '-', '*', '/', '(', ')', '%'].includes(lastChar)) return prev;
      return prev + op;
    });
  };

  const handleFunction = (fn) => {
    try {
      let result;
      const num = parseFloat(display);
      
      switch(fn) {
        case 'sin': result = Math.sin(num); break;
        case 'cos': result = Math.cos(num); break;
        case 'tan': result = Math.tan(num); break;
        case 'sqrt': result = Math.sqrt(num); break;
        case 'log': result = Math.log10(num); break;
        case 'ln': result = Math.log(num); break;
        case 'pow': setDisplay(prev => prev + '**'); return;
        case 'pi': setDisplay(prev => prev === '0' ? String(Math.PI) : prev + Math.PI); return;
        default: return;
      }
      
      const formatted = result.toFixed(4).replace(/\.?0+$/, "");
      setHistory(prev => [{ expression: `${fn}(${display})`, result: formatted }, ...prev].slice(0, 5));
      setDisplay(String(formatted));
    } catch {
      setDisplay('Error');
    }
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(display);
      const formatted = Number.isInteger(result) ? result : result.toFixed(6).replace(/\.?0+$/, "");
      setHistory(prev => [{ expression: display, result: formatted }, ...prev].slice(0, 10));
      setDisplay(String(formatted));
    } catch {
      setDisplay('Error');
    }
  };

  const clear = () => setDisplay('0');
  const backspace = () => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');

  const buttons = [
    { label: 'sin', action: () => handleFunction('sin'), color: 'text-secondary text-sm' },
    { label: 'cos', action: () => handleFunction('cos'), color: 'text-secondary text-sm' },
    { label: 'tan', action: () => handleFunction('tan'), color: 'text-secondary text-sm' },
    { label: 'sqrt', action: () => handleFunction('sqrt'), color: 'text-secondary text-sm' },
    
    { label: 'log', action: () => handleFunction('log'), color: 'text-secondary text-sm' },
    { label: 'ln', action: () => handleFunction('ln'), color: 'text-secondary text-sm' },
    { label: 'xʸ', action: () => handleFunction('pow'), color: 'text-secondary text-sm' },
    { label: 'π', action: () => handleFunction('pi'), color: 'text-secondary text-sm' },

    { label: 'C', action: clear, color: 'text-danger font-bold' },
    { label: '(', action: () => handleNumber('('), color: 'text-muted' },
    { label: ')', action: () => handleNumber(')'), color: 'text-muted' },
    { label: '/', action: () => handleOperator('/'), color: 'text-primary font-bold' },

    { label: '7', action: () => handleNumber(7) },
    { label: '8', action: () => handleNumber(8) },
    { label: '9', action: () => handleNumber(9) },
    { label: '*', action: () => handleOperator('*'), color: 'text-primary font-bold' },

    { label: '4', action: () => handleNumber(4) },
    { label: '5', action: () => handleNumber(5) },
    { label: '6', action: () => handleNumber(6) },
    { label: '-', action: () => handleOperator('-'), color: 'text-primary font-bold' },

    { label: '1', action: () => handleNumber(1) },
    { label: '2', action: () => handleNumber(2) },
    { label: '3', action: () => handleNumber(3) },
    { label: '+', action: () => handleOperator('+'), color: 'text-primary font-bold' },

    { label: '0', action: () => handleNumber(0) },
    { label: '.', action: () => handleNumber('.') },
    { label: <Delete size={18} />, action: backspace, color: 'text-muted' },
    { label: '=', action: calculate, color: 'bg-primary text-text font-bold rounded-xl' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">Scientific</h2>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
             <HelpCircle size={20} className="text-muted/30" />
          </motion.div>
        </div>

        {/* Display */}
        <div className="bg-background/50 border border-text/5 rounded-2xl p-6 mb-6 text-right shadow-inner min-h-[120px] flex flex-col justify-end">
          <div className="space-y-1 mb-2">
            {history.slice(0, 2).map((item, i) => (
              <div key={i} className="text-muted text-xs opacity-50 truncate">
                {item.expression} = {item.result}
              </div>
            ))}
          </div>
          <div className="text-4xl font-mono font-bold text-text overflow-x-auto whitespace-nowrap no-scrollbar">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`h-12 flex items-center justify-center rounded-lg text-base transition-all duration-200 font-medium
                ${btn.color || 'bg-background hover:bg-text/5 text-text'} 
                ${btn.className || ''} 
                hover:opacity-80 active:scale-95 border border-text/5 shadow-sm`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </Card>
      
      <p className="mt-6 text-center text-muted text-xs flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-success/50 animate-pulse"></span>
        Ready for high-precision calculations
      </p>
    </div>
  );
};

export default ScientificCalculator;
