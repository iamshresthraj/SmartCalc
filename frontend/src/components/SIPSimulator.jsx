import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, Slider, InfoTooltip } from './ui/SharedUI';

const SIPSimulator = () => {
  const [investment, setInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8001/api/sip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monthly_investment: Number(investment),
            annual_return_rate: Number(rate),
            years: Number(years)
          })
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    
    // Simple debounce
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [investment, rate, years]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Left Column: Inputs */}
      <div className="w-full lg:w-1/3 space-y-6">
        <Card>
          <h2 className="text-2xl font-bold text-text mb-6">SIP Investment</h2>
          <Slider 
            label="Monthly Investment" 
            value={investment} 
            min={500} max={100000} step={500} 
            onChange={setInvestment} 
            format={(v) => formatCurrency(v)} 
            suggestion={investment < 10000 ? "Try starting with ₹10k for faster wealth compounding!" : ""}
          />
          <Slider 
            label="Expected Return Rate (%)" 
            value={rate} 
            min={1} max={30} step={0.5} 
            onChange={setRate} 
            format={(v) => `${v}%`} 
            suggestion={rate < 10 ? "Index funds usually give ~12-15% over long periods." : ""}
          />
          <Slider 
            label="Time Period (Years)" 
            value={years} 
            min={1} max={40} step={1} 
            onChange={setYears} 
            format={(v) => `${v} Yrs`} 
            suggestion={years < 10 ? "Wealth doubles significantly every 7-8 years. Sit tight!" : "Great! Long-term investing is the key to financial freedom."}
          />
        </Card>

        <InfoTooltip title="What is a SIP?">
          A Systematic Investment Plan involves investing a fixed sum of money regularly (e.g., monthly). This approach helps average out market volatility and harness the immense power of compound interest over long periods.
        </InfoTooltip>
      </div>

      {/* Right Column: Visualization */}
      <div className="w-full lg:w-2/3 space-y-6 flex flex-col">
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <p className="text-muted text-sm font-medium mb-1">Total Invested</p>
              <h3 className="text-2xl font-bold text-text">{formatCurrency(data.total_invested)}</h3>
            </Card>
            <Card className="text-center relative overflow-hidden ring-1 ring-primary/50">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/30 to-transparent blur-xl"></div>
              <p className="text-muted text-sm font-medium mb-1">Future Value</p>
              <h3 className="text-2xl font-bold text-primary">{formatCurrency(data.future_value)}</h3>
            </Card>
            <Card className="text-center">
              <p className="text-muted text-sm font-medium mb-1">Wealth Gained</p>
              <h3 className="text-2xl font-bold text-success">+{formatCurrency(data.wealth_gained)}</h3>
            </Card>
          </div>
        )}

        <Card className="flex-1 flex flex-col min-h-[400px]">
          <h3 className="text-xl font-bold text-text mb-6">Investment Growth Over Time</h3>
          <div className="flex-1 w-full min-h-[300px]">
            {data ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.yearly_data} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `Yr ${val}`}/>
                  <YAxis stroke="#475569" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}/>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Area type="monotone" dataKey="value" name="Future Value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  <Area type="monotone" dataKey="invested" name="Amount Invested" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorInvested)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
             <div className="w-full h-full flex items-center justify-center text-muted">Loading graph...</div>
            )}
          </div>
        </Card>

        {data && (
          <Card className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-text mb-4 self-start">Investment Breakdown</h3>
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Amount Invested', value: data.total_invested },
                      { name: 'Wealth Gained', value: data.wealth_gained },
                    ]}
                    cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                    paddingAngle={4} dataKey="value" strokeWidth={0}
                  >
                    <Cell fill="#6366f1" />
                    <Cell fill="#22c55e" />
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--track-bg)', borderRadius: '12px', color: 'var(--text)' }} itemStyle={{ color: 'var(--text)' }} />
                  <Legend iconType="circle" formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SIPSimulator;
