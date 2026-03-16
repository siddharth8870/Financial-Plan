'use client'

import { motion } from 'framer-motion'
import type { GoalTimeline } from '@/types/financial'
import { formatCurrency } from '@/lib/helpers'

interface SavingsGoalTimelineProps {
  goals: GoalTimeline[]
}

export function SavingsGoalTimeline({ goals }: SavingsGoalTimelineProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold text-gold mb-6">🎯 Savings Goal Timeline</h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {goals.map((goal) => (
          <motion.div
            key={goal.name}
            variants={item}
            className="glass rounded-lg p-6 border border-white/10 hover:border-white/20 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{goal.icon}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full`} style={{ backgroundColor: goal.color + '20', color: goal.color }}>
                {goal.name === 'Retirement' ? 'Ongoing' : 'Goal'}
              </span>
            </div>

            <h3 className="font-semibold text-white mb-3">{goal.name}</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Target Amount</p>
                <p className="text-lg font-bold text-gold">{formatCurrency(goal.target)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Monthly</p>
                  <p className="font-semibold text-white">{formatCurrency(goal.monthlyContribution)}/mo</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Timeline</p>
                  <p className="font-semibold text-white">{goal.yearsNeeded}y</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-400">Progress</p>
                  <p className="text-xs font-semibold text-gold">{goal.progressPercent}%</p>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: goal.color }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
