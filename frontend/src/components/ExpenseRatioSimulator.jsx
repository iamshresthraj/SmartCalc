import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card, Slider, InfoTooltip } from './ui/SharedUI';

const ExpenseRatioSimulator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(20);
  const [erA, setErA] = useState(0.2); // Direct plan
  const [erB, setErB] = useState(1.5); // Regular plan
  
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/expense-ratio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            principal: principal,
            monthly_investment: monthly,
            annual_return_rate: rate,
            years: years,
            expense_ratio_a: erA,
            expense_ratio_b: erB
          })
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };
    
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [principal, monthly, rate, years, erA, erB]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <div className="w-full lg:w-1/3 space-y-6">
        <Card>
          <h2 className="text-2xl font-bold text-text mb-6">Fee Impact Simulator</h2>
          <Slider 
            label="Initial Investment" 
            value={principal} 
            min={0} max={1000000} step={10000} 
            onChange={setPrincipal} 
            format={(v) => formatCurrency(v)} 
            suggestion={principal < 50000 ? "Starting with a solid base gives compounding a head start." : ""}
          />
          <Slider 
            label="Monthly SIP" 
            value={monthly} 
            min={0} max={100000} step={1000} 
            onChange={setMonthly} 
            format={(v) => formatCurrency(v)} 
            suggestion={monthly > 5000 ? "Consistent SIPs are the engine of wealth growth!" : ""}
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
             <Slider 
              label="Fund A Fee (%)" 
              value={erA} 
              min={0} max={3} step={0.1} 
              onChange={setErA} 
              format={(v) => `${v}%`} 
              tooltip="Direct Plans usually charge less than 0.5%."
              suggestion={erA > 1 ? "Avoid high fees!" : ""}
            />
            <Slider 
              label="Fund B Fee (%)" 
              value={erB} 
              min={0} max={3} step={0.1} 
              onChange={setErB} 
              format={(v) => `${v}%`} 
              tooltip="Regular Mutual Funds often charge 1-2%."
              suggestion={erB - erA > 1 ? "That's a huge fee gap!" : ""}
            />
          </div>
          <Slider 
            label="Market Return (%)" 
            value={rate} 
            min={4} max={20} step={0.5} 
            onChange={setRate} 
            format={(v) => `${v}%`} 
            suggestion={rate < 7 ? "Equity usually targets 12%+." : ""}
          />
          <Slider 
            label="Investment Period" 
            value={years} 
            min={1} max={40} step={1} 
            onChange={setYears} 
            format={(v) => `${v} Yrs`} 
            suggestion={years > 25 ? "25+ years? You're building a dynasty!" : ""}
          />
        </Card>

        <InfoTooltip title="The 1% Illusion">
          A fee of 1% sounds tiny. But fees are deducted from your total balance *every year*, not just your returns. Over 20+ years, a 1% higher expense ratio can literally consume vast amounts of your potential wealth due to lost compounding.
        </InfoTooltip>
      </div>

      <div className="w-full lg:w-2/3 space-y-6 flex flex-col">
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="text-center">
              <p className="text-muted text-sm font-medium mb-1">Total Invested Amount</p>
              <h3 className="text-2xl font-bold text-text mb-4">{formatCurrency(data.total_invested)}</h3>
            </Card>
            <Card className="text-center relative overflow-hidden ring-1 ring-danger/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-danger/20 to-transparent blur-2xl"></div>
              <p className="text-muted text-sm font-medium mb-1">Wealth Lost to High Fees</p>
              <h3 className="text-3xl font-bold text-danger tracking-tighter">
                {formatCurrency(data.wealth_difference)}
              </h3>
            </Card>
          </div>
        )}

        <Card className="flex-1 flex flex-col min-h-[400px]">
          <h3 className="text-xl font-bold text-text mb-2">Fund A vs Fund B Growth</h3>
          {data && (
             <p className="text-sm text-muted mb-6 flex items-center justify-between">
               <span>Fund A Final: <strong className="text-success">{formatCurrency(data.final_value_a)}</strong></span>
               <span>Fund B Final: <strong className="text-warning text-yellow-500">{formatCurrency(data.final_value_b)}</strong></span>
             </p>
          )}
          <div className="flex-1 w-full min-h-[300px]">
            {data && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.yearly_data} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `Yr ${val}`}/>
                  <YAxis stroke="#475569" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}/>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value, name) => [formatCurrency(value), name === 'val_a' ? `Fund A (${erA}%)` : `Fund B (${erB}%)`]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="val_a" name={`Fund A (${erA}%)`} stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorA)" />
                  <Area type="monotone" dataKey="val_b" name={`Fund B (${erB}%)`} stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorB)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseRatioSimulator;
