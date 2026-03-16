import type { FinancialInput, AllocationSplit, GoalTimeline, RetirementProjection } from '@/types/financial'

const ANNUAL_RETURN = 0.07 // 7% average annual return

/**
 * Calculate monthly savings from income and expenses
 */
export function calculateMonthlySavings(monthlyIncome: number, monthlyExpenses: number): number {
  return Math.max(0, monthlyIncome - monthlyExpenses)
}

/**
 * Calculate allocation split based on priorities
 */
export function calculateAllocationSplit(
  monthlySavings: number,
  allocations: {
    emergencyFundPercent: number
    housePercent: number
    weddingPercent: number
    carPercent: number
    retirementPercent: number
  }
): AllocationSplit {
  const total = 
    allocations.emergencyFundPercent + 
    allocations.housePercent + 
    allocations.weddingPercent + 
    allocations.carPercent + 
    allocations.retirementPercent

  // Normalize to 100%
  const normalizer = 100 / Math.max(total, 1)

  return {
    emergencyFund: (allocations.emergencyFundPercent * normalizer / 100) * monthlySavings,
    house: (allocations.housePercent * normalizer / 100) * monthlySavings,
    wedding: (allocations.weddingPercent * normalizer / 100) * monthlySavings,
    car: (allocations.carPercent * normalizer / 100) * monthlySavings,
    retirement: (allocations.retirementPercent * normalizer / 100) * monthlySavings,
  }
}

/**
 * Calculate goal timeline
 */
export function calculateGoalTimeline(
  goalName: string,
  target: number,
  monthlyContribution: number,
  color: string,
  icon: string,
  priority: number
): GoalTimeline {
  if (monthlyContribution <= 0) {
    return {
      name: goalName,
      target,
      monthlyContribution,
      yearsNeeded: 0,
      monthsNeeded: 0,
      progressPercent: 0,
      color,
      icon,
      priority,
    }
  }

  const monthsNeeded = target / monthlyContribution
  const yearsNeeded = monthsNeeded / 12

  return {
    name: goalName,
    target,
    monthlyContribution: Math.round(monthlyContribution),
    yearsNeeded: Math.round(yearsNeeded * 10) / 10, // Round to 1 decimal
    monthsNeeded: Math.ceil(monthsNeeded),
    progressPercent: Math.min(100, 0), // Will be updated based on current savings
    color,
    icon,
    priority,
  }
}

/**
 * Calculate compound growth for retirement
 */
export function calculateCompoundGrowth(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12
  const totalMonths = years * 12

  // Future value of lump sum
  const fvPrincipal = principal * Math.pow(1 + monthlyRate, totalMonths)

  // Future value of monthly contributions (annuity)
  const fvAnnuity = monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate

  return fvPrincipal + fvAnnuity
}

/**
 * Calculate retirement projection
 */
export function calculateRetirementProjection(
  monthlyRetirementContribution: number,
  currentAge: number,
  retirementAge: number,
  currentSavings: number = 0
): RetirementProjection {
  const yearsUntilRetirement = retirementAge - currentAge
  const monthlyRate = ANNUAL_RETURN / 12

  // Split contribution: 50% to 401k, 50% to Roth IRA
  const monthlyFourOhOneK = monthlyRetirementContribution * 0.5
  const monthlyRoth = monthlyRetirementContribution * 0.5

  // Generate projection data for chart
  const projectionData = []
  
  for (let age = currentAge; age <= retirementAge; age++) {
    const yearsFromNow = age - currentAge
    const monthsFromNow = yearsFromNow * 12

    const fourOhOne = calculateCompoundGrowth(
      currentSavings * 0.5,
      monthlyFourOhOneK,
      ANNUAL_RETURN,
      yearsFromNow
    )

    const roth = calculateCompoundGrowth(
      currentSavings * 0.5,
      monthlyRoth,
      ANNUAL_RETURN,
      yearsFromNow
    )

    const total = fourOhOne + roth

    projectionData.push({
      age,
      total: Math.round(total),
      roth: Math.round(roth),
      fourOhOne: Math.round(fourOhOne),
    })
  }

  const finalData = projectionData[projectionData.length - 1]

  return {
    total: finalData.total,
    rothIRA: finalData.roth,
    fourOhOneK: finalData.fourOhOne,
    projectionData,
  }
}

/**
 * Normalize allocation percentages to sum to 100
 */
export function normalizeAllocations(allocations: Record<string, number>): Record<string, number> {
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0)
  
  if (total === 0) return allocations

  const normalized: Record<string, number> = {}
  for (const [key, val] of Object.entries(allocations)) {
    normalized[key] = Math.round((val / total) * 100 * 100) / 100 // Round to 2 decimals
  }

  return normalized
}
