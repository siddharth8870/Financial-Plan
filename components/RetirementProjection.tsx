'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { RetirementProjection } from '@/types/financial'
import { StatCard } from './StatCard'
import { formatCurrency } from '@/lib/helpers'

interface RetirementProjectionProps {
  projection: RetirementProjection
}

export function RetirementProjection({ projection }: RetirementProjectionProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-gold/50 rounded-lg p-3">
          <p className="text-gray-300 text-sm">Age {payload[0].payload.age}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-semibold">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold text-gold mb-6">🎯 Retirement Projection</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="💰"
          label="Total at 65"
          value={formatCurrency(projection.total)}
          color="from-gold to-yellow-400"
        />
        <StatCard
          icon="🏦"
          label="Roth IRA"
          value={formatCurrency(projection.rothIRA)}
          color="from-blue-400 to-blue-600"
        />
        <StatCard
          icon="📊"
          label="401(k)"
          value={formatCurrency(projection.fourOhOneK)}
          color="from-purple-400 to-purple-600"
        />
      </div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass rounded-xl p-8"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Portfolio Growth Over Time</h3>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projection.projectionData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="age"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-gray-300">{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#C9A96E"
                strokeWidth={3}
                dot={false}
                name="Total"
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="roth"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Roth IRA"
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="fourOhOne"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="401(k)"
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  )
}
