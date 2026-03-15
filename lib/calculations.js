/**
 * FinCal Hackathon – Financial Calculation Utilities
 * All formulas follow industry-standard financial mathematics.
 * All calculations are client-side, transparent, and illustrative.
 */

// ========================
// 1. SIP Calculator
// ========================
export function calculateSIP(monthlyInvestment, annualReturnRate, years) {
  const r = annualReturnRate / 12 / 100; // monthly rate
  const n = years * 12; // total months
  const totalInvested = monthlyInvestment * n;

  const yearlyData = [];
  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const fv = r > 0
      ? monthlyInvestment * (((Math.pow(1 + r, months) - 1) / r) * (1 + r))
      : monthlyInvestment * months;
    yearlyData.push({
      year: y,
      invested: Math.round(monthlyInvestment * months),
      value: Math.round(fv),
    });
  }

  const futureValue = yearlyData.length ? yearlyData[yearlyData.length - 1].value : 0;
  return {
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(futureValue),
    wealthGained: Math.round(futureValue - totalInvested),
    yearlyData,
  };
}

// ========================
// 2. SWP Calculator
// ========================
export function calculateSWP(initialCorpus, monthlyWithdrawal, annualReturnRate, years) {
  const r = annualReturnRate / 12 / 100;
  const n = years * 12;

  const monthlyData = [];
  let balance = initialCorpus;
  let totalWithdrawn = 0;
  let depletedMonth = null;

  for (let m = 1; m <= n; m++) {
    balance = balance * (1 + r) - monthlyWithdrawal;
    totalWithdrawn += monthlyWithdrawal;
    if (balance <= 0 && depletedMonth === null) {
      depletedMonth = m;
      balance = 0;
    }
    if (m % 12 === 0 || m === n) {
      monthlyData.push({
        year: Math.ceil(m / 12),
        month: m,
        balance: Math.max(0, Math.round(balance)),
        totalWithdrawn: Math.round(totalWithdrawn),
      });
    }
  }

  // Formula-based final corpus
  const formulaCorpus = r > 0
    ? initialCorpus * Math.pow(1 + r, n) - monthlyWithdrawal * ((Math.pow(1 + r, n) - 1) / r)
    : initialCorpus - monthlyWithdrawal * n;

  return {
    initialCorpus: Math.round(initialCorpus),
    finalCorpus: Math.max(0, Math.round(formulaCorpus)),
    totalWithdrawn: Math.round(totalWithdrawn),
    depletedMonth,
    depletedYear: depletedMonth ? Math.ceil(depletedMonth / 12) : null,
    yearlyData: monthlyData,
  };
}

// ========================
// 3. Top-Up SIP Calculator
// ========================
export function calculateTopUpSIP(startingSIP, annualTopUpPercent, annualReturnRate, years) {
  const r = annualReturnRate / 12 / 100;
  let runningInvested = 0;
  const yearlyData = [];

  for (let y = 1; y <= years; y++) {
    const currentSIP = startingSIP * Math.pow(1 + annualTopUpPercent / 100, y - 1);
    runningInvested += currentSIP * 12;

    // Value at end of year y: sum of all monthly contributions compounded to the end of year y
    let fv = 0;
    let monthCounter = 0;
    for (let yr = 1; yr <= y; yr++) {
      const sip = startingSIP * Math.pow(1 + annualTopUpPercent / 100, yr - 1);
      for (let m = 1; m <= 12; m++) {
        monthCounter++;
        const monthsRemainingInHorizon = y * 12 - monthCounter;
        fv += sip * Math.pow(1 + r, monthsRemainingInHorizon) * (1 + r);
      }
    }

    yearlyData.push({
      year: y,
      sip: Math.round(currentSIP),
      invested: Math.round(runningInvested),
      value: Math.round(fv),
    });
  }

  const finalResult = yearlyData[yearlyData.length - 1] || { value: 0, invested: 0 };

  return {
    totalInvested: finalResult.invested,
    futureValue: finalResult.value,
    wealthGained: finalResult.value - finalResult.invested,
    yearlyData,
  };
}

