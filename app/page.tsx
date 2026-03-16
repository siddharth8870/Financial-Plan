'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FinancialInputForm } from '@/components/FinancialInputForm'
import { AllocationSliders } from '@/components/AllocationSliders'
import { PieAllocationChart } from '@/components/PieAllocationChart'
import { SavingsGoalTimeline } from '@/components/SavingsGoalTimeline'
import { RetirementProjection } from '@/components/RetirementProjection'
import { TimelineAdjustSlider } from '@/components/TimelineAdjustSlider'
import { StatCard } from '@/components/StatCard'
import type { FinancialInput, AllocationSplit, GoalTimeline, RetirementProjection as RetirementProjectionType } from '@/types/financial'
import {
  calculateMonthlySavings,
  calculateAllocationSplit,
  calculateGoalTimeline,
  calculateRetirementProjection,
  normalizeAllocations,
} from '@/lib/financialCalculations'
import { getColorFromName, getIconFromName, formatCurrency } from '@/lib/helpers'

export default function Home() {
  const [financialInput, setFinancialInput] = useState<FinancialInput | null>(null)
  const [allocations, setAllocations] = useState({
    emergencyFund: 20,  // 20% - Emergency fund priority
    house: 35,          // 35% - House down payment priority
    wedding: 15,        // 15% - Wedding fund
    car: 15,            // 15% - Car fund
    retirement: 15,     // 15% - Retirement (reduced)
  })
  const [timelineYears, setTimelineYears] = useState(5)
  const [monthlySavings, setMonthlySavings] = useState(0)

  // Handle form submission
  const handleGeneratePlan = (data: FinancialInput) => {
    setFinancialInput(data)
    const savings = calculateMonthlySavings(data.monthlyIncome, data.monthlyExpenses)
    setMonthlySavings(savings)
  }

  // Calculate allocation split based on current allocations
  const allocationSplit = useMemo<AllocationSplit>(() => {
    if (!financialInput) return { emergencyFund: 0, house: 0, wedding: 0, car: 0, retirement: 0 }

    return calculateAllocationSplit(monthlySavings, {
      emergencyFundPercent: allocations.emergencyFund,
      housePercent: allocations.house,
      weddingPercent: allocations.wedding,
      carPercent: allocations.car,
      retirementPercent: allocations.retirement,
    })
  }, [monthlySavings, allocations, financialInput])

  // Calculate savings goals with timeline adjustment
  const savingsGoals = useMemo<GoalTimeline[]>(() => {
    if (!financialInput) return []

    // Calculate adjusted monthly contributions based on timeline
    const totalMonthlyNeeded = (
      financialInput.emergencyFundTarget +
      financialInput.houseDownPaymentTarget +
      financialInput.weddingFundTarget +
      financialInput.carFundTarget
    ) / (timelineYears * 12)

    const goals = [
      {
        name: 'Emergency Fund',
        target: financialInput.emergencyFundTarget,
        percent: allocations.emergencyFund,
        priority: financialInput.emergencyFundPriority,
      },
      {
        name: 'House Down Payment',
        target: financialInput.houseDownPaymentTarget,
        percent: allocations.house,
        priority: financialInput.housePriority,
      },
      {
        name: 'Wedding Fund',
        target: financialInput.weddingFundTarget,
        percent: allocations.wedding,
        priority: financialInput.weddingPriority,
      },
      {
        name: 'Car Fund',
        target: financialInput.carFundTarget,
        percent: allocations.car,
        priority: financialInput.carPriority,
      },
    ]

    return goals.map(goal => {
      // Calculate monthly contribution based on allocation percentage
      const monthlyContribution = (monthlySavings * goal.percent) / 100
      
      // Calculate actual months/years needed based on goal target and monthly contribution
      const monthsNeeded = monthlyContribution > 0 ? goal.target / monthlyContribution : 0
      const yearsNeeded = monthsNeeded / 12

      return calculateGoalTimeline(
        goal.name,
        goal.target,
        monthlyContribution,
        getColorFromName(goal.name),
        getIconFromName(goal.name),
        goal.priority
      )
    })
  }, [financialInput, allocations, timelineYears, monthlySavings])

  // Calculate retirement projection
  const retirementProjection = useMemo<RetirementProjectionType>(() => {
    if (!financialInput) return {
      total: 0,
      rothIRA: 0,
      fourOhOneK: 0,
      projectionData: [],
    }

    return calculateRetirementProjection(
      allocationSplit.retirement,
      financialInput.age,
      financialInput.retirementAge,
      financialInput.currentSavings
    )
  }, [financialInput, allocationSplit])

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-white/10 border border-gold/30">
            <p className="text-sm text-gold font-semibold">💡 Personalized Financial Planning</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!financialInput ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FinancialInputForm onSubmit={handleGeneratePlan} />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back Button */}
              <motion.button
                onClick={() => setFinancialInput(null)}
                whileHover={{ x: -5 }}
                className="mb-8 flex items-center gap-2 text-gold hover:text-yellow-400 transition font-semibold"
              >
                ← Back to Input
              </motion.button>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard
                  icon="💵"
                  label="Monthly Savings"
                  value={formatCurrency(monthlySavings)}
                  color="from-green-400 to-green-600"
                />
                <StatCard
                  icon="👤"
                  label={`Age ${financialInput.age}`}
                  value={`Retire at ${financialInput.retirementAge}`}
                  color="from-gold to-yellow-400"
                />
                <StatCard
                  icon="📈"
                  label="Expected Return"
                  value={`${financialInput.expectedAnnualReturn}% / year`}
                  color="from-blue-400 to-blue-600"
                />
              </div>

              {/* Allocation Sliders */}
              <AllocationSliders allocations={allocations} onChange={setAllocations} />

              {/* Pie Chart */}
              <PieAllocationChart allocation={allocationSplit} />

              {/* Savings Goals Timeline */}
              <SavingsGoalTimeline goals={savingsGoals} />

              {/* Retirement Projection */}
              <RetirementProjection projection={retirementProjection} />

              {/* Timeline Adjustment Slider */}
              <TimelineAdjustSlider timelineYears={timelineYears} onTimelineChange={setTimelineYears} />

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-center text-gray-500 text-sm py-8 border-t border-white/10"
              >
                <p>💡 This dashboard provides estimates based on your inputs. Consult a financial advisor for personalized advice.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
