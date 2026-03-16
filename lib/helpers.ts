/**
 * Format number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format number with commas
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

/**
 * Format months to years and months
 */
export function formatTimeline(months: number): string {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years === 0) {
    return `${remainingMonths}m`
  }

  if (remainingMonths === 0) {
    return `${years}y`
  }

  return `${years}y ${remainingMonths}m`
}

/**
 * Format decimal to 1 decimal place
 */
export function formatDecimal(value: number, decimals: number = 1): string {
  return value.toFixed(decimals)
}

/**
 * Calculate percentage
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100 * 100) / 100
}

/**
 * Get color for progress bar
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 75) return '#10b981' // green
  if (percentage >= 50) return '#eab308' // yellow
  if (percentage >= 25) return '#f59e0b' // orange
  return '#ef4444' // red
}

/**
 * Validate financial inputs
 */
export function validateFinancialInput(data: any): string[] {
  const errors: string[] = []

  if (!data.age || data.age < 18 || data.age > 120) {
    errors.push('Age must be between 18 and 120')
  }

  if (!data.retirementAge || data.retirementAge <= data.age) {
    errors.push('Retirement age must be after current age')
  }

  if (data.monthlyIncome < 0) {
    errors.push('Monthly income cannot be negative')
  }

  if (data.monthlyExpenses < 0) {
    errors.push('Monthly expenses cannot be negative')
  }

  if (data.expectedAnnualReturn < -50 || data.expectedAnnualReturn > 100) {
    errors.push('Expected annual return should be between -50% and 100%')
  }

  return errors
}

/**
 * Generate color from name
 */
export function getColorFromName(name: string): string {
  const colors: Record<string, string> = {
    'Emergency Fund': '#10b981',
    'House Down Payment': '#3b82f6',
    'Wedding Fund': '#ec4899',
    'Car Fund': '#f59e0b',
    'Retirement': '#8b5cf6',
  }

  return colors[name] || '#C9A96E'
}

/**
 * Get icon from name
 */
export function getIconFromName(name: string): string {
  const icons: Record<string, string> = {
    'Emergency Fund': '🛡️',
    'House Down Payment': '🏠',
    'Wedding Fund': '💍',
    'Car Fund': '🚗',
    'Retirement': '🎯',
  }

  return icons[name] || '💰'
}
