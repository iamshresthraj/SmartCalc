'use client';
import { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, Slider, InfoTooltip, FormulaExplainer, ResultCard, Disclaimer } from './ui/SharedUI';
import { calculateSIP, formatCurrency } from '@/lib/calculations';

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = calculateSIP(monthly, rate, years);
    setResult(data);
  }, [monthly, rate, years]);

  return (
    <article aria-label="SIP Calculator">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }} className="responsive-grid">
        {/* Inputs */}
        <div>
          <Card>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text)' }}>SIP Calculator</h2>
            <Slider label="Monthly Investment (₹)" value={monthly} min={500} max={100000} step={500} onChange={setMonthly} format={v => formatCurrency(v)}
              suggestion={monthly < 5000 ? "Even ₹5,000/month can grow significantly over 15+ years." : ""} />
            <Slider label="Expected Annual Return (%)" value={rate} min={1} max={30} step={0.5} onChange={setRate} format={v => `${v}%`}
              suggestion={rate > 15 ? "Returns above 15% are aggressive. Verify with historical data." : ""} />
            <Slider label="Investment Duration (Years)" value={years} min={1} max={40} step={1} onChange={setYears} format={v => `${v} Yrs`}
              suggestion={years < 5 ? "Compounding works best over longer periods. Consider 10+ years." : ""} />
          </Card>

          <InfoTooltip title="What is a SIP?">
            A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly (e.g., monthly) into mutual funds. It averages out market volatility through rupee cost averaging and leverages the power of compounding over time. This calculator is for illustration purposes only.
          </InfoTooltip>

          {result && (
            <FormulaExplainer title="How is this calculated?" steps={[
              { label: 'Monthly Rate (r)', formula: `${rate}% ÷ 12 = ${(rate/12).toFixed(4)}%` },
              { label: 'Total Months (n)', formula: `${years} × 12 = ${years * 12}` },
              { label: 'Future Value', formula: 'P × [((1+r)^n − 1) / r] × (1+r)', result: formatCurrency(result.futureValue) },
            ]} />
          )}
        </div>

        {/* Results */}
        <div>
          {result && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }} className="responsive-grid">
                <ResultCard label="Total Invested" value={formatCurrency(result.totalInvested)} />
                <ResultCard label="Future Value" value={formatCurrency(result.futureValue)} highlight />
                <ResultCard label="Wealth Gained" value={`+${formatCurrency(result.wealthGained)}`} accent="success" />
              </div>

              <Card style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Investment Growth Over Time</h3>
                <div style={{ width: '100%', height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.yearlyData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="sipValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#224c87" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#224c87" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="sipInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#919090" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#919090" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => `Yr ${v}`} />
                      <YAxis stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} formatter={v => formatCurrency(v)} labelFormatter={l => `Year ${l}`} />
                      <Area type="monotone" dataKey="value" name="Future Value" stroke="#224c87" strokeWidth={3} fill="url(#sipValue)" />
                      <Area type="monotone" dataKey="invested" name="Invested" stroke="#919090" strokeWidth={2} strokeDasharray="5 5" fill="url(#sipInvested)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Investment Breakdown</h3>
                <div style={{ width: '100%', height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[
                        { name: 'Amount Invested', value: result.totalInvested },
                        { name: 'Wealth Gained', value: result.wealthGained },
                      ]} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value" strokeWidth={0}>
                        <Cell fill="#224c87" />
                        <Cell fill="#1a8954" />
                      </Pie>
                      <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} />
                      <Legend iconType="circle" formatter={v => <span style={{ color: 'var(--text)' }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
      <Disclaimer />
    </article>
  );
}
