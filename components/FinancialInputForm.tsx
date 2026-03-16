'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { FinancialInput } from '@/types/financial'

interface FinancialInputFormProps {
  onSubmit: (data: FinancialInput) => void
  isLoading?: boolean
}

const DEFAULT_VALUES: FinancialInput = {
  age: 26,
  retirementAge: 65,
  monthlyIncome: 5000,
  monthlyExpenses: 2500,
  currentSavings: 10000,
  expectedAnnualReturn: 7,
  emergencyFundTarget: 15000,
  houseDownPaymentTarget: 45000,
  weddingFundTarget: 20000,
  carFundTarget: 12000,
  emergencyFundPriority: 2,
  housePriority: 1,
  weddingPriority: 3,
  carPriority: 2,
}

export function FinancialInputForm({ onSubmit, isLoading = false }: FinancialInputFormProps) {
  const [formData, setFormData] = useState<FinancialInput>(DEFAULT_VALUES)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'retirementAge' ? parseInt(value) : parseFloat(value),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const monthlySavings = Math.max(0, formData.monthlyIncome - formData.monthlyExpenses)

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-8 mb-8 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-2 text-gold">💰 Financial Planning Dashboard</h1>
      <p className="text-gray-400 mb-8">Enter your financial details to generate a personalized plan</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Personal Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gold">Personal Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="120"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Retirement Age</label>
            <input
              type="number"
              name="retirementAge"
              value={formData.retirementAge}
              onChange={handleChange}
              min="18"
              max="120"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
            />
          </div>
        </div>

        {/* Income & Expenses */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gold">Income & Expenses</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Income</label>
            <input
              type="number"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              min="0"
              step="100"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Expenses</label>
            <input
              type="number"
              name="monthlyExpenses"
              value={formData.monthlyExpenses}
              onChange={handleChange}
              min="0"
              step="100"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
            />
          </div>
        </div>
      </div>

      {/* Monthly Savings Display */}
      <div className="bg-white/5 border border-gold/30 rounded-lg p-4 mb-8">
        <p className="text-gray-300">
          <strong className="text-gold">Monthly Savings:</strong> ${monthlySavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Savings & Returns */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gold">Savings & Growth</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Savings ($)</label>
            <input
              type="number"
              name="currentSavings"
              value={formData.currentSavings}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Expected Annual Return (%)</label>
            <input
              type="number"
              name="expectedAnnualReturn"
              value={formData.expectedAnnualReturn}
              onChange={handleChange}
              min="-50"
              max="100"
              step="0.5"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
            />
          </div>
        </div>

        {/* Goals Targets */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gold">Goal Targets</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Emergency Fund</label>
              <input
                type="number"
                name="emergencyFundTarget"
                value={formData.emergencyFundTarget}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">House Down Payment</label>
              <input
                type="number"
                name="houseDownPaymentTarget"
                value={formData.houseDownPaymentTarget}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Wedding Fund</label>
              <input
                type="number"
                name="weddingFundTarget"
                value={formData.weddingFundTarget}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Car Fund</label>
              <input
                type="number"
                name="carFundTarget"
                value={formData.carFundTarget}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
              />
            </div>
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-gold to-yellow-400 text-black font-semibold hover:shadow-lg hover:shadow-gold/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating Plan...' : '🚀 Generate Financial Plan'}
      </motion.button>
    </motion.form>
  )
}
