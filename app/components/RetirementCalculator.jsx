'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, ReferenceLine } from 'recharts';
import { Card, Slider, InfoTooltip, FormulaExplainer, ResultCard } from './ui/SharedUI';
import { calculateRetirement, formatCurrency } from '@/lib/calculations';

export default function RetirementCalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState(40000);
  const [yearsToRetirement, setYearsToRetirement] = useState(25);
  const [retirementDuration, setRetirementDuration] = useState(25);
  const [inflation, setInflation] = useState(6);
  const [preReturn, setPreReturn] = useState(12);
  const [postReturn, setPostReturn] = useState(7);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = calculateRetirement(monthlyExpense, yearsToRetirement, retirementDuration, inflation, preReturn, postReturn);
    setResult(data);
  }, [monthlyExpense, yearsToRetirement, retirementDuration, inflation, preReturn, postReturn]);

  return (
    <article aria-label="Retirement Planning Calculator">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }} className="responsive-grid">
        <div>
          <Card>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text)' }}>Retirement Planner</h2>
            <Slider label="Current Monthly Expense (₹)" value={monthlyExpense} min={5000} max={500000} step={1000} onChange={setMonthlyExpense} format={v => formatCurrency(v)} />
            <Slider label="Years to Retirement" value={yearsToRetirement} min={1} max={40} step={1} onChange={setYearsToRetirement} format={v => `${v} Yrs`} />
            <Slider label="Retirement Duration (Years)" value={retirementDuration} min={1} max={40} step={1} onChange={setRetirementDuration} format={v => `${v} Yrs`}
              suggestion={retirementDuration < 20 ? "Plan for at least 25 years of retirement for safety." : ""} />
            <Slider label="Inflation Rate (%)" value={inflation} min={0} max={12} step={0.5} onChange={setInflation} format={v => `${v}%`}
              suggestion="Assumption: Average inflation throughout the planning period." />
            <Slider label="Pre-Retirement Return (%)" value={preReturn} min={1} max={20} step={0.5} onChange={setPreReturn} format={v => `${v}%`}
              suggestion="Assumption: Return on investments during accumulation phase." />
            <Slider label="Post-Retirement Return (%)" value={postReturn} min={1} max={15} step={0.5} onChange={setPostReturn} format={v => `${v}%`}
              suggestion="Assumption: Conservative return during withdrawal phase." />
          </Card>

          <InfoTooltip title="How Retirement Planning Works">
            This calculator works in three steps: (1) Inflate your current expenses to what they'll be at retirement, (2) Calculate the total corpus needed to sustain those expenses for your entire retirement, and (3) Find the monthly SIP needed today to build that corpus. All assumptions are user-editable and illustrative only.
          </InfoTooltip>

          {result && (
            <FormulaExplainer title="3-Step Calculation" steps={[
              { label: 'Step 1: Inflate Expenses', formula: `₹${(monthlyExpense*12).toLocaleString('en-IN')} × (1 + ${inflation}%)^${yearsToRetirement}`, result: `${formatCurrency(result.retirementMonthlyExpense)}/mo` },
              { label: 'Step 2: Corpus Needed', formula: `Annual Expense × [(1 − (1+r)^−t) / r]`, result: formatCurrency(result.retirementCorpus) },
              { label: 'Step 3: Monthly SIP', formula: `Corpus × r / [((1+r)^n − 1) × (1+r)]`, result: `${formatCurrency(result.requiredMonthlySIP)}/mo` },
            ]} />
          )}
        </div>

        <div>
          {result && (
            <>
              {/* Hero Card */}
              <Card style={{ textAlign: 'center', padding: '32px', marginBottom: '24px', borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary), var(--card-shadow)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(34,76,135,0.12), transparent)', filter: 'blur(30px)', pointerEvents: 'none' }} />
                <p style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: '8px' }}>Start investing</p>
                <p className="animate-number" style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-2px' }}>
                  {formatCurrency(result.requiredMonthlySIP)}
                  <span style={{ fontSize: '1.2rem', color: 'var(--muted)', fontWeight: 400, marginLeft: '8px' }}>/month</span>
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                  to build a retirement corpus of <strong style={{ color: 'var(--text)' }}>{formatCurrency(result.retirementCorpus)}</strong>
                </p>
              </Card>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }} className="responsive-grid">
                <ResultCard label="Monthly Expense at Retirement" value={formatCurrency(result.retirementMonthlyExpense)} accent="danger" />
                <ResultCard label="Corpus Required" value={formatCurrency(result.retirementCorpus)} highlight />
                <ResultCard label="Total SIP Investment" value={formatCurrency(result.totalSIPInvestment)} />
              </div>

              <Card>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Accumulation &amp; Withdrawal Phases</h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(34,76,135,0.15)', color: 'var(--primary)', borderRadius: '8px', fontWeight: 600 }}>● Accumulation ({yearsToRetirement} yrs)</span>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(218,56,50,0.15)', color: 'var(--accent)', borderRadius: '8px', fontWeight: 600 }}>● Withdrawal ({retirementDuration} yrs)</span>
                </div>
                <div style={{ width: '100%', height: '380px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.yearlyData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="retAccum" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#224c87" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#224c87" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => v} />
                      <YAxis stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} formatter={v => formatCurrency(v)} labelFormatter={l => `Year ${l}`} />
                      <ReferenceLine x={yearsToRetirement} stroke="var(--accent)" strokeDasharray="4 4" label={{ value: 'Retirement', fill: 'var(--accent)', fontSize: 12 }} />
                      <Area type="monotone" dataKey="value" name="Corpus Value" stroke="#224c87" strokeWidth={3} fill="url(#retAccum)" />
                    </AreaChart>
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
