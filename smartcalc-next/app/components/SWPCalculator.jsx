'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, Slider, InfoTooltip, FormulaExplainer, ResultCard, Disclaimer } from './ui/SharedUI';
import { calculateSWP, formatCurrency } from '@/lib/calculations';

export default function SWPCalculator() {
  const [corpus, setCorpus] = useState(5000000);
  const [withdrawal, setWithdrawal] = useState(30000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(25);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = calculateSWP(corpus, withdrawal, rate, years);
    setResult(data);
  }, [corpus, withdrawal, rate, years]);

  return (
    <article aria-label="SWP Calculator">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }} className="responsive-grid">
        <div>
          <Card>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text)' }}>SWP Calculator</h2>
            <Slider label="Initial Corpus (₹)" value={corpus} min={100000} max={50000000} step={100000} onChange={setCorpus} format={v => formatCurrency(v)}
              suggestion={corpus < 1000000 ? "A larger corpus extends the sustainability of withdrawals." : ""} />
            <Slider label="Monthly Withdrawal (₹)" value={withdrawal} min={1000} max={500000} step={1000} onChange={setWithdrawal} format={v => formatCurrency(v)}
              suggestion={withdrawal > corpus * 0.01 ? "High withdrawals relative to corpus may deplete it faster." : ""} />
            <Slider label="Expected Annual Return (%)" value={rate} min={1} max={15} step={0.5} onChange={setRate} format={v => `${v}%`}
              suggestion={rate < 6 ? "Post-retirement, conservative returns of 6-8% are common." : ""} />
            <Slider label="Withdrawal Duration (Years)" value={years} min={1} max={40} step={1} onChange={setYears} format={v => `${v} Yrs`} />
          </Card>

          <InfoTooltip title="What is an SWP?">
            A Systematic Withdrawal Plan (SWP) lets you withdraw a fixed amount periodically from your invested corpus while the remaining amount continues to earn returns. It is commonly used for generating regular income post-retirement. This calculator is for illustration purposes only.
          </InfoTooltip>

          {result && (
            <FormulaExplainer title="How is this calculated?" steps={[
              { label: 'Monthly Rate (r)', formula: `${rate}% ÷ 12 = ${(rate/12).toFixed(4)}%` },
              { label: 'Total Months (n)', formula: `${years} × 12 = ${years * 12}` },
              { label: 'Corpus Formula', formula: 'FV = PV×(1+r)^n − W×[((1+r)^n −1)/r]' },
              { label: 'Remaining Corpus', formula: '', result: formatCurrency(result.finalCorpus) },
            ]} />
          )}
        </div>

        <div>
          {result && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }} className="responsive-grid">
                <ResultCard label="Initial Corpus" value={formatCurrency(result.initialCorpus)} />
                <ResultCard label="Remaining Corpus" value={formatCurrency(result.finalCorpus)} highlight accent={result.finalCorpus <= 0 ? 'danger' : undefined} />
                <ResultCard label="Total Withdrawn" value={formatCurrency(result.totalWithdrawn)} accent="success" />
              </div>

              {result.depletedYear && (
                <Card style={{ marginBottom: '16px', borderColor: 'var(--danger)', textAlign: 'center', padding: '16px' }}>
                  <p style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '1rem' }}>
                    ⚠️ Corpus depletes in Year {result.depletedYear} (Month {result.depletedMonth})
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Consider reducing monthly withdrawal or increasing expected return.
                  </p>
                </Card>
              )}

              <Card>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Corpus Balance Over Time</h3>
                <div style={{ width: '100%', height: '380px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.yearlyData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="swpBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#da3832" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#da3832" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => `Yr ${v}`} />
                      <YAxis stroke="var(--border)" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} formatter={v => formatCurrency(v)} labelFormatter={l => `Year ${l}`} />
                      <ReferenceLine y={0} stroke="var(--danger)" strokeDasharray="3 3" />
                      <Area type="monotone" dataKey="balance" name="Corpus Balance" stroke="#da3832" strokeWidth={3} fill="url(#swpBalance)" />
                    </AreaChart>
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
