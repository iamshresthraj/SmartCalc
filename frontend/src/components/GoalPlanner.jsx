import React, { useState, useEffect } from 'react';
import { Card, Slider, InfoTooltip } from './ui/SharedUI';

const GoalPlanner = () => {
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/goal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target_amount: targetAmount,
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
  }, [targetAmount, rate, years]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <div className="w-full lg:w-1/3 space-y-6">
        <Card>
          <h2 className="text-2xl font-bold text-text mb-6">Goal Planner</h2>
          <Slider 
            label="Target Amount (Goal)" 
            value={targetAmount} 
            min={100000} max={50000000} step={100000} 
            onChange={setTargetAmount} 
            format={(v) => formatCurrency(v)} 
            suggestion={targetAmount > 10000000 ? "A 1Cr+ goal? Start early and increase SIPs during career growth!" : ""}
          />
          <Slider 
            label="Time Horizon (Years)" 
            value={years} 
            min={1} max={40} step={1} 
            onChange={setYears} 
            format={(v) => `${v} Yrs`} 
            suggestion={years < 5 ? "Short timeframes need more capital and safer assets." : ""}
          />
          <Slider 
            label="Expected Returns (%)" 
            value={rate} 
            min={1} max={30} step={0.5} 
            onChange={setRate} 
            format={(v) => `${v}%`} 
            suggestion={rate < 8 ? "Beat inflation! Target at least 10-12% for long-term goals." : ""}
          />
        </Card>

        <InfoTooltip title="Reverse Engineering Wealth">
          Goal planners use reverse compound interest formulas. Instead of asking "Where will I end up?", it asks "What do I need to do today to get there?". Notice how increasing your returns or time drastically reduces your required monthly effort.
        </InfoTooltip>
      </div>

      <div className="w-full lg:w-2/3 space-y-6 flex flex-col justify-center">
        {data && (
          <div className="flex flex-col gap-6">
            <Card className="text-center py-12 relative overflow-hidden ring-1 ring-primary/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent blur-2xl"></div>
              <h3 className="text-muted text-lg font-medium mb-4">You need to invest exactly</h3>
              <div className="text-6xl font-bold text-text mb-4 tracking-tighter">
                {formatCurrency(data.required_monthly_sip)}
                <span className="text-2xl text-muted font-normal ml-2">/ month</span>
              </div>
              <p className="text-muted max-w-md mx-auto">
                to reach your goal of <span className="text-text font-semibold">{formatCurrency(targetAmount)}</span> in {years} years.
              </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="text-center">
                <p className="text-muted text-sm font-medium mb-1">Your Total Contribution</p>
                <h3 className="text-xl font-bold text-text">{formatCurrency(data.total_investment)}</h3>
              </Card>
              <Card className="text-center">
                <p className="text-muted text-sm font-medium mb-1">Total Wealth Gained (Market Returns)</p>
                <h3 className="text-xl font-bold text-success">{formatCurrency(targetAmount - data.total_investment)}</h3>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalPlanner;
