import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from 'recharts';
import { Card, Slider, InfoTooltip } from './ui/SharedUI';

const InflationCalculator = () => {
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [inflation, setInflation] = useState(6);
  const [years, setYears] = useState(20);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/inflation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_amount: currentAmount,
            inflation_rate: inflation,
            years: years
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
  }, [currentAmount, inflation, years]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <div className="w-full lg:w-1/3 space-y-6">
        <Card>
          <h2 className="text-2xl font-bold text-text mb-6">Inflation Impact</h2>
          <Slider 
            label="Current Value / Cost" 
            value={currentAmount} 
            min={10000} max={10000000} step={10000} 
            onChange={setCurrentAmount} 
            format={(v) => formatCurrency(v)} 
            suggestion="Inflation affects every rupee. See how its value drops."
          />
          <Slider 
            label="Average Inflation Rate (%)" 
            value={inflation} 
            min={1} max={15} step={0.5} 
            onChange={setInflation} 
            format={(v) => `${v}%`} 
            suggestion={inflation > 7 ? "High inflation significantly erodes purchasing power faster." : ""}
          />
          <Slider 
            label="Time Horizon (Years)" 
            value={years} 
            min={1} max={40} step={1} 
            onChange={setYears} 
            format={(v) => `${v} Yrs`} 
            suggestion={years > 15 ? "Over 15+ years, 6% inflation halves your money's value!" : ""}
          />
        </Card>

        <InfoTooltip title="The Silent Wealth Killer">
          Inflation is the invisible force that decreases the purchasing power of money over time. While an investment of {formatCurrency(100000)} sitting in a locker might still look like 1 Lakh after 20 years, its actual *value* will be drastically lower.
        </InfoTooltip>
      </div>

      <div className="w-full lg:w-2/3 space-y-6 flex flex-col">
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="text-center ring-1 ring-danger/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-danger/20 to-transparent blur-xl"></div>
              <p className="text-slate-400 text-sm font-medium mb-1">Future Purchasing Power of Cash</p>
              <h3 className="text-2xl font-bold text-danger">{formatCurrency(data.future_purchasing_power)}</h3>
              <p className="text-xs text-slate-500 mt-2">What your money is actually worth</p>
            </Card>
            <Card className="text-center relative overflow-hidden">
              <p className="text-muted text-sm font-medium mb-1">Future Cost of the Same Item</p>
              <h3 className="text-2xl font-bold text-text">{formatCurrency(data.future_cost)}</h3>
              <p className="text-xs text-muted mt-2">What you'll need to pay</p>
            </Card>
          </div>
        )}

        <Card className="flex-1 flex flex-col min-h-[400px]">
          <h3 className="text-xl font-bold text-text mb-6">Purchasing Power Over Time</h3>
          <div className="flex-1 w-full min-h-[300px]">
            {data && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.yearly_data} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `Yr ${val}`}/>
                  <YAxis stroke="#475569" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}/>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value, name) => [formatCurrency(value), name.replace('_', ' ')]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Area type="monotone" dataKey="purchasing_power" name="Purchasing Power" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorPower)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {data && (
          <Card>
            <h3 className="text-xl font-bold text-text mb-4">Value Comparison</h3>
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Today\'s Value', value: currentAmount },
                    { name: 'Real Value After Inflation', value: data.future_purchasing_power },
                    { name: 'Future Cost', value: data.future_cost },
                  ]}
                  margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--track-bg)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--track-bg)" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                  <YAxis stroke="var(--track-bg)" tick={{ fill: 'var(--muted)' }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--track-bg)', borderRadius: '12px', color: 'var(--text)' }} itemStyle={{ color: 'var(--text)' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                    <Cell fill="#6366f1" />
                    <Cell fill="#ef4444" />
                    <Cell fill="#eab308" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InflationCalculator;
