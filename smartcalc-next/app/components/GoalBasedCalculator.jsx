'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, Slider, InfoTooltip, FormulaExplainer, ResultCard, Disclaimer } from './ui/SharedUI';
import { calculateGoalBased, formatCurrency } from '@/lib/calculations';

export default function GoalBasedCalculator() {
  const [presentCost, setPresentCost] = useState(2000000);
  const [inflation, setInflation] = useState(6);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = calculateGoalBased(presentCost, inflation, rate, years);
    setResult(data);
  }, [presentCost, inflation, rate, years]);

  return (
    <article aria-label="Goal-Based Investment Calculator">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }} className="responsive-grid">
        <div>
          <Card>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text)' }}>Goal-Based Calculator</h2>
            <Slider label="Present Cost of Goal (₹)" value={presentCost} min={50000} max={50000000} step={50000} onChange={setPresentCost} format={v => formatCurrency(v)} />
            <Slider label="Inflation Rate (%)" value={inflation} min={0} max={15} step={0.5} onChange={setInflation} format={v => `${v}%`}
              suggestion={inflation > 7 ? "High inflation means your goal will cost significantly more in the future." : "India's average inflation has been around 5-6%."} />
            <Slider label="Expected Return Rate (%)" value={rate} min={1} max={30} step={0.5} onChange={setRate} format={v => `${v}%`}
              suggestion={rate <= inflation ? "⚠️ Returns should ideally exceed inflation to create real wealth." : ""} />
            <Slider label="Time to Goal (Years)" value={years} min={1} max={40} step={1} onChange={setYears} format={v => `${v} Yrs`} />
          </Card>

          <InfoTooltip title="How Goal-Based Planning Works">
            This calculator first adjusts your goal for inflation (what will it actually cost in the future?), then reverse-engineers the monthly SIP needed to reach that inflated goal. The key insight: inflation and returns are two separate assumptions – keeping them transparent helps you plan realistically. This calculator is for illustration purposes only.
          </InfoTooltip>

          {result && (
            <FormulaExplainer title="Step-by-step Calculation" steps={[
              { label: 'Step 1: Inflate Goal', formula: `${formatCurrency(presentCost)} × (1 + ${inflation}%)^${years}`, result: formatCurrency(result.futureGoalValue) },
              { label: 'Monthly Rate (r)', formula: `${rate}% ÷ 12 = ${(rate/12).toFixed(4)}%` },
              { label: 'Total Months (n)', formula: `${years} × 12 = ${years * 12}` },
              { label: 'Step 2: Required SIP', formula: 'FV × r / [((1+r)^n − 1) × (1+r)]', result: `${formatCurrency(result.requiredMonthlySIP)}/month` },
            ]} />
          )}
        </div>

        <div>
          {result && (
            <>
              {/* Big hero card */}
              <Card style={{ textAlign: 'center', padding: '32px', marginBottom: '24px', borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary), var(--card-shadow)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(34,76,135,0.12), transparent)', filter: 'blur(30px)', pointerEvents: 'none' }} />
                <p style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: '8px' }}>You need to invest</p>
                <p className="animate-number" style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-2px' }}>
                  {formatCurrency(result.requiredMonthlySIP)}
                  <span style={{ fontSize: '1.2rem', color: 'var(--muted)', fontWeight: 400, marginLeft: '8px' }}>/month</span>
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                  to reach your goal of <strong style={{ color: 'var(--text)' }}>{formatCurrency(result.futureGoalValue)}</strong> in {years} years.
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                  (Today's cost: {formatCurrency(presentCost)}, adjusted for {inflation}% inflation)
                </p>
              </Card>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }} className="responsive-grid">
                <ResultCard label="Your Total Contribution" value={formatCurrency(result.totalInvestment)} />
                <ResultCard label="Market Returns" value={`+${formatCurrency(result.wealthFromMarket)}`} accent="success" />
              </div>

              <Card style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>SIP Growth Towards Goal</h3>
                <div style={{ width: '100%', height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.yearlyData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="goalValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#224c87" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#224c87" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => `Yr ${v}`} />
                      <YAxis stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} formatter={v => formatCurrency(v)} labelFormatter={l => `Year ${l}`} />
                      <Area type="monotone" dataKey="value" name="Accumulated SIP" stroke="#224c87" strokeWidth={3} fill="url(#goalValue)" />
                      <Area type="monotone" dataKey="invested" name="Invested" stroke="#919090" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Goal Composition</h3>
                <div style={{ width: '100%', height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[
                        { name: 'Your SIP Contributions', value: result.totalInvestment },
                        { name: 'Market Returns', value: result.wealthFromMarket },
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
