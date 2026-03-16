'use client'

import { motion } from 'framer-motion'

interface AllocationSlidersProps {
  allocations: {
    emergencyFund: number
    house: number
    wedding: number
    car: number
    retirement: number
  }
  onChange: (allocations: any) => void
}

const GOALS = [
  { key: 'emergencyFund', label: '🛡️ Emergency Fund', color: 'from-green-400 to-green-600' },
  { key: 'house', label: '🏠 House Down Payment', color: 'from-blue-400 to-blue-600' },
  { key: 'wedding', label: '💍 Wedding Fund', color: 'from-pink-400 to-pink-600' },
  { key: 'car', label: '🚗 Car Fund', color: 'from-amber-400 to-amber-600' },
  { key: 'retirement', label: '🎯 Retirement', color: 'from-purple-400 to-purple-600' },
]

export function AllocationSliders({ allocations, onChange }: AllocationSlidersProps) {
  const total = Object.values(allocations).reduce((a, b) => a + b, 0)

  const handleSliderChange = (key: string, value: number) => {
    const newAllocations = { ...allocations, [key]: value }
    onChange(newAllocations)
  }

  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-xl p-8 mb-8"
    >
      <h2 className="text-2xl font-bold text-gold mb-6">📊 Adjust Your Allocations</h2>
      <p className="text-gray-300 mb-6">Use sliders to adjust how your monthly savings are split</p>

      <div className="space-y-6">
        {GOALS.map((goal) => (
          <div key={goal.key} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-200">{goal.label}</label>
              <div className="text-right">
                <span className={`bg-gradient-to-r ${goal.color} bg-clip-text text-transparent font-bold text-lg`}>
                  {getPercentage(allocations[goal.key as keyof typeof allocations])}%
                </span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={allocations[goal.key as keyof typeof allocations]}
              onChange={(e) => handleSliderChange(goal.key, parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
              style={{
                background: `linear-gradient(to right, rgba(201, 169, 110, 0.5) 0%, rgba(201, 169, 110, 0.5) ${getPercentage(allocations[goal.key as keyof typeof allocations])}%, rgba(255,255,255,0.1) ${getPercentage(allocations[goal.key as keyof typeof allocations])}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />

            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getPercentage(allocations[goal.key as keyof typeof allocations])}%` }}
                transition={{ duration: 0.3 }}
                className={`h-full bg-gradient-to-r ${goal.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-white/5 border border-gold/30 rounded-lg">
        <p className="text-sm text-gray-300">
          <strong className="text-gold">Total allocation:</strong> {total}%
        </p>
        <p className="text-xs text-gray-400 mt-2">💡 Allocations are normalized to ensure they always sum to 100%</p>
      </div>
    </motion.div>
  )
}
