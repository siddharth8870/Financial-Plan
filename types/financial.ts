export interface FinancialInput {
  age: number
  retirementAge: number
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  expectedAnnualReturn: number
  emergencyFundTarget: number
  houseDownPaymentTarget: number
  weddingFundTarget: number
  carFundTarget: number
  emergencyFundPriority: number
  housePriority: number
  weddingPriority: number
  carPriority: number
}

export interface AllocationSplit {
  emergencyFund: number
  house: number
  wedding: number
  car: number
  retirement: number
}

export interface GoalTimeline {
  name: string
  target: number
  monthlyContribution: number
  yearsNeeded: number
  monthsNeeded: number
  progressPercent: number
  color: string
  icon: string
  priority: number
}

export interface RetirementProjection {
  total: number
  rothIRA: number
  fourOhOneK: number
  projectionData: {
    age: number
    total: number
    roth: number
    fourOhOne: number
  }[]
}

export interface DashboardData {
  monthlySavings: number
  allocation: AllocationSplit
  goals: GoalTimeline[]
  retirement: RetirementProjection
}
