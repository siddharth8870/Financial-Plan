'use client'

import { motion } from 'framer-motion'

interface StatCardProps {
  icon: string
  label: string
  value: string | number
  subtext?: string
  color?: string
  className?: string
}

export function StatCard({ icon, label, value, subtext, color = 'from-gold to-yellow-400', className = '' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`stat-card ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {value}
          </p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <span className="text-3xl md:text-4xl ml-4">{icon}</span>
      </div>
    </motion.div>
  )
}
