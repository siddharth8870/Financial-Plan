// Tax and financial calculations utility

export function calculateNetIncome(grossAnnual, state = "CA") {
  const INSURANCE_PER_PAYCHECK = 100;
  const PAYCHECKS_PER_YEAR = 26;
  const INSURANCE_ANNUAL = INSURANCE_PER_PAYCHECK * PAYCHECKS_PER_YEAR;

  const TAXABLE_INCOME = grossAnnual - 15000;
  const FEDERAL_TAX =
    1192.5 +
    Math.max(0, Math.min(TAXABLE_INCOME - 11925, 36550) * 0.12) +
    Math.max(0, (TAXABLE_INCOME - 48475) * 0.22);
  const FICA = grossAnnual * 0.062 + grossAnnual * 0.0145;

  const stateTaxRates = {
    CA: 0.093,
    TX: 0,
    FL: 0,
    NY: 0.065,
    MA: 0.05,
    IL: 0.045,
    WA: 0,
    CO: 0.04,
    OR: 0.099,
    default: 0.05,
  };
  const STATE_TAX = grossAnnual * (stateTaxRates[state] || stateTaxRates.default);

  const TOTAL_TAX = FEDERAL_TAX + FICA + STATE_TAX;
  const NET_ANNUAL = grossAnnual - TOTAL_TAX - INSURANCE_ANNUAL;
  return {
    netMonthly: Math.round(NET_ANNUAL / 12),
    netAnnual: NET_ANNUAL,
    totalTax: Math.round(TOTAL_TAX),
    insuranceAnnual: INSURANCE_ANNUAL,
  };
}

export function generateAllocation(grossAnnual, retirementGoal, goals, location) {
  const { netMonthly, netAnnual } = calculateNetIncome(grossAnnual, location);

  let allocations = {};

  allocations["Retirement (401k + IRA)"] = netMonthly * 0.20;
  allocations["Emergency Fund"] = netMonthly * 0.10;
  allocations["Daily Living (Food, Transport, Utilities)"] = netMonthly * 0.25;
  allocations["Subscriptions & Insurance"] = netMonthly * 0.05;

  let remaining = netMonthly - Object.values(allocations).reduce((a, b) => a + b, 0);

  const materialisticCount = goals.length;

  if (materialisticCount === 0 && retirementGoal !== "idk") {
    allocations["Flexible Savings & Investments"] = remaining * 0.4;
    allocations["Entertainment & Leisure"] = remaining * 0.6;
  } else if (materialisticCount > 0) {
    const goalShare = remaining * 0.55;
    const perGoal = goalShare / materialisticCount;
    goals.forEach((goal) => {
      allocations[goal] = perGoal;
    });
    allocations["Entertainment & Leisure"] = remaining * 0.45;
  }

  let warning = "";
  if (retirementGoal === "luxury" && grossAnnual < 100000) {
    warning = "⚠️ Luxury retirement may not be sustainable at your current income level. Consider a comfortable retirement goal instead.";
  }

  return { allocations, netMonthly, warning };
}
