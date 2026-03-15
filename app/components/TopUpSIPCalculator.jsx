'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from 'recharts';
import { Card, Slider, InfoTooltip, FormulaExplainer, ResultCard } from './ui/SharedUI';
import { calculateTopUpSIP, formatCurrency } from '@/lib/calculations';

export default function TopUpSIPCalculator() {
  const [startingSIP, setStartingSIP] = useState(5000);
  const [topUp, setTopUp] = useState(10);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = calculateTopUpSIP(startingSIP, topUp, rate, years);
    setResult(data);
  }, [startingSIP, topUp, rate, years]);

  return (
    <article aria-label="Top-Up SIP Calculator">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }} className="responsive-grid">
        <div>
          <Card>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text)' }}>Top-Up SIP Calculator</h2>
            <Slider label="Starting Monthly SIP (₹)" value={startingSIP} min={500} max={100000} step={500} onChange={setStartingSIP} format={v => formatCurrency(v)}
              suggestion={startingSIP < 3000 ? "Starting small is fine – the annual top-up does the heavy lifting!" : ""} />
            <Slider label="Annual Step-Up (%)" value={topUp} min={0} max={50} step={1} onChange={setTopUp} format={v => `${v}%`}
              suggestion={topUp >= 10 ? "A 10%+ step-up aligns well with typical salary increments." : ""} />
            <Slider label="Expected Annual Return (%)" value={rate} min={1} max={30} step={0.5} onChange={setRate} format={v => `${v}%`} />
            <Slider label="Investment Duration (Years)" value={years} min={1} max={40} step={1} onChange={setYears} format={v => `${v} Yrs`} />
          </Card>

          <InfoTooltip title="What is a Top-Up SIP?">
            A Top-Up SIP (also called Step-Up SIP) automatically increases your SIP amount by a fixed percentage each year. This aligns with income growth and significantly boosts long-term wealth accumulation compared to a flat SIP. This calculator is for illustration purposes only.
          </InfoTooltip>

          {result && (
            <FormulaExplainer title="How is this calculated?" steps={[
              { label: 'Year N SIP', formula: `Starting SIP × (1 + ${topUp}%)^(N-1)` },
              { label: 'Year 1 SIP', formula: '', result: formatCurrency(startingSIP) },
              { label: `Year ${years} SIP`, formula: '', result: formatCurrency(result.yearlyData[result.yearlyData.length-1]?.sip || 0) },
              { label: 'Compounding', formula: 'Each month\'s SIP is compounded to maturity' },
              { label: 'Future Value', formula: 'Sum of all compounded monthly SIPs', result: formatCurrency(result.futureValue) },
            ]} />
          )}
        </div>

        <div>
          {result && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }} className="responsive-grid">
                <ResultCard label="Total Invested" value={formatCurrency(result.totalInvested)} />
                <ResultCard label="Future Value" value={formatCurrency(result.futureValue)} highlight />
                <ResultCard label="Wealth Gained" value={`+${formatCurrency(result.wealthGained)}`} accent="success" />
              </div>

              <Card style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Corpus Growth Over Time</h3>
                <div style={{ width: '100%', height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.yearlyData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="topupValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#224c87" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#224c87" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="topupInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#919090" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#919090" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => v} />
                      <YAxis stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} formatter={v => formatCurrency(v)} labelFormatter={l => `Year ${l}`} />
                      <Area type="monotone" dataKey="value" name="Corpus Value" stroke="#224c87" strokeWidth={3} fill="url(#topupValue)" />
                      <Area type="monotone" dataKey="invested" name="Total Invested" stroke="#919090" strokeWidth={2} strokeDasharray="5 5" fill="url(#topupInvested)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Year-wise SIP Amount</h3>
                <div style={{ width: '100%', height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.yearlyData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="year" stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => v} />
                      <YAxis stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} formatter={v => formatCurrency(v)} labelFormatter={l => `Year ${l}`} />
                      <Bar dataKey="sip" name="Monthly SIP" fill="#224c87" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
