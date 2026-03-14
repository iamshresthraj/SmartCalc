import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/SharedUI';
import { Delete, Trash2, History as HistoryIcon } from 'lucide-react';

const BasicCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num) => {
    setDisplay(prev => prev === '0' ? String(num) : prev + num);
  };

  const handleOperator = (op) => {
    setDisplay(prev => {
      const lastChar = prev.slice(-1);
      if (['+', '-', '*', '/'].includes(lastChar)) {
        return prev.slice(0, -1) + op;
      }
      return prev + op;
    });
  };

  const calculate = () => {
    try {
      // Use eval carefully or a math library. For basic calc, simple eval of string is often used in demos.
      // eslint-disable-next-line no-eval
      const result = eval(display);
      const formattedResult = Number.isInteger(result) ? result : result.toFixed(4);
      setHistory(prev => [{ expression: display, result: formattedResult }, ...prev].slice(0, 10));
      setDisplay(String(formattedResult));
    } catch {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
  };

  const backspace = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const buttons = [
    { label: 'C', action: clear, color: 'text-danger' },
    { label: <Delete size={20} />, action: backspace, color: 'text-primary' },
    { label: <HistoryIcon size={20} />, action: () => setShowHistory(!showHistory), color: 'text-primary' },
    { label: '/', action: () => handleOperator('/'), color: 'text-secondary font-bold' },
    { label: '7', action: () => handleNumber(7) },
    { label: '8', action: () => handleNumber(8) },
    { label: '9', action: () => handleNumber(9) },
    { label: '*', action: () => handleOperator('*'), color: 'text-secondary font-bold' },
    { label: '4', action: () => handleNumber(4) },
    { label: '5', action: () => handleNumber(5) },
    { label: '6', action: () => handleNumber(6) },
    { label: '-', action: () => handleOperator('-'), color: 'text-secondary font-bold' },
    { label: '1', action: () => handleNumber(1) },
    { label: '2', action: () => handleNumber(2) },
    { label: '3', action: () => handleNumber(3) },
    { label: '+', action: () => handleOperator('+'), color: 'text-secondary font-bold' },
    { label: '0', action: () => handleNumber(0), className: 'col-span-2' },
    { label: '.', action: () => handleNumber('.') },
    { label: '=', action: calculate, color: 'bg-primary text-text font-bold rounded-xl' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl mx-auto">
      <Card className="flex-1 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-text mb-6">Basic Calculator</h2>
        
        {/* Display */}
        <div className="bg-background border border-text/10 rounded-2xl p-6 mb-6 text-right overflow-hidden shadow-inner">
          <div className="text-muted text-sm mb-1 h-5 overflow-hidden whitespace-nowrap">
            {history.length > 0 ? `${history[0].expression} =` : ''}
          </div>
          <div className="text-4xl font-bold text-text truncate">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`h-14 flex items-center justify-center rounded-xl text-lg transition-all duration-200 font-medium
                ${btn.color || 'bg-background hover:bg-text/5 text-text'} 
                ${btn.className || ''} 
                hover:scale-105 active:scale-95 border border-text/5`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </Card>

      {/* History panel */}
      {showHistory && (
        <Card className="w-full lg:w-72">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2 text-text">
              <HistoryIcon size={18} /> History
            </h3>
            <button onClick={() => setHistory([])} className="text-muted hover:text-danger p-1">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-sm text-muted italic">No history yet</p>
            ) : (
              history.map((item, i) => (
                <div key={i} className="p-3 bg-background rounded-lg border border-text/5">
                  <p className="text-xs text-muted truncate">{item.expression}</p>
                  <p className="font-bold text-text text-sm"> = {item.result}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BasicCalculator;