// ========================
// 4. Goal-Based Investment Calculator
// ========================
export function calculateGoalBased(presentCost, inflationRate, annualReturnRate, years) {
  // Step 1: Inflate the goal
  const futureGoalValue = presentCost * Math.pow(1 + inflationRate / 100, years);

  // Step 2: Calculate required SIP
  const r = annualReturnRate / 12 / 100;
  const n = years * 12;
  const requiredSIP = r > 0
    ? (futureGoalValue * r) / ((Math.pow(1 + r, n) - 1) * (1 + r))
    : futureGoalValue / n;

  const totalInvestment = requiredSIP * n;
  const wealthFromMarket = futureGoalValue - totalInvestment;

  // Yearly growth projection of cumulative SIP
  const yearlyData = [];
  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const fv = r > 0
      ? requiredSIP * (((Math.pow(1 + r, months) - 1) / r) * (1 + r))
      : requiredSIP * months;
    yearlyData.push({
      year: y,
      invested: Math.round(requiredSIP * months),
      value: Math.round(fv),
      goalLine: Math.round(futureGoalValue),
    });
  }

  return {
    presentCost: Math.round(presentCost),
    futureGoalValue: Math.round(futureGoalValue),
    requiredMonthlySIP: Math.round(requiredSIP),
    totalInvestment: Math.round(totalInvestment),
    wealthFromMarket: Math.round(wealthFromMarket),
    yearlyData,
  };
}

// ========================
// 5. Retirement Planning Calculator
// ========================
export function calculateRetirement(
  currentMonthlyExpense,
  yearsToRetirement,
  retirementDuration,
  inflationRate,
  preRetirementReturn,
  postRetirementReturn
) {
  // Step 1: Inflate annual expenses to retirement
  const currentAnnualExpense = currentMonthlyExpense * 12;
  const retirementAnnualExpense = currentAnnualExpense * Math.pow(1 + inflationRate / 100, yearsToRetirement);

  // Step 2: Calculate retirement corpus needed
  const rPost = postRetirementReturn / 100;
  const t = retirementDuration;
  let retirementCorpus;
  if (rPost > 0) {
    retirementCorpus = retirementAnnualExpense * ((1 - Math.pow(1 + rPost, -t)) / rPost);
  } else {
    retirementCorpus = retirementAnnualExpense * t;
  }

  // Step 3: Calculate required monthly SIP until retirement
  const rPre = preRetirementReturn / 12 / 100;
  const nPre = yearsToRetirement * 12;
  const requiredSIP = rPre > 0
    ? (retirementCorpus * rPre) / ((Math.pow(1 + rPre, nPre) - 1) * (1 + rPre))
    : retirementCorpus / nPre;

  const totalSIPInvestment = requiredSIP * nPre;

  // Accumulation-phase yearly data
  const yearlyData = [];
  for (let y = 1; y <= yearsToRetirement; y++) {
    const months = y * 12;
    const fv = rPre > 0
      ? requiredSIP * (((Math.pow(1 + rPre, months) - 1) / rPre) * (1 + rPre))
      : requiredSIP * months;
    yearlyData.push({
      year: y,
      phase: 'accumulation',
      invested: Math.round(requiredSIP * months),
      value: Math.round(fv),
    });
  }

  // Withdrawal-phase yearly data
  let corpusBalance = retirementCorpus;
  for (let y = 1; y <= retirementDuration; y++) {
    corpusBalance = corpusBalance * (1 + rPost) - retirementAnnualExpense * Math.pow(1 + inflationRate / 100, y);
    yearlyData.push({
      year: yearsToRetirement + y,
      phase: 'withdrawal',
      invested: 0,
      value: Math.max(0, Math.round(corpusBalance)),
    });
  }

  return {
    currentMonthlyExpense: Math.round(currentMonthlyExpense),
    retirementMonthlyExpense: Math.round(retirementAnnualExpense / 12),
    retirementCorpus: Math.round(retirementCorpus),
    requiredMonthlySIP: Math.round(requiredSIP),
    totalSIPInvestment: Math.round(totalSIPInvestment),
    yearlyData,
  };
}

// ========================
// Utility: Format Currency
// ========================
export function formatCurrency(val) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}
