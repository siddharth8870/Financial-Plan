'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { AllocationSplit } from '@/types/financial'

interface PieAllocationChartProps {
  allocation: AllocationSplit
}

const COLORS = {
  emergencyFund: '#10b981',
  house: '#3b82f6',
  wedding: '#ec4899',
  car: '#f59e0b',
  retirement: '#8b5cf6',
}

const LABELS = {
  emergencyFund: 'Emergency Fund',
  house: 'House Down Payment',
  wedding: 'Wedding Fund',
  car: 'Car Fund',
  retirement: 'Retirement',
}

export function PieAllocationChart({ allocation }: PieAllocationChartProps) {
  const data = [
    { name: LABELS.emergencyFund, value: Math.round(allocation.emergencyFund) },
    { name: LABELS.house, value: Math.round(allocation.house) },
    { name: LABELS.wedding, value: Math.round(allocation.wedding) },
    { name: LABELS.car, value: Math.round(allocation.car) },
    { name: LABELS.retirement, value: Math.round(allocation.retirement) },
  ].filter(item => item.value > 0)

  const colorArray = [
    COLORS.emergencyFund,
    COLORS.house,
    COLORS.wedding,
    COLORS.car,
    COLORS.retirement,
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-gold/50 rounded-lg p-3">
          <p className="text-white font-semibold">{payload[0].name}</p>
          <p className="text-gold">${payload[0].value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-xl p-8 mb-8"
    >
      <h2 className="text-2xl font-bold text-gold mb-6">💳 Monthly Allocation Breakdown</h2>

      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorArray[index % colorArray.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-gray-300">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
        {Object.entries(allocation).map(([key, value]) => (
          <div key={key} className="p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400 mb-1">
              {LABELS[key as keyof typeof LABELS]}
            </p>
            <p className="font-semibold text-gold">${Math.round(value).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
