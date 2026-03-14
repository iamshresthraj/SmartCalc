import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Card, Slider, InfoTooltip } from './ui/SharedUI';

const LumpSumCalculator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/lumpsum', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            principal: principal,
            annual_return_rate: rate,
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
  }, [principal, rate, years]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <div className="w-full lg:w-1/3 space-y-6">
        <Card>
          <h2 className="text-2xl font-bold text-text mb-6">Lump Sum Model</h2>
          <Slider 
            label="Total Investment" 
            value={principal} 
            min={10000} max={10000000} step={10000} 
            onChange={setPrincipal} 
            format={(v) => formatCurrency(v)} 
            suggestion={principal < 100000 ? "Higher initial capital accelerates the power of compounding." : ""}
          />
          <Slider 
            label="Expected CAGR (%)" 
            value={rate} 
            min={1} max={30} step={0.5} 
            onChange={setRate} 
            format={(v) => `${v}%`} 
            suggestion={rate > 15 ? "15%+ CAGR is aggressive; verify with historical data." : ""}
          />
          <Slider 
            label="Time Period (Years)" 
            value={years} 
            min={1} max={40} step={1} 
            onChange={setYears} 
            format={(v) => `${v} Yrs`} 
            suggestion={years > 20 ? "Time is your greatest ally. 20+ years creates massive wealth gaps." : ""}
          />
        </Card>

        <InfoTooltip title="What is a Lump Sum Investment?">
          Investing all your money at once. Since the entire amount starts compounding from Day 1, lump sum investments mathematically outperform SIPs over identical time frames if the market constantly goes up, although they carry higher timing risk.
        </InfoTooltip>
      </div>

      <div className="w-full lg:w-2/3 space-y-6 flex flex-col">
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <p className="text-muted text-sm font-medium mb-1">Total Invested</p>
              <h3 className="text-2xl font-bold text-text">{formatCurrency(data.total_invested)}</h3>
            </Card>
            <Card className="text-center relative overflow-hidden ring-1 ring-secondary/50">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-secondary/30 to-transparent blur-xl"></div>
              <p className="text-muted text-sm font-medium mb-1">Future Value</p>
              <h3 className="text-2xl font-bold text-secondary">{formatCurrency(data.future_value)}</h3>
            </Card>
            <Card className="text-center">
              <p className="text-muted text-sm font-medium mb-1">Wealth Gained</p>
              <h3 className="text-2xl font-bold text-success">+{formatCurrency(data.wealth_gained)}</h3>
            </Card>
          </div>
        )}

        <Card className="flex-1 flex flex-col min-h-[400px]">
          <h3 className="text-xl font-bold text-text mb-6">Exponential Growth Curve</h3>
          <div className="flex-1 w-full min-h-[300px]">
            {data && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.yearly_data} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLump" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
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
                  <Area type="monotone" dataKey="value" name="Future Value" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorLump)" />
                  <Area type="step" dataKey="invested" name="Initial Investment" stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LumpSumCalculator;
